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
import { mockStockAdjustments } from '@/mock/data-more'
import { formatDateTime, formatNumber } from '@/utils/format'
import { DOC_STATUS_MAP, DOC_STATUS_OPTIONS, WAREHOUSE_OPTIONS, ADJUSTMENT_TYPE_OPTIONS } from '@/utils/constants'
import type { StockAdjustment, PageParams } from '@/types'

const api = createCrudApi<StockAdjustment>(mockStockAdjustments, {
  keywordFields: ['adjustmentNo', 'warehouse'],
  dateField: 'adjustmentDate',
  categoryFields: { warehouse: 'warehouse', type: 'type' },
})

export default function StockAdjustmentPage() {
  const [list, setList] = useState<StockAdjustment[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false); const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<StockAdjustment>>({ adjustmentNo: '', warehouse: '', type: 'surplus', adjustmentDate: '', quantity: 0, reason: '', remark: '' })
  const [detailOpen, setDetailOpen] = useState(false); const [detail, setDetail] = useState<StockAdjustment | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: string; title: string; desc: string } | null>(null)

  const fetchData = useCallback(async () => { setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false) }, [params])
  useEffect(() => { fetchData() }, [fetchData])
  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }
  function openCreate() { setEditingId(null); setForm({ adjustmentNo: api.generateOrderNo('SA'), warehouse: '', type: 'surplus', adjustmentDate: '', quantity: 0, reason: '', remark: '' }); setFormOpen(true) }
  function openEdit(sa: StockAdjustment) { if (sa.status !== 'draft') return; setEditingId(sa.id); setForm({ ...sa, type: sa.type || 'surplus' }); setFormOpen(true) }
  function openDetail(sa: StockAdjustment) { setDetail(sa); setDetailOpen(true) }

  async function handleFormSubmit() {
    if (!form.warehouse || !form.type) return
    setFormLoading(true)
    if (editingId) {
      await api.update(editingId, form)
    } else {
      await api.create({ ...form, status: 'draft' as const, creator: '当前用户', createdAt: new Date().toISOString() } as StockAdjustment)
    }
    setFormLoading(false); setFormOpen(false); fetchData()
  }
  async function handleDelete() { if (deleteId) { await api.remove(deleteId); setDeleteId(null); fetchData() } }
  async function handleConfirmAction() { if (!confirmAction) return; const { id, action } = confirmAction; const newStatus = action === 'submit' ? 'pending' : action === 'approve' ? 'approved' : 'voided'; await api.updateStatus(id, newStatus); setConfirmAction(null); fetchData() }
  function setField(f: keyof StockAdjustment, v: string | number) { setForm((p) => ({ ...p, [f]: v })) }

  const columns = [
    { key: 'adjustmentNo', title: '调整单号', dataIndex: 'adjustmentNo' as keyof StockAdjustment },
    { key: 'warehouse', title: '调整仓库', dataIndex: 'warehouse' as keyof StockAdjustment },
    { key: 'type', title: '调整类型', render: (_: unknown, r: StockAdjustment) => <StatusBadge status={r.type || ''} statusMap={{ surplus: { label: '盘盈', className: 'bg-green-100 text-green-700 ring-green-600/20' }, loss: { label: '盘亏', className: 'bg-red-100 text-red-700 ring-red-600/20' } }} /> },
    { key: 'adjustmentDate', title: '调整日期', dataIndex: 'adjustmentDate' as keyof StockAdjustment },
    { key: 'quantity', title: '调整数量', render: (_: unknown, r: StockAdjustment) => <span className={r.quantity > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{(r.quantity > 0 ? '+' : '') + formatNumber(r.quantity)}</span> },
    { key: 'reason', title: '调整原因', dataIndex: 'reason' as keyof StockAdjustment, width: '200px' },
    { key: 'status', title: '状态', render: (_: unknown, r: StockAdjustment) => <StatusBadge status={r.status} statusMap={DOC_STATUS_MAP} /> },
    { key: 'creator', title: '创建人', dataIndex: 'creator' as keyof StockAdjustment },
    { key: 'createdAt', title: '创建时间', render: (_: unknown, r: StockAdjustment) => formatDateTime(r.createdAt) },
    { key: 'actions', title: '操作', width: '240px', render: (_: unknown, r: StockAdjustment) => (
      <div className="flex items-center gap-1 flex-wrap">
        <button onClick={() => openDetail(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">详情</button>
        {r.status === 'draft' && <button onClick={() => openEdit(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">编辑</button>}
        {r.status === 'draft' && <button onClick={() => setConfirmAction({ id: r.id, action: 'submit', title: '提交审核', desc: '提交后将进入待审核状态' })} className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded">提交审核</button>}
        {r.status === 'pending' && <button onClick={() => setConfirmAction({ id: r.id, action: 'approve', title: '审核通过', desc: `审核通过后将${r.type === 'surplus' ? '增加' : '扣减'}对应仓库库存，确定审核吗？` })} className="px-2 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded">审核通过</button>}
        {r.status === 'approved' && <button onClick={() => setConfirmAction({ id: r.id, action: 'reject', title: '反审核', desc: '反审核后调整单将作废，确定执行吗？' })} className="px-2 py-1 text-xs text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded">反审核</button>}
        <button onClick={() => setDeleteId(r.id)} className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded">删除</button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="库存调整" description="盘盈盘亏库存调整"><button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800"><Plus className="w-3.5 h-3.5" />新增调整单</button></PageHeader>
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="调整单号/仓库" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="仓库"><FormSelect options={WAREHOUSE_OPTIONS} value={params.warehouse as string || ''} onChange={(e) => setParams((p) => ({ ...p, warehouse: e.target.value }))} /></SearchField>
        <SearchField label="调整类型"><FormSelect options={ADJUSTMENT_TYPE_OPTIONS} value={params.type as string || ''} onChange={(e) => setParams((p) => ({ ...p, type: e.target.value }))} /></SearchField>
        <SearchField label="单据状态"><FormSelect options={DOC_STATUS_OPTIONS} value={params.status || ''} onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />
      <FormDialog open={formOpen} title={editingId ? '编辑调整单' : '新增调整单'} loading={formLoading} onConfirm={handleFormSubmit} onCancel={() => setFormOpen(false)}>
        <FormSection title="调整信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="调整单号"><FormInput value={form.adjustmentNo || ''} disabled /></FormField>
            <FormField label="调整日期" required><FormInput type="date" value={form.adjustmentDate || ''} onChange={(e) => setField('adjustmentDate', e.target.value)} /></FormField>
            <FormField label="调整仓库" required><FormSelect options={WAREHOUSE_OPTIONS.filter(o => o.value !== '')} value={form.warehouse || ''} onChange={(e) => setField('warehouse', e.target.value)} /></FormField>
            <FormField label="调整类型" required><FormSelect options={[{ value: 'surplus', label: '盘盈' }, { value: 'loss', label: '盘亏' }]} value={form.type || 'surplus'} onChange={(e) => setField('type', e.target.value)} /></FormField>
            <FormField label="调整数量" required><FormInput type="number" value={form.quantity || ''} onChange={(e) => setField('quantity', form.type === 'loss' ? -Math.abs(Number(e.target.value)) : Math.abs(Number(e.target.value)))} /></FormField>
          </div>
        </FormSection>
        <FormSection title="调整原因"><FormTextarea required value={form.reason || ''} onChange={(e) => setField('reason', e.target.value)} rows={3} /></FormSection>
        <FormSection title="备注"><FormTextarea value={form.remark || ''} onChange={(e) => setField('remark', e.target.value)} /></FormSection>
      </FormDialog>
      <DetailDrawer open={detailOpen} title="库存调整详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="调整信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="调整单号" value={detail.adjustmentNo} mono /><DetailField label="调整仓库" value={detail.warehouse} />
            <DetailField label="调整类型" value={<StatusBadge status={detail.type || ''} statusMap={{ surplus: { label: '盘盈', className: 'bg-green-100 text-green-700 ring-green-600/20' }, loss: { label: '盘亏', className: 'bg-red-100 text-red-700 ring-red-600/20' } }} />} />
            <DetailField label="调整日期" value={detail.adjustmentDate} />
            <DetailField label="调整数量" value={<span className={`text-lg font-semibold ${(detail.quantity || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>{(detail.quantity || 0) > 0 ? '+' : ''}{formatNumber(detail.quantity || 0)}</span>} highlight />
            <DetailField label="状态" value={<StatusBadge status={detail.status} statusMap={DOC_STATUS_MAP} />} />
          </div></DetailSection>
          {detail.reason && <DetailSection title="调整原因"><p className="text-sm text-gray-600">{detail.reason}</p></DetailSection>}
        </>)}
      </DetailDrawer>
      <ConfirmDialog open={!!deleteId} title="确认删除" description="删除后数据不可恢复" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmDialog open={!!confirmAction} title={confirmAction?.title || ''} description={confirmAction?.desc || ''} variant={confirmAction?.action === 'reject' ? 'warning' : 'info'} onConfirm={handleConfirmAction} onCancel={() => setConfirmAction(null)} />
    </div>
  )
}
