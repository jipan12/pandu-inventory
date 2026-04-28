import { useEffect, useState, useCallback } from 'react'
import { Plus, Eye, Pencil, Trash2, Loader2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import SearchPanel, { SearchField } from '@/components/common/SearchPanel'
import DataTable from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import FormDialog, { FormSection, FormField, FormInput, FormSelect, FormTextarea } from '@/components/common/FormDialog'
import DetailDrawer, { DetailSection, DetailField } from '@/components/common/DetailDrawer'
import { createCrudApi } from '@/mock/api'
import { mockSuppliers } from '@/mock/data'
import { formatDateTime } from '@/utils/format'
import { STATUS_MAP, SUPPLIER_CATEGORY_OPTIONS, SETTLEMENT_OPTIONS, PAYMENT_TERMS_OPTIONS, STATUS_OPTIONS } from '@/utils/constants'
import type { Supplier, PageParams } from '@/types'

const api = createCrudApi<Supplier>(mockSuppliers, {
  keywordFields: ['code', 'name', 'contact'],
  dateField: 'createdAt',
  categoryFields: { category: 'category', settlement: 'settlement' },
})

const emptyForm: Partial<Supplier> = {
  code: '', name: '', category: '', taxNumber: '',
  contact: '', phone: '', email: '', address: '',
  settlement: '', paymentTerms: '', bankName: '', bankAccount: '',
  remark: '',
}

export default function SupplierPage() {
  const [list, setList] = useState<Supplier[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })

  // 弹窗状态
  const [formOpen, setFormOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Supplier>>({ ...emptyForm })

  // 详情抽屉
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<Supplier | null>(null)

  // 删除确认
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
  function handleReset() {
    setParams({ page: 1, pageSize: 10 })
    setPage(1)
  }

  function openCreate() {
    setEditingId(null)
    setForm({ ...emptyForm, code: 'GYS' + Date.now().toString().slice(-8) })
    setFormOpen(true)
  }

  function openEdit(s: Supplier) {
    setEditingId(s.id)
    setForm({ ...s })
    setFormOpen(true)
  }

  function openDetail(s: Supplier) {
    setDetail(s)
    setDetailOpen(true)
  }

  async function handleFormSubmit() {
    if (!form.name || !form.category) return
    setFormLoading(true)
    if (editingId) {
      await api.update(editingId, form)
    } else {
      await api.create(form as Supplier)
    }
    setFormLoading(false)
    setFormOpen(false)
    fetchData()
  }

  async function handleDelete() {
    if (!deleteId) return
    await api.remove(deleteId)
    setDeleteId(null)
    fetchData()
  }

  async function handleToggleStatus(id: string) {
    await api.toggleStatus(id)
    fetchData()
  }

  function setFormField(field: keyof Supplier, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const columns = [
    { key: 'code', title: '供应商编码', dataIndex: 'code' as keyof Supplier },
    { key: 'name', title: '供应商名称', dataIndex: 'name' as keyof Supplier },
    { key: 'category', title: '分类', dataIndex: 'category' as keyof Supplier },
    { key: 'contact', title: '联系人', dataIndex: 'contact' as keyof Supplier },
    { key: 'phone', title: '联系电话', dataIndex: 'phone' as keyof Supplier },
    { key: 'settlement', title: '结算方式', dataIndex: 'settlement' as keyof Supplier },
    {
      key: 'status', title: '状态', render: (_: unknown, r: Supplier) => (
        <StatusBadge status={r.status} statusMap={STATUS_MAP} />
      ),
    },
    { key: 'createdAt', title: '创建时间', render: (_: unknown, r: Supplier) => formatDateTime(r.createdAt) },
    {
      key: 'actions', title: '操作', width: '200px',
      render: (_: unknown, r: Supplier) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openDetail(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">详情</button>
          <button onClick={() => openEdit(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">编辑</button>
          <button onClick={() => handleToggleStatus(r.id)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
            {r.status === 'enabled' ? '禁用' : '启用'}
          </button>
          <button onClick={() => setDeleteId(r.id)} className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded">删除</button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="供应商管理" description="维护供应商基础信息">
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800">
          <Plus className="w-3.5 h-3.5" />新增供应商
        </button>
      </PageHeader>

      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词">
          <FormInput placeholder="编码/名称/联系人" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} />
        </SearchField>
        <SearchField label="供应商分类">
          <FormSelect options={SUPPLIER_CATEGORY_OPTIONS} value={params.category as string || ''} onChange={(e) => setParams((p) => ({ ...p, category: e.target.value }))} />
        </SearchField>
        <SearchField label="结算方式">
          <FormSelect options={SETTLEMENT_OPTIONS} value={params.settlement as string || ''} onChange={(e) => setParams((p) => ({ ...p, settlement: e.target.value }))} />
        </SearchField>
        <SearchField label="使用状态">
          <FormSelect options={STATUS_OPTIONS} value={params.status || ''} onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))} />
        </SearchField>
      </SearchPanel>

      <DataTable
        columns={columns}
        dataSource={list}
        loading={loading}
        rowKey="id"
        pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }}
      />

      {/* 新增/编辑弹窗 */}
      <FormDialog
        open={formOpen}
        title={editingId ? '编辑供应商' : '新增供应商'}
        loading={formLoading}
        onConfirm={handleFormSubmit}
        onCancel={() => setFormOpen(false)}
      >
        <FormSection title="基本信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="供应商编码" required><FormInput value={form.code || ''} onChange={(e) => setFormField('code', e.target.value)} /></FormField>
            <FormField label="供应商名称" required><FormInput value={form.name || ''} onChange={(e) => setFormField('name', e.target.value)} /></FormField>
            <FormField label="供应商分类" required><FormSelect options={SUPPLIER_CATEGORY_OPTIONS.filter(o => o.value !== '')} value={form.category || ''} onChange={(e) => setFormField('category', e.target.value)} /></FormField>
            <FormField label="税号"><FormInput value={form.taxNumber || ''} onChange={(e) => setFormField('taxNumber', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="联系信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="联系人"><FormInput value={form.contact || ''} onChange={(e) => setFormField('contact', e.target.value)} /></FormField>
            <FormField label="联系电话"><FormInput value={form.phone || ''} onChange={(e) => setFormField('phone', e.target.value)} /></FormField>
            <FormField label="电子邮箱"><FormInput value={form.email || ''} onChange={(e) => setFormField('email', e.target.value)} /></FormField>
            <FormField label="联系地址"><FormInput value={form.address || ''} onChange={(e) => setFormField('address', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="财务信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="结算方式"><FormSelect options={SETTLEMENT_OPTIONS.filter(o => o.value !== '')} value={form.settlement || ''} onChange={(e) => setFormField('settlement', e.target.value)} /></FormField>
            <FormField label="付款条件"><FormSelect options={PAYMENT_TERMS_OPTIONS} value={form.paymentTerms || ''} onChange={(e) => setFormField('paymentTerms', e.target.value)} /></FormField>
            <FormField label="开户银行"><FormInput value={form.bankName || ''} onChange={(e) => setFormField('bankName', e.target.value)} /></FormField>
            <FormField label="银行账号"><FormInput value={form.bankAccount || ''} onChange={(e) => setFormField('bankAccount', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="备注">
          <FormTextarea value={form.remark || ''} onChange={(e) => setFormField('remark', e.target.value)} />
        </FormSection>
      </FormDialog>

      {/* 详情抽屉 */}
      <DetailDrawer open={detailOpen} title="供应商详情" onClose={() => setDetailOpen(false)}>
        {detail && (
          <>
            <DetailSection title="基本信息">
              <div className="grid grid-cols-2 gap-2">
                <DetailField label="供应商编码" value={detail.code} mono />
                <DetailField label="供应商名称" value={detail.name} />
                <DetailField label="供应商分类" value={detail.category} />
                <DetailField label="税号" value={detail.taxNumber} />
                <DetailField label="使用状态" value={<StatusBadge status={detail.status} statusMap={STATUS_MAP} />} />
                <DetailField label="创建时间" value={formatDateTime(detail.createdAt)} />
              </div>
            </DetailSection>
            <DetailSection title="联系信息">
              <div className="grid grid-cols-2 gap-2">
                <DetailField label="联系人" value={detail.contact} />
                <DetailField label="联系电话" value={detail.phone} />
                <DetailField label="电子邮箱" value={detail.email} />
                <DetailField label="联系地址" value={detail.address} />
              </div>
            </DetailSection>
            <DetailSection title="财务信息">
              <div className="grid grid-cols-2 gap-2">
                <DetailField label="结算方式" value={detail.settlement} />
                <DetailField label="付款条件" value={detail.paymentTerms} />
                <DetailField label="开户银行" value={detail.bankName} />
                <DetailField label="银行账号" value={detail.bankAccount} />
              </div>
            </DetailSection>
            {detail.remark && (
              <DetailSection title="备注">
                <p className="text-sm text-gray-600">{detail.remark}</p>
              </DetailSection>
            )}
          </>
        )}
      </DetailDrawer>

      {/* 删除确认 */}
      <ConfirmDialog
        open={!!deleteId}
        title="确认删除"
        description="删除后数据不可恢复，确定要删除该供应商吗？"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
