import { useEffect, useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import SearchPanel, { SearchField } from '@/components/common/SearchPanel'
import DataTable from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import FormDialog, { FormSection, FormField, FormInput, FormSelect } from '@/components/common/FormDialog'
import DetailDrawer, { DetailSection, DetailField } from '@/components/common/DetailDrawer'
import { createCrudApi } from '@/mock/api'
import { mockMenus } from '@/mock/data-more'
import { STATUS_MAP, STATUS_OPTIONS, MENU_TYPE_OPTIONS } from '@/utils/constants'
import type { Menu, PageParams } from '@/types'

const api = createCrudApi<Menu>(mockMenus, {
  keywordFields: ['name', 'code'],
  categoryFields: { type: 'type' },
})

const emptyForm: Partial<Menu> = { name: '', code: '', parentId: null, route: '', type: 'menu', icon: '', permission: '', sort: 0 }

export default function MenuPage() {
  const [list, setList] = useState<Menu[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false); const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Menu>>({ ...emptyForm })
  const [detailOpen, setDetailOpen] = useState(false); const [detail, setDetail] = useState<Menu | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => { setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false) }, [params])
  useEffect(() => { fetchData() }, [fetchData])
  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }
  function openCreate() { setEditingId(null); setForm({ ...emptyForm }); setFormOpen(true) }
  function openEdit(m: Menu) { setEditingId(m.id); setForm({ ...m }); setFormOpen(true) }
  function openDetail(m: Menu) { setDetail(m); setDetailOpen(true) }
  async function handleFormSubmit() { if (!form.name) return; setFormLoading(true); if (editingId) await api.update(editingId, form); else await api.create({ ...form, status: 'enabled' } as Menu); setFormLoading(false); setFormOpen(false); fetchData() }
  async function handleDelete() { if (deleteId) { await api.remove(deleteId); setDeleteId(null); fetchData() } }
  async function handleToggleStatus(id: string) { await api.toggleStatus(id); fetchData() }
  function setField(f: keyof Menu, v: string | number | null) { setForm((p) => ({ ...p, [f]: v })) }

  const parentOptions = [{ value: '-', label: '-' }, ...mockMenus.filter(m => m.type === 'menu').map(m => ({ value: m.id, label: m.name }))]

  const columns = [
    { key: 'name', title: '菜单名称', dataIndex: 'name' as keyof Menu },
    { key: 'code', title: '菜单编码', dataIndex: 'code' as keyof Menu },
    { key: 'parentId', title: '上级菜单', render: (_: unknown, r: Menu) => r.parentId ? (mockMenus.find(m => m.id === r.parentId)?.name || r.parentId) : '-' },
    { key: 'route', title: '路由地址', dataIndex: 'route' as keyof Menu },
    { key: 'type', title: '类型', render: (_: unknown, r: Menu) => <StatusBadge status={r.type} statusMap={{ menu: { label: '菜单', className: 'bg-blue-100 text-blue-700 ring-blue-600/20' }, button: { label: '按钮', className: 'bg-purple-100 text-purple-700 ring-purple-600/20' } }} /> },
    { key: 'sort', title: '排序', dataIndex: 'sort' as keyof Menu },
    { key: 'status', title: '状态', render: (_: unknown, r: Menu) => <StatusBadge status={r.status} statusMap={STATUS_MAP} /> },
    { key: 'actions', title: '操作', width: '200px', render: (_: unknown, r: Menu) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openDetail(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">详情</button>
        <button onClick={() => openEdit(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">编辑</button>
        <button onClick={() => handleToggleStatus(r.id)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">{r.status === 'enabled' ? '禁用' : '启用'}</button>
        <button onClick={() => setDeleteId(r.id)} className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded">删除</button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="菜单管理" description="管理系统菜单和按钮权限"><button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800"><Plus className="w-3.5 h-3.5" />新增菜单</button></PageHeader>
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="菜单名称/编码" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="菜单类型"><FormSelect options={MENU_TYPE_OPTIONS} value={params.type as string || ''} onChange={(e) => setParams((p) => ({ ...p, type: e.target.value }))} /></SearchField>
        <SearchField label="使用状态"><FormSelect options={STATUS_OPTIONS} value={params.status || ''} onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />
      <FormDialog open={formOpen} title={editingId ? '编辑菜单' : '新增菜单'} loading={formLoading} onConfirm={handleFormSubmit} onCancel={() => setFormOpen(false)}>
        <FormSection title="基本信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="菜单名称" required><FormInput value={form.name || ''} onChange={(e) => setField('name', e.target.value)} /></FormField>
            <FormField label="菜单编码"><FormInput value={form.code || ''} onChange={(e) => setField('code', e.target.value)} /></FormField>
            <FormField label="上级菜单"><FormSelect options={parentOptions} value={form.parentId || '-'} onChange={(e) => setField('parentId', e.target.value === '-' ? null : e.target.value)} /></FormField>
            <FormField label="路由地址"><FormInput value={form.route || ''} onChange={(e) => setField('route', e.target.value)} /></FormField>
            <FormField label="菜单类型" required><FormSelect options={[{ value: 'menu', label: '菜单' }, { value: 'button', label: '按钮' }]} value={form.type || 'menu'} onChange={(e) => setField('type', e.target.value)} /></FormField>
            <FormField label="排序"><FormInput type="number" value={form.sort || ''} onChange={(e) => setField('sort', Number(e.target.value))} /></FormField>
          </div>
        </FormSection>
        <FormSection title="权限配置">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="图标名称"><FormInput value={form.icon || ''} onChange={(e) => setField('icon', e.target.value)} /></FormField>
            <FormField label="权限标识"><FormInput value={form.permission || ''} onChange={(e) => setField('permission', e.target.value)} placeholder="如 purchase:order:create" /></FormField>
          </div>
        </FormSection>
      </FormDialog>
      <DetailDrawer open={detailOpen} title="菜单详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="基本信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="菜单名称" value={detail.name} /><DetailField label="菜单编码" value={detail.code} mono />
            <DetailField label="上级菜单" value={detail.parentId ? (mockMenus.find(m => m.id === detail.parentId)?.name || '-') : '-'} />
            <DetailField label="路由地址" value={detail.route || '-'} />
            <DetailField label="类型" value={<StatusBadge status={detail.type} statusMap={{ menu: { label: '菜单', className: 'bg-blue-100 text-blue-700' }, button: { label: '按钮', className: 'bg-purple-100 text-purple-700' } }} />} />
            <DetailField label="排序" value={String(detail.sort)} />
          </div></DetailSection>
          <DetailSection title="权限配置"><div className="grid grid-cols-2 gap-2">
            <DetailField label="图标名称" value={detail.icon || '-'} /><DetailField label="权限标识" value={detail.permission || '-'} mono />
          </div></DetailSection>
        </>)}
      </DetailDrawer>
      <ConfirmDialog open={!!deleteId} title="确认删除" description="删除后子菜单将被一并移除，确定删除吗？" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
