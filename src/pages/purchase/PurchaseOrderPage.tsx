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
import { mockPurchaseOrders } from '@/mock/data-more'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { DOC_STATUS_MAP, DOC_STATUS_OPTIONS, ORG_OPTIONS } from '@/utils/constants'
import type { PurchaseOrder, PurchaseOrderItem, PageParams } from '@/types'

const api = createCrudApi<PurchaseOrder>(mockPurchaseOrders, {
  keywordFields: ['orderNo', 'supplierName'],
  dateField: 'orderDate',
  categoryFields: { supplierName: 'supplierName', docStatus: 'status' },
})

export default function PurchaseOrderPage() {
  const [list, setList] = useState<PurchaseOrder[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<PurchaseOrder | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: string; title: string; desc: string } | null>(null)

  // Form state
  const [supplierName, setSupplierName] = useState('')
  const [org, setOrg] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [expectedDate, setExpectedDate] = useState('')
  const [remark, setRemark] = useState('')
  const [items, setItems] = useState<PurchaseOrderItem[]>([
    { id: Date.now().toString(), productCode: '', productName: '', unit: '个', quantity: 0, unitPrice: 0, amount: 0, remark: '' },
  ])

  const fetchData = useCallback(async () => {
    setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false)
  }, [params])
  useEffect(() => { fetchData() }, [fetchData])

  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }
  const suppliers = [...new Set(mockPurchaseOrders.map(p => p.supplierName))]

  function openCreate() {
    setEditingId(null)
    setSupplierName(''); setOrg(''); setOrderDate(''); setExpectedDate(''); setRemark('')
    setItems([{ id: Date.now().toString(), productCode: '', productName: '', unit: '个', quantity: 0, unitPrice: 0, amount: 0, remark: '' }])
    setFormOpen(true)
  }
  function openEdit(po: PurchaseOrder) {
    if (po.status !== 'draft') return
    setEditingId(po.id)
    setSupplierName(po.supplierName); setOrg(po.org); setOrderDate(po.orderDate); setExpectedDate(po.expectedDate); setRemark('')
    setItems(po.items.map(i => ({ ...i })))
    setFormOpen(true)
  }
  function openDetail(po: PurchaseOrder) { setDetail(po); setDetailOpen(true) }

  function addItemRow() {
    setItems(prev => [...prev, { id: Date.now().toString() + Math.random(), productCode: '', productName: '', unit: '个', quantity: 0, unitPrice: 0, amount: 0, remark: '' }])
  }
  function updateItem(id: string, field: keyof PurchaseOrderItem, value: string | number) {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const updated = { ...item, [field]: value }
      if (field === 'quantity' || field === 'unitPrice') {
        updated.amount = updated.quantity * updated.unitPrice
      }
      return updated
    }))
  }
  function removeItemRow(id: string) { setItems(prev => prev.filter(i => i.id !== id)) }

  async function handleFormSubmit() {
    if (!supplierName) return
    setFormLoading(true)
    const totalAmount = items.reduce((sum, i) => sum + i.amount, 0)
    if (editingId) {
      await api.update(editingId, { supplierName, org, orderDate, expectedDate, items, totalAmount, remark })
    } else {
      const orderNo = api.generateOrderNo('PO')
      await api.create({ supplierName, org, orderDate, expectedDate, items, totalAmount, remark, orderNo, creator: '当前用户', status: 'draft' as const, createdAt: new Date().toISOString(), id: '' })
    }
    setFormLoading(false); setFormOpen(false); fetchData()
  }
  async function handleDelete() { if (deleteId) { await api.remove(deleteId); setDeleteId(null); fetchData() } }

  async function handleConfirmAction() {
    if (!confirmAction) return
    const { id, action } = confirmAction
    const newStatus = action === 'submit' ? 'pending' : action === 'approve' ? 'approved' : action === 'reject' ? 'voided' : 'closed'
    await api.updateStatus(id, newStatus)
    setConfirmAction(null); fetchData()
  }

  const columns = [
    { key: 'orderNo', title: '采购订单号', dataIndex: 'orderNo' as keyof PurchaseOrder },
    { key: 'supplierName', title: '供应商', dataIndex: 'supplierName' as keyof PurchaseOrder },
    { key: 'org', title: '采购组织', dataIndex: 'org' as keyof PurchaseOrder },
    { key: 'orderDate', title: '采购日期', dataIndex: 'orderDate' as keyof PurchaseOrder },
    { key: 'expectedDate', title: '预计到货', dataIndex: 'expectedDate' as keyof PurchaseOrder },
    { key: 'totalAmount', title: '订单金额', render: (_: unknown, r: PurchaseOrder) => formatCurrency(r.totalAmount) },
    { key: 'status', title: '状态', render: (_: unknown, r: PurchaseOrder) => <StatusBadge status={r.status} statusMap={DOC_STATUS_MAP} /> },
    { key: 'creator', title: '创建人', dataIndex: 'creator' as keyof PurchaseOrder },
    { key: 'createdAt', title: '创建时间', render: (_: unknown, r: PurchaseOrder) => formatDateTime(r.createdAt) },
    { key: 'actions', title: '操作', width: '280px', render: (_: unknown, r: PurchaseOrder) => (
      <div className="flex items-center gap-1 flex-wrap">
        <button onClick={() => openDetail(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">详情</button>
        {r.status === 'draft' && <button onClick={() => openEdit(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">编辑</button>}
        {r.status === 'draft' && <button onClick={() => setConfirmAction({ id: r.id, action: 'submit', title: '提交审核', desc: '提交后将进入待审核状态，确定提交吗？' })} className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded">提交审核</button>}
        {r.status === 'pending' && <button onClick={() => setConfirmAction({ id: r.id, action: 'approve', title: '审核通过', desc: '审核通过后将增加对应仓库库存，确定审核通过吗？' })} className="px-2 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded">审核通过</button>}
        {r.status === 'approved' && <button onClick={() => setConfirmAction({ id: r.id, action: 'reject', title: '反审核', desc: '反审核后订单将作废，确定执行吗？' })} className="px-2 py-1 text-xs text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded">反审核</button>}
        {r.status === 'approved' && <button onClick={() => setConfirmAction({ id: r.id, action: 'close', title: '关闭订单', desc: '关闭后订单将不可再操作，确定关闭吗？' })} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">关闭</button>}
        <button onClick={() => setDeleteId(r.id)} className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded">删除</button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="采购订单" description="管理采购订单全生命周期"><button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800"><Plus className="w-3.5 h-3.5" />新增采购订单</button></PageHeader>
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="订单号/供应商" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="供应商"><FormSelect options={[{ value: '', label: '全部' }, ...suppliers.map(s => ({ value: s, label: s }))]} value={params.supplierName as string || ''} onChange={(e) => setParams((p) => ({ ...p, supplierName: e.target.value }))} /></SearchField>
        <SearchField label="单据状态"><FormSelect options={DOC_STATUS_OPTIONS} value={params.docStatus as string || ''} onChange={(e) => setParams((p) => ({ ...p, docStatus: e.target.value }))} /></SearchField>
        <SearchField label="采购日期"><div className="flex items-center gap-2"><FormInput type="date" value={params.dateFrom as string || ''} onChange={(e) => setParams((p) => ({ ...p, dateFrom: e.target.value }))} /><span className="text-xs text-gray-400">至</span><FormInput type="date" value={params.dateTo as string || ''} onChange={(e) => setParams((p) => ({ ...p, dateTo: e.target.value }))} /></div></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />

      <FormDialog open={formOpen} title={editingId ? '编辑采购订单' : '新增采购订单'} loading={formLoading} onConfirm={handleFormSubmit} onCancel={() => setFormOpen(false)} maxWidth="max-w-4xl">
        <FormSection title="基本信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="供应商" required><FormInput value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder="输入供应商名称" /></FormField>
            <FormField label="采购组织" required><FormSelect options={ORG_OPTIONS.filter(o => o.value !== '')} value={org} onChange={(e) => setOrg(e.target.value)} /></FormField>
            <FormField label="采购日期"><FormInput type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} /></FormField>
            <FormField label="预计到货日期"><FormInput type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="商品明细">
          <div className="mb-2">
            <button type="button" onClick={addItemRow} className="text-xs text-blue-600 hover:text-blue-800">+ 添加商品行</button>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-500">商品编码</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500">商品名称</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500">单位</th>
                  <th className="px-2 py-2 text-right font-medium text-gray-500">数量</th>
                  <th className="px-2 py-2 text-right font-medium text-gray-500">单价</th>
                  <th className="px-2 py-2 text-right font-medium text-gray-500">金额</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500">备注</th>
                  <th className="px-2 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-2 py-1"><FormInput className="text-xs py-1" value={item.productCode} onChange={(e) => updateItem(item.id, 'productCode', e.target.value)} placeholder="编码" /></td>
                    <td className="px-2 py-1"><FormInput className="text-xs py-1" value={item.productName} onChange={(e) => updateItem(item.id, 'productName', e.target.value)} placeholder="名称" /></td>
                    <td className="px-2 py-1"><FormSelect className="text-xs py-1" options={[{ value: '个', label: '个' }, { value: '台', label: '台' }, { value: 'kg', label: 'kg' }, { value: '件', label: '件' }]} value={item.unit} onChange={(e) => updateItem(item.id, 'unit', e.target.value)} /></td>
                    <td className="px-2 py-1"><FormInput className="text-xs py-1 text-right" type="number" value={item.quantity || ''} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} /></td>
                    <td className="px-2 py-1"><FormInput className="text-xs py-1 text-right" type="number" step="0.01" value={item.unitPrice || ''} onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} /></td>
                    <td className="px-2 py-1 text-right font-mono">{formatCurrency(item.amount)}</td>
                    <td className="px-2 py-1"><FormInput className="text-xs py-1" value={item.remark} onChange={(e) => updateItem(item.id, 'remark', e.target.value)} /></td>
                    <td className="px-2 py-1"><button type="button" onClick={() => removeItemRow(item.id)} className="text-xs text-red-500 hover:text-red-700">删除</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormSection>
        <FormSection title="备注"><FormTextarea value={remark} onChange={(e) => setRemark(e.target.value)} /></FormSection>
      </FormDialog>

      <DetailDrawer open={detailOpen} title="采购订单详情" width="w-[680px]" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="基本信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="订单号" value={detail.orderNo} mono /><DetailField label="供应商" value={detail.supplierName} />
            <DetailField label="采购组织" value={detail.org} /><DetailField label="采购日期" value={detail.orderDate} />
            <DetailField label="预计到货" value={detail.expectedDate} /><DetailField label="状态" value={<StatusBadge status={detail.status} statusMap={DOC_STATUS_MAP} />} />
            <DetailField label="订单金额" value={formatCurrency(detail.totalAmount)} highlight />
          </div></DetailSection>
          <DetailSection title="商品明细">
            <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50"><tr>
                <th className="px-2 py-1.5 text-left font-medium text-gray-500">商品编码</th><th className="px-2 py-1.5 text-left font-medium text-gray-500">商品名称</th>
                <th className="px-2 py-1.5 text-right font-medium text-gray-500">数量</th><th className="px-2 py-1.5 text-right font-medium text-gray-500">单价</th>
                <th className="px-2 py-1.5 text-right font-medium text-gray-500">金额</th><th className="px-2 py-1.5 text-left font-medium text-gray-500">备注</th>
              </tr></thead>
              <tbody>
                {detail.items.map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-100">
                    <td className="px-2 py-1">{item.productCode}</td><td className="px-2 py-1">{item.productName}</td>
                    <td className="px-2 py-1 text-right">{item.quantity} {item.unit}</td><td className="px-2 py-1 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-2 py-1 text-right font-mono">{formatCurrency(item.amount)}</td><td className="px-2 py-1 text-gray-400">{item.remark || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DetailSection>
        </>)}
      </DetailDrawer>

      <ConfirmDialog open={!!deleteId} title="确认删除" description="删除后数据不可恢复，确定要删除该采购订单吗？" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmDialog
        open={!!confirmAction} title={confirmAction?.title || ''} description={confirmAction?.desc || ''}
        variant={confirmAction?.action === 'reject' ? 'warning' : 'info'} onConfirm={handleConfirmAction} onCancel={() => setConfirmAction(null)}
      />
    </div>
  )
}
