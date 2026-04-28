import { useEffect, useState, useCallback } from 'react'
import PageHeader from '@/components/common/PageHeader'
import SearchPanel, { SearchField } from '@/components/common/SearchPanel'
import DataTable from '@/components/common/DataTable'
import DetailDrawer, { DetailSection, DetailField } from '@/components/common/DetailDrawer'
import { createCrudApi } from '@/mock/api'
import { mockStockItems } from '@/mock/data-more'
import { formatDateTime, formatNumber } from '@/utils/format'
import { PRODUCT_CATEGORY_OPTIONS, WAREHOUSE_OPTIONS } from '@/utils/constants'
import { FormInput, FormSelect } from '@/components/common/FormDialog'
import type { StockItem, PageParams } from '@/types'

const api = createCrudApi<StockItem>(mockStockItems, {
  keywordFields: ['productCode', 'productName'],
  categoryFields: { warehouse: 'warehouse', category: 'category' },
  rangeFields: { stock: 'totalStock' },
})

export default function StockQueryPage() {
  const [list, setList] = useState<StockItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<StockItem | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false)
  }, [params])
  useEffect(() => { fetchData() }, [fetchData])
  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }

  const columns = [
    { key: 'warehouse', title: '仓库', dataIndex: 'warehouse' as keyof StockItem },
    { key: 'productCode', title: '商品编码', dataIndex: 'productCode' as keyof StockItem },
    { key: 'productName', title: '商品名称', dataIndex: 'productName' as keyof StockItem },
    { key: 'category', title: '商品分类', dataIndex: 'category' as keyof StockItem },
    { key: 'unit', title: '单位', dataIndex: 'unit' as keyof StockItem },
    { key: 'totalStock', title: '总库存', render: (_: unknown, r: StockItem) => <span className="font-semibold">{formatNumber(r.totalStock)}</span> },
    { key: 'availableStock', title: '可用库存', render: (_: unknown, r: StockItem) => <span className="text-green-600 font-medium">{formatNumber(r.availableStock)}</span> },
    { key: 'lockedStock', title: '锁定库存', render: (_: unknown, r: StockItem) => <span className="text-yellow-600 font-medium">{formatNumber(r.lockedStock)}</span> },
    { key: 'frozenStock', title: '冻结库存', render: (_: unknown, r: StockItem) => <span className="text-red-600 font-medium">{formatNumber(r.frozenStock)}</span> },
    { key: 'updatedAt', title: '最近更新时间', render: (_: unknown, r: StockItem) => formatDateTime(r.updatedAt) },
    { key: 'actions', title: '操作', render: (_: unknown, r: StockItem) => (
      <button onClick={() => { setDetail(r); setDetailOpen(true) }} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">查看详情</button>
    )},
  ]

  return (
    <div>
      <PageHeader title="库存查询" description="查询各仓库商品库存情况" />
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="商品编码/名称" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="仓库"><FormSelect options={WAREHOUSE_OPTIONS} value={params.warehouse as string || ''} onChange={(e) => setParams((p) => ({ ...p, warehouse: e.target.value }))} /></SearchField>
        <SearchField label="商品分类"><FormSelect options={PRODUCT_CATEGORY_OPTIONS} value={params.category as string || ''} onChange={(e) => setParams((p) => ({ ...p, category: e.target.value }))} /></SearchField>
        <SearchField label="总库存最低"><FormInput type="number" placeholder="最低" value={params.minStock as string || ''} onChange={(e) => setParams((p) => ({ ...p, minStock: e.target.value }))} /></SearchField>
        <SearchField label="总库存最高"><FormInput type="number" placeholder="最高" value={params.maxStock as string || ''} onChange={(e) => setParams((p) => ({ ...p, maxStock: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />
      <DetailDrawer open={detailOpen} title="库存详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="商品信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="商品编码" value={detail.productCode} mono /><DetailField label="商品名称" value={detail.productName} />
            <DetailField label="商品分类" value={detail.category} /><DetailField label="单位" value={detail.unit} />
            <DetailField label="仓库" value={detail.warehouse} /><DetailField label="更新时间" value={formatDateTime(detail.updatedAt)} />
          </div></DetailSection>
          <DetailSection title="库存数量">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">总库存</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(detail.totalStock)}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-xs text-green-600 mb-1">可用库存</p>
                <p className="text-2xl font-bold text-green-700">{formatNumber(detail.availableStock)}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-xs text-yellow-600 mb-1">锁定库存</p>
                <p className="text-2xl font-bold text-yellow-700">{formatNumber(detail.lockedStock)}</p>
              </div>
            </div>
            {detail.frozenStock > 0 && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-xs text-red-600 mb-1">冻结库存</p>
                <p className="text-2xl font-bold text-red-700">{formatNumber(detail.frozenStock)}</p>
              </div>
            )}
          </DetailSection>
        </>)}
      </DetailDrawer>
    </div>
  )
}
