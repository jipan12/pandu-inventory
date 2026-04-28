import { useEffect, useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import SearchPanel, { SearchField } from '@/components/common/SearchPanel'
import DataTable from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import FormDialog, { FormSection, FormField, FormInput, FormSelect, FormTextarea } from '@/components/common/FormDialog'
import DetailDrawer, { DetailSection, DetailField } from '@/components/common/DetailDrawer'
import { createCrudApi } from '@/mock/api'
import { mockRoles } from '@/mock/data-more'
import { formatDateTime } from '@/utils/format'
import { STATUS_MAP, STATUS_OPTIONS } from '@/utils/constants'
import type { Role, PageParams } from '@/types'

const api = createCrudApi<Role>(mockRoles, {
  keywordFields: ['code', 'name'],
})

const emptyForm: Partial<Role> = { code: '', name: '', description: '' }

export default function RolePage() {
  const [list, setList] = useState<Role[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false); const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Role>>({ ...emptyForm })
  const [detailOpen, setDetailOpen] = useState(false); const [detail, setDetail] = useState<Role | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [permOpen, setPermOpen] = useState(false)

  const fetchData = useCallback(async () => { setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false) }, [params])
  useEffect(() => { fetchData() }, [fetchData])
  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }
  function openCreate() { setEditingId(null); setForm({ ...emptyForm }); setFormOpen(true) }
  function openEdit(r: Role) { setEditingId(r.id); setForm({ ...r }); setFormOpen(true) }
  function openDetail(r: Role) { setDetail(r); setDetailOpen(true) }
  async function handleFormSubmit() { if (!form.code || !form.name) return; setFormLoading(true); if (editingId) await api.update(editingId, form); else await api.create({ ...form, status: 'enabled', createdAt: new Date().toISOString() } as Role); setFormLoading(false); setFormOpen(false); fetchData() }
  async function handleDelete() { if (deleteId) { await api.remove(deleteId); setDeleteId(null); fetchData() } }
  async function handleToggleStatus(id: string) { await api.toggleStatus(id); fetchData() }
  function setField(f: keyof Role, v: string) { setForm((p) => ({ ...p, [f]: v })) }

  const columns = [
    { key: 'code', title: '角色编码', dataIndex: 'code' as keyof Role },
    { key: 'name', title: '角色名称', dataIndex: 'name' as keyof Role },
    { key: 'description', title: '角色说明', dataIndex: 'description' as keyof Role, width: '300px' },
    { key: 'status', title: '状态', render: (_: unknown, r: Role) => <StatusBadge status={r.status} statusMap={STATUS_MAP} /> },
    { key: 'createdAt', title: '创建时间', render: (_: unknown, r: Role) => formatDateTime(r.createdAt) },
    { key: 'actions', title: '操作', width: '240px', render: (_: unknown, r: Role) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openDetail(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">详情</button>
        <button onClick={() => openEdit(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">编辑</button>
        <button onClick={() => setPermOpen(true)} className="px-2 py-1 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded">分配权限</button>
        <button onClick={() => handleToggleStatus(r.id)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">{r.status === 'enabled' ? '禁用' : '启用'}</button>
        <button onClick={() => setDeleteId(r.id)} className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded">删除</button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="角色管理" description="管理系统角色和权限"><button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800"><Plus className="w-3.5 h-3.5" />新增角色</button></PageHeader>
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="编码/名称" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="使用状态"><FormSelect options={STATUS_OPTIONS} value={params.status || ''} onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />
      <FormDialog open={formOpen} title={editingId ? '编辑角色' : '新增角色'} loading={formLoading} onConfirm={handleFormSubmit} onCancel={() => setFormOpen(false)}>
        <FormSection title="基本信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="角色编码" required><FormInput value={form.code || ''} onChange={(e) => setField('code', e.target.value)} /></FormField>
            <FormField label="角色名称" required><FormInput value={form.name || ''} onChange={(e) => setField('name', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="权限说明"><FormTextarea value={form.description || ''} onChange={(e) => setField('description', e.target.value)} rows={3} /></FormSection>
      </FormDialog>
      <DetailDrawer open={detailOpen} title="角色详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="基本信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="角色编码" value={detail.code} mono /><DetailField label="角色名称" value={detail.name} />
            <DetailField label="状态" value={<StatusBadge status={detail.status} statusMap={STATUS_MAP} />} /><DetailField label="创建时间" value={formatDateTime(detail.createdAt)} />
          </div></DetailSection>
          <DetailSection title="权限说明"><p className="text-sm text-gray-600">{detail.description}</p></DetailSection>
        </>)}
      </DetailDrawer>
      <ConfirmDialog open={!!deleteId} title="确认删除" description="删除后关联用户将失去对应权限，确定删除吗？" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmDialog open={permOpen} title="分配权限" description="权限分配功能将在后续版本中实现，敬请期待。" variant="info" confirmText="知道了" onConfirm={() => setPermOpen(false)} onCancel={() => setPermOpen(false)} />
    </div>
  )
}
