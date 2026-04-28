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
import { mockSupplierReturns } from '@/mock/data-more'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { INOUT_STATUS_MAP, INOUT_STATUS_OPTIONS, WAREHOUSE_OPTIONS } from '@/utils/constants'
import type { SupplierReturn, PageParams } from '@/types'

const api = createCrudApi<SupplierReturn>(mockSupplierReturns, {
  keywordFields: ['returnNo', 'supplierName'],
  dateField: 'returnDate',
})

export default function SupplierReturnPage() {
  const [list, setList] = useState<SupplierReturn[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<SupplierReturn>>({ returnNo: '', supplierName: '', warehouse: '', returnDate: '', quantity: 0, amount: 0, reason: '', remark: '' })
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<SupplierReturn | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ id: string; title: string; desc: string } | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false)
  }, [params])
  useEffect(() => { fetchData() }, [fetchData])
  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }
  function openCreate() { setEditingId(null); setForm({ returnNo: api.generateOrderNo('SR'), supplierName: '', warehouse: '', returnDate: '', quantity: 0, amount: 0, reason: '', remark: '' }); setFormOpen(true) }
  function openDetail(sr: SupplierReturn) { setDetail(sr); setDetailOpen(true) }
  async function handleFormSubmit() {
    if (!form.supplierName || !form.warehouse) return
    setFormLoading(true)
    if (editingId) await api.update(editingId, form)
    else await api.create({ ...form, status: 'pending', createdAt: new Date().toISOString() } as SupplierReturn)
    setFormLoading(false); setFormOpen(false); fetchData()
  }
  async function handleDelete() { if (deleteId) { await api.remove(deleteId); setDeleteId(null); fetchData() } }
  async function handleAudit() { if (confirmAction) { await api.updateStatus(confirmAction.id, 'completed'); setConfirmAction(null); fetchData() } }
  function setField(f: keyof SupplierReturn, v: string | number) { setForm((p) => ({ ...p, [f]: v })) }

  const columns = [
    { key: 'returnNo', title: '退货单号', dataIndex: 'returnNo' as keyof SupplierReturn },
    { key: 'supplierName', title: '供应商', dataIndex: 'supplierName' as keyof SupplierReturn },
    { key: 'warehouse', title: '退货仓库', dataIndex: 'warehouse' as keyof SupplierReturn },
    { key: 'returnDate', title: '退货日期', dataIndex: 'returnDate' as keyof SupplierReturn },
    { key: 'quantity', title: '退货数量', render: (_: unknown, r: SupplierReturn) => r.quantity.toLocaleString() },
    { key: 'amount', title: '退货金额', render: (_: unknown, r: SupplierReturn) => formatCurrency(r.amount) },
    { key: 'status', title: '状态', render: (_: unknown, r: SupplierReturn) => <StatusBadge status={r.status} statusMap={INOUT_STATUS_MAP} /> },
    { key: 'createdAt', title: '创建时间', render: (_: unknown, r: SupplierReturn) => formatDateTime(r.createdAt) },
    { key: 'actions', title: '操作', width: '200px', render: (_: unknown, r: SupplierReturn) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openDetail(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">详情</button>
        {r.status === 'pending' && <button onClick={() => setConfirmAction({ id: r.id, title: '审核退货', desc: '审核通过后将扣减对应仓库库存，确定审核吗？' })} className="px-2 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded">审核退货</button>}
        <button onClick={() => setDeleteId(r.id)} className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded">删除</button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="采购退货" description="管理采购退货单"><button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800"><Plus className="w-3.5 h-3.5" />新增退货单</button></PageHeader>
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="退货单号/供应商" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="单据状态"><FormSelect options={INOUT_STATUS_OPTIONS} value={params.status || ''} onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />
      <FormDialog open={formOpen} title={editingId ? '编辑退货单' : '新增退货单'} loading={formLoading} onConfirm={handleFormSubmit} onCancel={() => setFormOpen(false)}>
        <FormSection title="退货信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="退货单号"><FormInput value={form.returnNo || ''} disabled /></FormField>
            <FormField label="供应商" required><FormInput value={form.supplierName || ''} onChange={(e) => setField('supplierName', e.target.value)} /></FormField>
            <FormField label="退货仓库" required><FormSelect options={WAREHOUSE_OPTIONS.filter(o => o.value !== '')} value={form.warehouse || ''} onChange={(e) => setField('warehouse', e.target.value)} /></FormField>
            <FormField label="退货日期" required><FormInput type="date" value={form.returnDate || ''} onChange={(e) => setField('returnDate', e.target.value)} /></FormField>
            <FormField label="退货数量" required><FormInput type="number" value={form.quantity || ''} onChange={(e) => setField('quantity', Number(e.target.value))} /></FormField>
            <FormField label="退货金额" required><FormInput type="number" step="0.01" value={form.amount || ''} onChange={(e) => setField('amount', parseFloat(e.target.value) || 0)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="退货原因"><FormTextarea className="col-span-2" value={form.reason || ''} onChange={(e) => setField('reason', e.target.value)} rows={3} /></FormSection>
        <FormSection title="备注"><FormTextarea value={form.remark || ''} onChange={(e) => setField('remark', e.target.value)} /></FormSection>
      </FormDialog>
      <DetailDrawer open={detailOpen} title="采购退货详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="退货信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="退货单号" value={detail.returnNo} mono /><DetailField label="供应商" value={detail.supplierName} />
            <DetailField label="退货仓库" value={<span className="text-orange-600 font-medium">{detail.warehouse}</span>} />
            <DetailField label="退货日期" value={detail.returnDate} />
            <DetailField label="退货数量" value={<span className="text-lg font-semibold text-red-600">{detail.quantity.toLocaleString()}</span>} highlight />
            <DetailField label="退货金额" value={<span className="text-lg font-semibold">{formatCurrency(detail.amount)}</span>} highlight />
          </div></DetailSection>
          {detail.reason && <DetailSection title="退货原因"><p className="text-sm text-gray-600">{detail.reason}</p></DetailSection>}
        </>)}
      </DetailDrawer>
      <ConfirmDialog open={!!deleteId} title="确认删除" description="删除退货单将影响库存流水记录，确定删除吗？" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmDialog open={!!confirmAction} title={confirmAction?.title || ''} description={confirmAction?.desc || ''} variant="info" onConfirm={handleAudit} onCancel={() => setConfirmAction(null)} />
    </div>
  )
}
