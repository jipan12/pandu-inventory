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
import { mockWarehouses } from '@/mock/data'
import { formatDateTime } from '@/utils/format'
import { STATUS_MAP, WAREHOUSE_TYPE_OPTIONS, ORG_OPTIONS, STATUS_OPTIONS } from '@/utils/constants'
import type { Warehouse, PageParams } from '@/types'

const api = createCrudApi<Warehouse>(mockWarehouses, {
  keywordFields: ['code', 'name'],
  dateField: 'createdAt',
  categoryFields: { type: 'type', org: 'org' },
})

const emptyForm: Partial<Warehouse> = { code: '', name: '', type: '', org: '', address: '', manager: '', phone: '', area: 0, capacity: 0, remark: '' }

export default function WarehousePage() {
  const [list, setList] = useState<Warehouse[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Warehouse>>({ ...emptyForm })
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<Warehouse | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false)
  }, [params])
  useEffect(() => { fetchData() }, [fetchData])

  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }
  function openCreate() { setEditingId(null); setForm({ ...emptyForm, code: 'CK' + Date.now().toString().slice(-8) }); setFormOpen(true) }
  function openEdit(w: Warehouse) { setEditingId(w.id); setForm({ ...w }); setFormOpen(true) }
  function openDetail(w: Warehouse) { setDetail(w); setDetailOpen(true) }
  async function handleFormSubmit() {
    if (!form.name || !form.type || !form.org) return
    setFormLoading(true)
    if (editingId) await api.update(editingId, form)
    else await api.create({ ...form, status: 'enabled', createdAt: new Date().toISOString() } as Warehouse)
    setFormLoading(false); setFormOpen(false); fetchData()
  }
  async function handleDelete() { if (deleteId) { await api.remove(deleteId); setDeleteId(null); fetchData() } }
  async function handleToggleStatus(id: string) { await api.toggleStatus(id); fetchData() }
  function setField(f: keyof Warehouse, v: string | number) { setForm((p) => ({ ...p, [f]: v })) }

  const columns = [
    { key: 'code', title: '仓库编码', dataIndex: 'code' as keyof Warehouse },
    { key: 'name', title: '仓库名称', dataIndex: 'name' as keyof Warehouse },
    { key: 'type', title: '仓库类型', dataIndex: 'type' as keyof Warehouse },
    { key: 'org', title: '所属组织', dataIndex: 'org' as keyof Warehouse },
    { key: 'manager', title: '负责人', dataIndex: 'manager' as keyof Warehouse },
    { key: 'phone', title: '联系电话', dataIndex: 'phone' as keyof Warehouse },
    { key: 'address', title: '仓库地址', dataIndex: 'address' as keyof Warehouse, width: '180px' },
    { key: 'status', title: '状态', render: (_: unknown, r: Warehouse) => <StatusBadge status={r.status} statusMap={STATUS_MAP} /> },
    { key: 'createdAt', title: '创建时间', render: (_: unknown, r: Warehouse) => formatDateTime(r.createdAt) },
    { key: 'actions', title: '操作', width: '200px', render: (_: unknown, r: Warehouse) => (
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
      <PageHeader title="仓库管理" description="维护仓库基础信息"><button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800"><Plus className="w-3.5 h-3.5" />新增仓库</button></PageHeader>
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="编码/名称" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="仓库类型"><FormSelect options={WAREHOUSE_TYPE_OPTIONS} value={params.type as string || ''} onChange={(e) => setParams((p) => ({ ...p, type: e.target.value }))} /></SearchField>
        <SearchField label="所属组织"><FormSelect options={ORG_OPTIONS} value={params.org as string || ''} onChange={(e) => setParams((p) => ({ ...p, org: e.target.value }))} /></SearchField>
        <SearchField label="使用状态"><FormSelect options={STATUS_OPTIONS} value={params.status || ''} onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />
      <FormDialog open={formOpen} title={editingId ? '编辑仓库' : '新增仓库'} loading={formLoading} onConfirm={handleFormSubmit} onCancel={() => setFormOpen(false)}>
        <FormSection title="基本信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="仓库编码" required><FormInput value={form.code || ''} onChange={(e) => setField('code', e.target.value)} /></FormField>
            <FormField label="仓库名称" required><FormInput value={form.name || ''} onChange={(e) => setField('name', e.target.value)} /></FormField>
            <FormField label="仓库类型" required><FormSelect options={WAREHOUSE_TYPE_OPTIONS.filter(o => o.value !== '')} value={form.type || ''} onChange={(e) => setField('type', e.target.value)} /></FormField>
            <FormField label="所属组织" required><FormSelect options={ORG_OPTIONS.filter(o => o.value !== '')} value={form.org || ''} onChange={(e) => setField('org', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="位置与管理">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="仓库地址"><FormInput value={form.address || ''} onChange={(e) => setField('address', e.target.value)} /></FormField>
            <FormField label="负责人"><FormInput value={form.manager || ''} onChange={(e) => setField('manager', e.target.value)} /></FormField>
            <FormField label="联系电话"><FormInput value={form.phone || ''} onChange={(e) => setField('phone', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="仓储参数">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="仓库面积（㎡）"><FormInput type="number" value={form.area || ''} onChange={(e) => setField('area', Number(e.target.value))} /></FormField>
            <FormField label="仓储容量（m³）"><FormInput type="number" value={form.capacity || ''} onChange={(e) => setField('capacity', Number(e.target.value))} /></FormField>
          </div>
        </FormSection>
        <FormSection title="备注"><FormTextarea value={form.remark || ''} onChange={(e) => setField('remark', e.target.value)} /></FormSection>
      </FormDialog>
      <DetailDrawer open={detailOpen} title="仓库详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="基本信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="仓库编码" value={detail.code} mono /><DetailField label="仓库名称" value={detail.name} />
            <DetailField label="仓库类型" value={detail.type} /><DetailField label="所属组织" value={detail.org} />
            <DetailField label="状态" value={<StatusBadge status={detail.status} statusMap={STATUS_MAP} />} />
          </div></DetailSection>
          <DetailSection title="位置与管理"><div className="grid grid-cols-2 gap-2">
            <DetailField label="仓库地址" value={detail.address} /><DetailField label="负责人" value={detail.manager} />
            <DetailField label="联系电话" value={detail.phone} />
          </div></DetailSection>
          <DetailSection title="仓储参数"><div className="grid grid-cols-2 gap-2">
            <DetailField label="仓库面积" value={`${detail.area} ㎡`} /><DetailField label="仓储容量" value={`${detail.capacity} m³`} />
          </div></DetailSection>
        </>)}
      </DetailDrawer>
      <ConfirmDialog open={!!deleteId} title="确认删除" description="删除后数据不可恢复，确定要删除该仓库吗？" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
