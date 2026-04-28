import { useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const routeNameMap: Record<string, string> = {
  '/dashboard': '数据看板',
  '/master-data': '基础资料',
  '/master-data/suppliers': '供应商管理',
  '/master-data/customers': '客户管理',
  '/master-data/products': '商品管理',
  '/master-data/warehouses': '仓库管理',
  '/master-data/stores': '门店管理',
  '/purchase': '采购管理',
  '/purchase/orders': '采购订单',
  '/purchase/inbounds': '采购入库',
  '/purchase/returns': '采购退货',
  '/sales': '销售管理',
  '/sales/orders': '销售订单',
  '/sales/outbounds': '销售出库',
  '/sales/returns': '销售退货',
  '/inventory': '库存管理',
  '/inventory/stocks': '库存查询',
  '/inventory/movements': '库存流水',
  '/inventory/transfers': '库存调拨',
  '/inventory/adjustments': '库存调整',
  '/system': '系统设置',
  '/system/users': '用户管理',
  '/system/roles': '角色管理',
  '/system/menus': '菜单管理',
  '/system/dictionaries': '数据字典',
}

export default function Breadcrumb() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (location.pathname === '/dashboard') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-gray-500 px-6 py-2">
        <Home className="w-3.5 h-3.5" />
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700">数据看板</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 px-6 py-2 flex-wrap">
      <Link to="/dashboard" className="hover:text-gray-700 transition-colors">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {segments.map((seg, idx) => {
        const path = '/' + segments.slice(0, idx + 1).join('/')
        const name = routeNameMap[path] || seg
        const isLast = idx === segments.length - 1
        return (
          <span key={path} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3" />
            {isLast ? (
              <span className="text-gray-700 font-medium">{name}</span>
            ) : (
              <Link to={path} className="hover:text-gray-700 transition-colors">
                {name}
              </Link>
            )}
          </span>
        )
      })}
    </div>
  )
}
