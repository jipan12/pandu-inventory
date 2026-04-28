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
import { mockStores } from '@/mock/data'
import { formatDateTime } from '@/utils/format'
import { STATUS_MAP, STORE_TYPE_OPTIONS, REGION_OPTIONS, STATUS_OPTIONS } from '@/utils/constants'
import type { Store, PageParams } from '@/types'

const api = createCrudApi<Store>(mockStores, {
  keywordFields: ['code', 'name', 'manager'],
  dateField: 'createdAt',
  categoryFields: { type: 'type', region: 'region' },
})

const emptyForm: Partial<Store> = { code: '', name: '', type: '', region: '', manager: '', phone: '', address: '', area: 0, businessHours: '', remark: '' }

export default function StorePage() {
  const [list, setList] = useState<Store[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Store>>({ ...emptyForm })
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<Store | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false)
  }, [params])
  useEffect(() => { fetchData() }, [fetchData])

  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }
  function openCreate() { setEditingId(null); setForm({ ...emptyForm, code: 'MD' + Date.now().toString().slice(-8) }); setFormOpen(true) }
  function openEdit(s: Store) { setEditingId(s.id); setForm({ ...s }); setFormOpen(true) }
  function openDetail(s: Store) { setDetail(s); setDetailOpen(true) }
  async function handleFormSubmit() {
    if (!form.name || !form.type || !form.region) return
    setFormLoading(true)
    if (editingId) await api.update(editingId, form)
    else await api.create({ ...form, status: 'enabled', createdAt: new Date().toISOString() } as Store)
    setFormLoading(false); setFormOpen(false); fetchData()
  }
  async function handleDelete() { if (deleteId) { await api.remove(deleteId); setDeleteId(null); fetchData() } }
  async function handleToggleStatus(id: string) { await api.toggleStatus(id); fetchData() }
  function setField(f: keyof Store, v: string | number) { setForm((p) => ({ ...p, [f]: v })) }

  const columns = [
    { key: 'code', title: '门店编码', dataIndex: 'code' as keyof Store },
    { key: 'name', title: '门店名称', dataIndex: 'name' as keyof Store },
    { key: 'type', title: '门店类型', dataIndex: 'type' as keyof Store },
    { key: 'region', title: '所属区域', dataIndex: 'region' as keyof Store },
    { key: 'manager', title: '店长', dataIndex: 'manager' as keyof Store },
    { key: 'phone', title: '联系电话', dataIndex: 'phone' as keyof Store },
    { key: 'address', title: '门店地址', dataIndex: 'address' as keyof Store, width: '180px' },
    { key: 'status', title: '状态', render: (_: unknown, r: Store) => <StatusBadge status={r.status} statusMap={STATUS_MAP} /> },
    { key: 'createdAt', title: '创建时间', render: (_: unknown, r: Store) => formatDateTime(r.createdAt) },
    { key: 'actions', title: '操作', width: '200px', render: (_: unknown, r: Store) => (
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
      <PageHeader title="门店管理" description="维护门店基础信息"><button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800"><Plus className="w-3.5 h-3.5" />新增门店</button></PageHeader>
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="编码/名称/店长" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="门店类型"><FormSelect options={STORE_TYPE_OPTIONS} value={params.type as string || ''} onChange={(e) => setParams((p) => ({ ...p, type: e.target.value }))} /></SearchField>
        <SearchField label="所属区域"><FormSelect options={REGION_OPTIONS} value={params.region as string || ''} onChange={(e) => setParams((p) => ({ ...p, region: e.target.value }))} /></SearchField>
        <SearchField label="使用状态"><FormSelect options={STATUS_OPTIONS} value={params.status || ''} onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />
      <FormDialog open={formOpen} title={editingId ? '编辑门店' : '新增门店'} loading={formLoading} onConfirm={handleFormSubmit} onCancel={() => setFormOpen(false)}>
        <FormSection title="基本信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="门店编码" required><FormInput value={form.code || ''} onChange={(e) => setField('code', e.target.value)} /></FormField>
            <FormField label="门店名称" required><FormInput value={form.name || ''} onChange={(e) => setField('name', e.target.value)} /></FormField>
            <FormField label="门店类型" required><FormSelect options={STORE_TYPE_OPTIONS.filter(o => o.value !== '')} value={form.type || ''} onChange={(e) => setField('type', e.target.value)} /></FormField>
            <FormField label="所属区域" required><FormSelect options={REGION_OPTIONS.filter(o => o.value !== '')} value={form.region || ''} onChange={(e) => setField('region', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="位置与管理">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="店长"><FormInput value={form.manager || ''} onChange={(e) => setField('manager', e.target.value)} /></FormField>
            <FormField label="联系电话"><FormInput value={form.phone || ''} onChange={(e) => setField('phone', e.target.value)} /></FormField>
            <FormField label="门店地址" className="col-span-2"><FormInput value={form.address || ''} onChange={(e) => setField('address', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="经营参数">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="营业面积（㎡）"><FormInput type="number" value={form.area || ''} onChange={(e) => setField('area', Number(e.target.value))} /></FormField>
            <FormField label="营业时间"><FormInput value={form.businessHours || ''} onChange={(e) => setField('businessHours', e.target.value)} placeholder="如 09:00-22:00" /></FormField>
          </div>
        </FormSection>
        <FormSection title="备注"><FormTextarea value={form.remark || ''} onChange={(e) => setField('remark', e.target.value)} /></FormSection>
      </FormDialog>
      <DetailDrawer open={detailOpen} title="门店详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="基本信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="门店编码" value={detail.code} mono /><DetailField label="门店名称" value={detail.name} />
            <DetailField label="门店类型" value={detail.type} /><DetailField label="所属区域" value={detail.region} />
          </div></DetailSection>
          <DetailSection title="位置与管理"><div className="grid grid-cols-2 gap-2">
            <DetailField label="店长" value={detail.manager} /><DetailField label="联系电话" value={detail.phone} />
            <DetailField label="门店地址" value={detail.address} />
          </div></DetailSection>
          <DetailSection title="经营参数"><div className="grid grid-cols-2 gap-2">
            <DetailField label="营业面积" value={`${detail.area} ㎡`} /><DetailField label="营业时间" value={detail.businessHours} />
            <DetailField label="状态" value={<StatusBadge status={detail.status} statusMap={STATUS_MAP} />} /><DetailField label="创建时间" value={formatDateTime(detail.createdAt)} />
          </div></DetailSection>
        </>)}
      </DetailDrawer>
      <ConfirmDialog open={!!deleteId} title="确认删除" description="删除后数据不可恢复，确定要删除该门店吗？" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
