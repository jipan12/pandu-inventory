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
import { mockSalesOutbounds } from '@/mock/data-more'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { INOUT_STATUS_MAP, INOUT_STATUS_OPTIONS, WAREHOUSE_OPTIONS } from '@/utils/constants'
import type { SalesOutbound, PageParams } from '@/types'

const api = createCrudApi<SalesOutbound>(mockSalesOutbounds, {
  keywordFields: ['outboundNo', 'sourceOrderNo', 'customerName'],
  dateField: 'outboundDate',
})

export default function SalesOutboundPage() {
  const [list, setList] = useState<SalesOutbound[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false); const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<SalesOutbound>>({ outboundNo: '', sourceOrderNo: '', customerName: '', warehouse: '', outboundDate: '', carrier: '', trackingNo: '', quantity: 0, amount: 0, remark: '' })
  const [detailOpen, setDetailOpen] = useState(false); const [detail, setDetail] = useState<SalesOutbound | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ id: string; title: string; desc: string } | null>(null)

  const fetchData = useCallback(async () => { setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false) }, [params])
  useEffect(() => { fetchData() }, [fetchData])
  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }
  function openCreate() { setEditingId(null); setForm({ outboundNo: api.generateOrderNo('SOB'), sourceOrderNo: '', customerName: '', warehouse: '', outboundDate: '', carrier: '', trackingNo: '', quantity: 0, amount: 0, remark: '' }); setFormOpen(true) }
  function openDetail(sb: SalesOutbound) { setDetail(sb); setDetailOpen(true) }
  async function handleFormSubmit() { if (!form.sourceOrderNo || !form.customerName || !form.warehouse) return; setFormLoading(true); if (editingId) await api.update(editingId, form); else await api.create({ ...form, status: 'pending', createdAt: new Date().toISOString() } as SalesOutbound); setFormLoading(false); setFormOpen(false); fetchData() }
  async function handleDelete() { if (deleteId) { await api.remove(deleteId); setDeleteId(null); fetchData() } }
  async function handleAudit() { if (confirmAction) { await api.updateStatus(confirmAction.id, 'completed'); setConfirmAction(null); fetchData() } }
  function setField(f: keyof SalesOutbound, v: string | number) { setForm((p) => ({ ...p, [f]: v })) }

  const columns = [
    { key: 'outboundNo', title: '出库单号', dataIndex: 'outboundNo' as keyof SalesOutbound },
    { key: 'sourceOrderNo', title: '来源销售订单号', dataIndex: 'sourceOrderNo' as keyof SalesOutbound },
    { key: 'customerName', title: '客户', dataIndex: 'customerName' as keyof SalesOutbound },
    { key: 'warehouse', title: '出库仓库', dataIndex: 'warehouse' as keyof SalesOutbound },
    { key: 'outboundDate', title: '出库日期', dataIndex: 'outboundDate' as keyof SalesOutbound },
    { key: 'quantity', title: '出库数量', render: (_: unknown, r: SalesOutbound) => r.quantity.toLocaleString() },
    { key: 'amount', title: '出库金额', render: (_: unknown, r: SalesOutbound) => formatCurrency(r.amount) },
    { key: 'status', title: '状态', render: (_: unknown, r: SalesOutbound) => <StatusBadge status={r.status} statusMap={INOUT_STATUS_MAP} /> },
    { key: 'createdAt', title: '创建时间', render: (_: unknown, r: SalesOutbound) => formatDateTime(r.createdAt) },
    { key: 'actions', title: '操作', width: '200px', render: (_: unknown, r: SalesOutbound) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openDetail(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">详情</button>
        {r.status === 'pending' && <button onClick={() => setConfirmAction({ id: r.id, title: '审核出库', desc: '审核通过后将扣减对应仓库库存，确定审核吗？' })} className="px-2 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded">审核出库</button>}
        <button onClick={() => setDeleteId(r.id)} className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded">删除</button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="销售出库" description="管理销售出库单"><button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800"><Plus className="w-3.5 h-3.5" />新增出库单</button></PageHeader>
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="出库单号/订单号/客户" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="单据状态"><FormSelect options={INOUT_STATUS_OPTIONS} value={params.status || ''} onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />
      <FormDialog open={formOpen} title="新增出库单" loading={formLoading} onConfirm={handleFormSubmit} onCancel={() => setFormOpen(false)}>
        <FormSection title="出库信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="出库单号"><FormInput value={form.outboundNo || ''} disabled /></FormField>
            <FormField label="来源销售订单号" required><FormInput value={form.sourceOrderNo || ''} onChange={(e) => setField('sourceOrderNo', e.target.value)} /></FormField>
            <FormField label="客户" required><FormInput value={form.customerName || ''} onChange={(e) => setField('customerName', e.target.value)} /></FormField>
            <FormField label="出库仓库" required><FormSelect options={WAREHOUSE_OPTIONS.filter(o => o.value !== '')} value={form.warehouse || ''} onChange={(e) => setField('warehouse', e.target.value)} /></FormField>
            <FormField label="出库日期" required><FormInput type="date" value={form.outboundDate || ''} onChange={(e) => setField('outboundDate', e.target.value)} /></FormField>
            <FormField label="承运商" required><FormInput value={form.carrier || ''} onChange={(e) => setField('carrier', e.target.value)} /></FormField>
            <FormField label="物流单号"><FormInput value={form.trackingNo || ''} onChange={(e) => setField('trackingNo', e.target.value)} /></FormField>
            <FormField label="出库数量" required><FormInput type="number" value={form.quantity || ''} onChange={(e) => setField('quantity', Number(e.target.value))} /></FormField>
            <FormField label="出库金额" required><FormInput type="number" step="0.01" value={form.amount || ''} onChange={(e) => setField('amount', parseFloat(e.target.value) || 0)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="备注"><FormTextarea value={form.remark || ''} onChange={(e) => setField('remark', e.target.value)} /></FormSection>
      </FormDialog>
      <DetailDrawer open={detailOpen} title="销售出库详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="出库信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="出库单号" value={detail.outboundNo} mono /><DetailField label="来源订单号" value={detail.sourceOrderNo} />
            <DetailField label="客户" value={detail.customerName} /><DetailField label="出库仓库" value={<span className="text-green-600 font-medium">{detail.warehouse}</span>} />
            <DetailField label="出库日期" value={detail.outboundDate} />
            <DetailField label="出库数量" value={<span className="text-lg font-semibold">{detail.quantity.toLocaleString()}</span>} highlight />
            <DetailField label="出库金额" value={<span className="text-lg font-semibold">{formatCurrency(detail.amount)}</span>} highlight />
          </div></DetailSection>
          <DetailSection title="物流信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="承运商" value={detail.carrier} /><DetailField label="物流单号" value={detail.trackingNo} />
          </div></DetailSection>
        </>)}
      </DetailDrawer>
      <ConfirmDialog open={!!deleteId} title="确认删除" description="删除后将影响库存流水，确定删除吗？" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmDialog open={!!confirmAction} title={confirmAction?.title || ''} description={confirmAction?.desc || ''} variant="info" onConfirm={handleAudit} onCancel={() => setConfirmAction(null)} />
    </div>
  )
}
