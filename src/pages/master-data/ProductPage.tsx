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
import { mockProducts } from '@/mock/data'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { STATUS_MAP, PRODUCT_CATEGORY_OPTIONS, BRAND_OPTIONS, UNIT_OPTIONS, STATUS_OPTIONS } from '@/utils/constants'
import type { Product, PageParams } from '@/types'

const api = createCrudApi<Product>(mockProducts, {
  keywordFields: ['code', 'name', 'barcode'],
  dateField: 'createdAt',
  categoryFields: { category: 'category', brand: 'brand' },
  rangeFields: { price: 'purchasePrice' },
})

const emptyForm: Partial<Product> = {
  code: '', name: '', barcode: '', category: '', brand: '', unit: '',
  spec: '', model: '', purchasePrice: 0, salesPrice: 0,
  minStock: 0, maxStock: 0, remark: '',
}

export default function ProductPage() {
  const [list, setList] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Product>>({ ...emptyForm })
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false)
  }, [params])

  useEffect(() => { fetchData() }, [fetchData])

  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }
  function openCreate() { setEditingId(null); setForm({ ...emptyForm, code: 'SP' + Date.now().toString().slice(-8) }); setFormOpen(true) }
  function openEdit(p: Product) { setEditingId(p.id); setForm({ ...p }); setFormOpen(true) }
  function openDetail(p: Product) { setDetail(p); setDetailOpen(true) }

  async function handleFormSubmit() {
    if (!form.name || !form.category || !form.unit) return
    setFormLoading(true)
    if (editingId) await api.update(editingId, form)
    else await api.create({ ...form, status: 'enabled', createdAt: new Date().toISOString() } as Product)
    setFormLoading(false); setFormOpen(false); fetchData()
  }
  async function handleDelete() { if (deleteId) { await api.remove(deleteId); setDeleteId(null); fetchData() } }
  async function handleToggleStatus(id: string) { await api.toggleStatus(id); fetchData() }
  function setField(f: keyof Product, v: string | number) { setForm((p) => ({ ...p, [f]: v })) }

  const columns = [
    { key: 'code', title: '商品编码', dataIndex: 'code' as keyof Product },
    { key: 'name', title: '商品名称', dataIndex: 'name' as keyof Product },
    { key: 'barcode', title: '商品条码', dataIndex: 'barcode' as keyof Product },
    { key: 'category', title: '分类', dataIndex: 'category' as keyof Product },
    { key: 'brand', title: '品牌', dataIndex: 'brand' as keyof Product },
    { key: 'unit', title: '单位', dataIndex: 'unit' as keyof Product },
    { key: 'purchasePrice', title: '采购价', render: (_: unknown, r: Product) => formatCurrency(r.purchasePrice) },
    { key: 'salesPrice', title: '销售价', render: (_: unknown, r: Product) => formatCurrency(r.salesPrice) },
    { key: 'status', title: '状态', render: (_: unknown, r: Product) => <StatusBadge status={r.status} statusMap={STATUS_MAP} /> },
    { key: 'createdAt', title: '创建时间', render: (_: unknown, r: Product) => formatDateTime(r.createdAt) },
    { key: 'actions', title: '操作', width: '200px', render: (_: unknown, r: Product) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openDetail(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">详情</button>
        <button onClick={() => openEdit(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">编辑</button>
        <button onClick={() => handleToggleStatus(r.id)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">{r.status === 'enabled' ? '禁用' : '启用'}</button>
        <button onClick={() => setDeleteId(r.id)} className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded">删除</button>
      </div>
    )},
  ]

  const grossMargin = detail ? ((detail.salesPrice - detail.purchasePrice) / detail.salesPrice * 100).toFixed(1) : '0'

  return (
    <div>
      <PageHeader title="商品管理" description="维护商品基础信息">
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800"><Plus className="w-3.5 h-3.5" />新增商品</button>
      </PageHeader>
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="编码/名称/条码" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="商品分类"><FormSelect options={PRODUCT_CATEGORY_OPTIONS} value={params.category as string || ''} onChange={(e) => setParams((p) => ({ ...p, category: e.target.value }))} /></SearchField>
        <SearchField label="品牌"><FormSelect options={BRAND_OPTIONS} value={params.brand as string || ''} onChange={(e) => setParams((p) => ({ ...p, brand: e.target.value }))} /></SearchField>
        <SearchField label="使用状态"><FormSelect options={STATUS_OPTIONS} value={params.status || ''} onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />
      <FormDialog open={formOpen} title={editingId ? '编辑商品' : '新增商品'} loading={formLoading} onConfirm={handleFormSubmit} onCancel={() => setFormOpen(false)}>
        <FormSection title="基本信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="商品编码" required><FormInput value={form.code || ''} onChange={(e) => setField('code', e.target.value)} /></FormField>
            <FormField label="商品名称" required><FormInput value={form.name || ''} onChange={(e) => setField('name', e.target.value)} /></FormField>
            <FormField label="商品条码"><FormInput value={form.barcode || ''} onChange={(e) => setField('barcode', e.target.value)} /></FormField>
            <FormField label="商品分类" required><FormSelect options={PRODUCT_CATEGORY_OPTIONS.filter(o => o.value !== '')} value={form.category || ''} onChange={(e) => setField('category', e.target.value)} /></FormField>
            <FormField label="品牌"><FormSelect options={BRAND_OPTIONS.filter(o => o.value !== '')} value={form.brand || ''} onChange={(e) => setField('brand', e.target.value)} /></FormField>
            <FormField label="基本单位" required><FormSelect options={UNIT_OPTIONS} value={form.unit || ''} onChange={(e) => setField('unit', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="规格参数">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="规格型号"><FormInput value={form.spec || ''} onChange={(e) => setField('spec', e.target.value)} /></FormField>
            <FormField label="产品规格"><FormInput value={form.model || ''} onChange={(e) => setField('model', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="价格与库存">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="采购价（元）"><FormInput type="number" step="0.01" value={form.purchasePrice || ''} onChange={(e) => setField('purchasePrice', parseFloat(e.target.value) || 0)} /></FormField>
            <FormField label="销售价（元）"><FormInput type="number" step="0.01" value={form.salesPrice || ''} onChange={(e) => setField('salesPrice', parseFloat(e.target.value) || 0)} /></FormField>
            <FormField label="最低库存"><FormInput type="number" value={form.minStock || ''} onChange={(e) => setField('minStock', Number(e.target.value))} /></FormField>
            <FormField label="最高库存"><FormInput type="number" value={form.maxStock || ''} onChange={(e) => setField('maxStock', Number(e.target.value))} /></FormField>
          </div>
        </FormSection>
        <FormSection title="备注"><FormTextarea value={form.remark || ''} onChange={(e) => setField('remark', e.target.value)} /></FormSection>
      </FormDialog>
      <DetailDrawer open={detailOpen} title="商品详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="基本信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="商品编码" value={detail.code} mono /><DetailField label="商品名称" value={detail.name} />
            <DetailField label="商品条码" value={detail.barcode} /><DetailField label="商品分类" value={detail.category} />
            <DetailField label="品牌" value={detail.brand} /><DetailField label="基本单位" value={detail.unit} />
          </div></DetailSection>
          <DetailSection title="规格与价格"><div className="grid grid-cols-2 gap-2">
            <DetailField label="规格型号" value={detail.spec} /><DetailField label="产品规格" value={detail.model} />
            <DetailField label="采购价" value={formatCurrency(detail.purchasePrice)} highlight />
            <DetailField label="销售价" value={formatCurrency(detail.salesPrice)} highlight />
            <DetailField label="毛利率" value={<span className="text-green-600 font-semibold">{grossMargin}%</span>} />
          </div></DetailSection>
          <DetailSection title="库存参数"><div className="grid grid-cols-2 gap-2">
            <DetailField label="最低库存" value={detail.minStock} /><DetailField label="最高库存" value={detail.maxStock} />
            <DetailField label="状态" value={<StatusBadge status={detail.status} statusMap={STATUS_MAP} />} /><DetailField label="创建时间" value={formatDateTime(detail.createdAt)} />
          </div></DetailSection>
        </>)}
      </DetailDrawer>
      <ConfirmDialog open={!!deleteId} title="确认删除" description="删除后数据不可恢复，确定要删除该商品吗？" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
