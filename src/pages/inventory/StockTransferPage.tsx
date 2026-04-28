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
import { mockStockTransfers } from '@/mock/data-more'
import { formatDateTime, formatNumber } from '@/utils/format'
import { DOC_STATUS_MAP, DOC_STATUS_OPTIONS, WAREHOUSE_OPTIONS } from '@/utils/constants'
import type { StockTransfer, PageParams } from '@/types'

const api = createCrudApi<StockTransfer>(mockStockTransfers, {
  keywordFields: ['transferNo', 'fromWarehouse', 'toWarehouse'],
  dateField: 'transferDate',
})

export default function StockTransferPage() {
  const [list, setList] = useState<StockTransfer[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false); const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<StockTransfer>>({ transferNo: '', fromWarehouse: '', toWarehouse: '', transferDate: '', quantity: 0, remark: '' })
  const [detailOpen, setDetailOpen] = useState(false); const [detail, setDetail] = useState<StockTransfer | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: string; title: string; desc: string } | null>(null)

  const fetchData = useCallback(async () => { setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false) }, [params])
  useEffect(() => { fetchData() }, [fetchData])
  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }
  function openCreate() { setEditingId(null); setForm({ transferNo: api.generateOrderNo('TF'), fromWarehouse: '', toWarehouse: '', transferDate: '', quantity: 0, remark: '' }); setFormOpen(true) }
  function openEdit(st: StockTransfer) { if (st.status !== 'draft') return; setEditingId(st.id); setForm({ ...st }); setFormOpen(true) }
  function openDetail(st: StockTransfer) { setDetail(st); setDetailOpen(true) }

  async function handleFormSubmit() {
    if (!form.fromWarehouse || !form.toWarehouse) return
    setFormLoading(true)
    if (editingId) await api.update(editingId, form)
    else await api.create({ ...form, status: 'draft', creator: '当前用户', createdAt: new Date().toISOString() } as StockTransfer)
    setFormLoading(false); setFormOpen(false); fetchData()
  }
  async function handleDelete() { if (deleteId) { await api.remove(deleteId); setDeleteId(null); fetchData() } }
  async function handleConfirmAction() { if (!confirmAction) return; const { id, action } = confirmAction; const newStatus = action === 'submit' ? 'pending' : action === 'approve' ? 'approved' : 'voided'; await api.updateStatus(id, newStatus); setConfirmAction(null); fetchData() }
  function setField(f: keyof StockTransfer, v: string | number) { setForm((p) => ({ ...p, [f]: v })) }

  const columns = [
    { key: 'transferNo', title: '调拨单号', dataIndex: 'transferNo' as keyof StockTransfer },
    { key: 'fromWarehouse', title: '调出仓库', dataIndex: 'fromWarehouse' as keyof StockTransfer },
    { key: 'toWarehouse', title: '调入仓库', dataIndex: 'toWarehouse' as keyof StockTransfer },
    { key: 'transferDate', title: '调拨日期', dataIndex: 'transferDate' as keyof StockTransfer },
    { key: 'quantity', title: '调拨数量', render: (_: unknown, r: StockTransfer) => formatNumber(r.quantity) },
    { key: 'status', title: '状态', render: (_: unknown, r: StockTransfer) => <StatusBadge status={r.status} statusMap={DOC_STATUS_MAP} /> },
    { key: 'creator', title: '创建人', dataIndex: 'creator' as keyof StockTransfer },
    { key: 'createdAt', title: '创建时间', render: (_: unknown, r: StockTransfer) => formatDateTime(r.createdAt) },
    { key: 'actions', title: '操作', width: '240px', render: (_: unknown, r: StockTransfer) => (
      <div className="flex items-center gap-1 flex-wrap">
        <button onClick={() => openDetail(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">详情</button>
        {r.status === 'draft' && <button onClick={() => openEdit(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">编辑</button>}
        {r.status === 'draft' && <button onClick={() => setConfirmAction({ id: r.id, action: 'submit', title: '提交审核', desc: '提交后将进入待审核状态' })} className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded">提交审核</button>}
        {r.status === 'pending' && <button onClick={() => setConfirmAction({ id: r.id, action: 'approve', title: '审核通过', desc: '审核后将扣减调出仓库库存并增加调入仓库库存，确定审核吗？' })} className="px-2 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded">审核通过</button>}
        {r.status === 'approved' && <button onClick={() => setConfirmAction({ id: r.id, action: 'reject', title: '反审核', desc: '反审核后调拨单将作废，确定执行吗？' })} className="px-2 py-1 text-xs text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded">反审核</button>}
        <button onClick={() => setDeleteId(r.id)} className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded">删除</button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="库存调拨" description="管理仓库间库存调拨"><button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800"><Plus className="w-3.5 h-3.5" />新增调拨单</button></PageHeader>
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="调拨单号/仓库" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="单据状态"><FormSelect options={DOC_STATUS_OPTIONS} value={params.status || ''} onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />
      <FormDialog open={formOpen} title={editingId ? '编辑调拨单' : '新增调拨单'} loading={formLoading} onConfirm={handleFormSubmit} onCancel={() => setFormOpen(false)}>
        <FormSection title="调拨信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="调拨单号"><FormInput value={form.transferNo || ''} disabled /></FormField>
            <FormField label="调拨日期" required><FormInput type="date" value={form.transferDate || ''} onChange={(e) => setField('transferDate', e.target.value)} /></FormField>
            <FormField label="调出仓库" required><FormSelect options={WAREHOUSE_OPTIONS.filter(o => o.value !== '')} value={form.fromWarehouse || ''} onChange={(e) => setField('fromWarehouse', e.target.value)} /></FormField>
            <FormField label="调入仓库" required><FormSelect options={WAREHOUSE_OPTIONS.filter(o => o.value !== '')} value={form.toWarehouse || ''} onChange={(e) => setField('toWarehouse', e.target.value)} /></FormField>
            <FormField label="调拨数量" required><FormInput type="number" value={form.quantity || ''} onChange={(e) => setField('quantity', Number(e.target.value))} /></FormField>
          </div>
        </FormSection>
        <FormSection title="备注"><FormTextarea value={form.remark || ''} onChange={(e) => setField('remark', e.target.value)} /></FormSection>
      </FormDialog>
      <DetailDrawer open={detailOpen} title="库存调拨详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="调拨信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="调拨单号" value={detail.transferNo} mono /><DetailField label="调拨日期" value={detail.transferDate} />
            <DetailField label="调出仓库" value={<span className="text-orange-600 font-medium">{detail.fromWarehouse}</span>} />
            <DetailField label="调入仓库" value={<span className="text-green-600 font-medium">{detail.toWarehouse}</span>} />
            <DetailField label="调拨数量" value={<span className="text-lg font-semibold">{formatNumber(detail.quantity)}</span>} highlight />
            <DetailField label="状态" value={<StatusBadge status={detail.status} statusMap={DOC_STATUS_MAP} />} />
          </div></DetailSection>
        </>)}
      </DetailDrawer>
      <ConfirmDialog open={!!deleteId} title="确认删除" description="删除后数据不可恢复" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmDialog open={!!confirmAction} title={confirmAction?.title || ''} description={confirmAction?.desc || ''} variant={confirmAction?.action === 'reject' ? 'warning' : 'info'} onConfirm={handleConfirmAction} onCancel={() => setConfirmAction(null)} />
    </div>
  )
}
