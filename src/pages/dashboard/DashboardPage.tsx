import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, Package, AlertTriangle, ShoppingCart, ClipboardList } from 'lucide-react'
import { mockDashboard } from '@/mock/data-more'
import type { DashboardData } from '@/types'
import { formatCurrency, formatNumber } from '@/utils/format'
import StatusBadge from '@/components/common/StatusBadge'

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockDashboard)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-400">加载中...</p>
      </div>
    )
  }

  if (!data) return null

  const maxSales = Math.max(...data.salesTrend.map((s) => s.amount), 1)
  const maxPurchase = Math.max(...data.purchaseTrend.map((s) => s.amount), 1)

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-gray-900">数据看板</h1>
        <p className="mt-0.5 text-sm text-gray-500">进销存核心运营数据概览</p>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label="今日销售额"
          value={formatCurrency(data.todaySales)}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          icon={<ShoppingCart className="w-5 h-5" />}
          label="今日采购额"
          value={formatCurrency(data.todayPurchase)}
          color="text-purple-600"
          bg="bg-purple-50"
        />
        <StatCard
          icon={<Package className="w-5 h-5" />}
          label="库存SKU数"
          value={formatNumber(data.totalSkuCount)}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="库存预警"
          value={String(data.stockAlertCount)}
          color="text-red-600"
          bg="bg-red-50"
        />
        <StatCard
          icon={<ClipboardList className="w-5 h-5" />}
          label="待审核采购"
          value={String(data.pendingPurchaseOrders)}
          color="text-yellow-600"
          bg="bg-yellow-50"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="待出库销售"
          value={String(data.pendingSalesOrders)}
          color="text-indigo-600"
          bg="bg-indigo-50"
        />
      </div>

      {/* 趋势图 + 预警列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 近7日销售趋势 */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">近7日销售趋势</h3>
          <div className="flex items-end gap-1 h-40">
            {data.salesTrend.map((item) => {
              const height = (item.amount / maxSales) * 100
              return (
                <div key={item.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500 font-medium">
                    {formatCurrency(item.amount)}
                  </span>
                  <div
                    className="w-full bg-gray-900 rounded-t-sm transition-all"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className="text-[10px] text-gray-400">{item.date}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 近7日采购趋势 */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">近7日采购趋势</h3>
          <div className="flex items-end gap-1 h-40">
            {data.purchaseTrend.map((item) => {
              const height = (item.amount / maxPurchase) * 100
              return (
                <div key={item.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500 font-medium">
                    {formatCurrency(item.amount)}
                  </span>
                  <div
                    className="w-full bg-gray-400 rounded-t-sm transition-all"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className="text-[10px] text-gray-400">{item.date}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 库存预警 + 待办事项 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 库存预警列表 */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">库存预警列表</h3>
          <div className="space-y-2">
            {data.stockAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 px-3 bg-red-50/50 rounded-md"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">{alert.productName}</p>
                  <p className="text-xs text-gray-500">{alert.warehouse}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-semibold text-red-600">{alert.stock}</p>
                  <p className="text-xs text-gray-400">最低 {alert.minStock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 待办事项 */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">待办事项</h3>
          <div className="space-y-2">
            {data.todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-start gap-3 py-2 px-3 bg-gray-50/70 rounded-md"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    todo.urgent ? 'bg-red-500' : 'bg-yellow-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">
                    {todo.title}
                    {todo.urgent && (
                      <StatusBadge
                        status="urgent"
                        statusMap={{
                          urgent: { label: '紧急', className: 'bg-red-100 text-red-700 ring-red-600/20' },
                        }}
                        className="ml-2"
                      />
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{todo.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  bg: string
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${bg} ${color}`}>{icon}</div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-base font-semibold text-gray-900 mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  )
}
