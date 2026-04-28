import { useEffect, useState, useCallback } from 'react'
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import SearchPanel, { SearchField } from '@/components/common/SearchPanel'
import DataTable from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import FormDialog, { FormSection, FormField, FormInput, FormSelect, FormTextarea } from '@/components/common/FormDialog'
import DetailDrawer, { DetailSection, DetailField } from '@/components/common/DetailDrawer'
import { createCrudApi } from '@/mock/api'
import { mockCustomers } from '@/mock/data'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { STATUS_MAP, CUSTOMER_TYPE_OPTIONS, REGION_OPTIONS, STATUS_OPTIONS } from '@/utils/constants'
import type { Customer, PageParams } from '@/types'

const api = createCrudApi<Customer>(mockCustomers, {
  keywordFields: ['code', 'name', 'contact'],
  dateField: 'createdAt',
  categoryFields: { type: 'type', region: 'region' },
})

const emptyForm: Partial<Customer> = {
  code: '', name: '', type: '', region: '',
  contact: '', phone: '', email: '', address: '',
  creditLimit: 0, taxNumber: '', remark: '',
}

export default function CustomerPage() {
  const [list, setList] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Customer>>({ ...emptyForm })
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<Customer | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await api.list(params)
    setList(res.list)
    setTotal(res.total)
    setLoading(false)
  }, [params])

  useEffect(() => { fetchData() }, [fetchData])

  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }
  function openCreate() { setEditingId(null); setForm({ ...emptyForm, code: 'KH' + Date.now().toString().slice(-8) }); setFormOpen(true) }
  function openEdit(c: Customer) { setEditingId(c.id); setForm({ ...c }); setFormOpen(true) }
  function openDetail(c: Customer) { setDetail(c); setDetailOpen(true) }

  async function handleFormSubmit() {
    if (!form.name || !form.type) return
    setFormLoading(true)
    if (editingId) await api.update(editingId, form)
    else await api.create(form as Customer)
    setFormLoading(false); setFormOpen(false); fetchData()
  }

  async function handleDelete() { if (deleteId) { await api.remove(deleteId); setDeleteId(null); fetchData() } }
  async function handleToggleStatus(id: string) { await api.toggleStatus(id); fetchData() }

  function setField(f: keyof Customer, v: string | number) { setForm((p) => ({ ...p, [f]: v })) }

  const columns = [
    { key: 'code', title: '客户编码', dataIndex: 'code' as keyof Customer },
    { key: 'name', title: '客户名称', dataIndex: 'name' as keyof Customer },
    { key: 'type', title: '客户类型', dataIndex: 'type' as keyof Customer },
    { key: 'contact', title: '联系人', dataIndex: 'contact' as keyof Customer },
    { key: 'phone', title: '联系电话', dataIndex: 'phone' as keyof Customer },
    { key: 'region', title: '所属区域', dataIndex: 'region' as keyof Customer },
    { key: 'creditLimit', title: '信用额度', render: (_: unknown, r: Customer) => formatCurrency(r.creditLimit) },
    { key: 'status', title: '状态', render: (_: unknown, r: Customer) => <StatusBadge status={r.status} statusMap={STATUS_MAP} /> },
    { key: 'createdAt', title: '创建时间', render: (_: unknown, r: Customer) => formatDateTime(r.createdAt) },
    { key: 'actions', title: '操作', width: '200px', render: (_: unknown, r: Customer) => (
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
      <PageHeader title="客户管理" description="维护客户基础信息">
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800"><Plus className="w-3.5 h-3.5" />新增客户</button>
      </PageHeader>
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="编码/名称/联系人" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="客户类型"><FormSelect options={CUSTOMER_TYPE_OPTIONS} value={params.type as string || ''} onChange={(e) => setParams((p) => ({ ...p, type: e.target.value }))} /></SearchField>
        <SearchField label="所属区域"><FormSelect options={REGION_OPTIONS} value={params.region as string || ''} onChange={(e) => setParams((p) => ({ ...p, region: e.target.value }))} /></SearchField>
        <SearchField label="使用状态"><FormSelect options={STATUS_OPTIONS} value={params.status || ''} onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />
      <FormDialog open={formOpen} title={editingId ? '编辑客户' : '新增客户'} loading={formLoading} onConfirm={handleFormSubmit} onCancel={() => setFormOpen(false)}>
        <FormSection title="基本信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="客户编码" required><FormInput value={form.code || ''} onChange={(e) => setField('code', e.target.value)} /></FormField>
            <FormField label="客户名称" required><FormInput value={form.name || ''} onChange={(e) => setField('name', e.target.value)} /></FormField>
            <FormField label="客户类型" required><FormSelect options={CUSTOMER_TYPE_OPTIONS.filter(o => o.value !== '')} value={form.type || ''} onChange={(e) => setField('type', e.target.value)} /></FormField>
            <FormField label="所属区域" required><FormSelect options={REGION_OPTIONS.filter(o => o.value !== '')} value={form.region || ''} onChange={(e) => setField('region', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="联系信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="联系人"><FormInput value={form.contact || ''} onChange={(e) => setField('contact', e.target.value)} /></FormField>
            <FormField label="联系电话"><FormInput value={form.phone || ''} onChange={(e) => setField('phone', e.target.value)} /></FormField>
            <FormField label="电子邮箱"><FormInput value={form.email || ''} onChange={(e) => setField('email', e.target.value)} /></FormField>
            <FormField label="联系地址"><FormInput value={form.address || ''} onChange={(e) => setField('address', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="财务信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="信用额度（元）"><FormInput type="number" value={form.creditLimit || ''} onChange={(e) => setField('creditLimit', Number(e.target.value))} /></FormField>
            <FormField label="税号"><FormInput value={form.taxNumber || ''} onChange={(e) => setField('taxNumber', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="备注"><FormTextarea value={form.remark || ''} onChange={(e) => setField('remark', e.target.value)} /></FormSection>
      </FormDialog>
      <DetailDrawer open={detailOpen} title="客户详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="基本信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="客户编码" value={detail.code} mono /><DetailField label="客户名称" value={detail.name} />
            <DetailField label="客户类型" value={detail.type} /><DetailField label="所属区域" value={detail.region} />
            <DetailField label="状态" value={<StatusBadge status={detail.status} statusMap={STATUS_MAP} />} /><DetailField label="创建时间" value={formatDateTime(detail.createdAt)} />
          </div></DetailSection>
          <DetailSection title="联系信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="联系人" value={detail.contact} /><DetailField label="联系电话" value={detail.phone} />
            <DetailField label="电子邮箱" value={detail.email} /><DetailField label="联系地址" value={detail.address} />
          </div></DetailSection>
          <DetailSection title="财务信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="信用额度" value={formatCurrency(detail.creditLimit)} highlight /><DetailField label="税号" value={detail.taxNumber} />
          </div></DetailSection>
          {detail.remark && <DetailSection title="备注"><p className="text-sm text-gray-600">{detail.remark}</p></DetailSection>}
        </>)}
      </DetailDrawer>
      <ConfirmDialog open={!!deleteId} title="确认删除" description="删除后数据不可恢复，确定要删除该客户吗？" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
