import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Database, ShoppingCart, TrendingUp,
  Package, Settings, ChevronDown, ChevronRight,
  Store, Users, Shield, Menu as MenuIcon, FileText,
} from 'lucide-react'

interface MenuItem {
  code: string
  name: string
  icon: string
  route: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    code: 'home', name: '首页', icon: 'LayoutDashboard', route: '/dashboard',
  },
  {
    code: 'master-data', name: '基础资料', icon: 'Database', route: '/master-data',
    children: [
      { code: 'master-supplier', name: '供应商管理', icon: '', route: '/master-data/suppliers' },
      { code: 'master-customer', name: '客户管理', icon: '', route: '/master-data/customers' },
      { code: 'master-product', name: '商品管理', icon: '', route: '/master-data/products' },
      { code: 'master-warehouse', name: '仓库管理', icon: '', route: '/master-data/warehouses' },
      { code: 'master-store', name: '门店管理', icon: '', route: '/master-data/stores' },
    ],
  },
  {
    code: 'purchase', name: '采购管理', icon: 'ShoppingCart', route: '/purchase',
    children: [
      { code: 'purchase-order', name: '采购订单', icon: '', route: '/purchase/orders' },
      { code: 'purchase-inbound', name: '采购入库', icon: '', route: '/purchase/inbounds' },
      { code: 'purchase-return', name: '采购退货', icon: '', route: '/purchase/returns' },
    ],
  },
  {
    code: 'sales', name: '销售管理', icon: 'TrendingUp', route: '/sales',
    children: [
      { code: 'sales-order', name: '销售订单', icon: '', route: '/sales/orders' },
      { code: 'sales-outbound', name: '销售出库', icon: '', route: '/sales/outbounds' },
      { code: 'sales-return', name: '销售退货', icon: '', route: '/sales/returns' },
    ],
  },
  {
    code: 'inventory', name: '库存管理', icon: 'Package', route: '/inventory',
    children: [
      { code: 'inventory-stock', name: '库存查询', icon: '', route: '/inventory/stocks' },
      { code: 'inventory-movement', name: '库存流水', icon: '', route: '/inventory/movements' },
      { code: 'inventory-transfer', name: '库存调拨', icon: '', route: '/inventory/transfers' },
      { code: 'inventory-adjustment', name: '库存调整', icon: '', route: '/inventory/adjustments' },
    ],
  },
  {
    code: 'system', name: '系统设置', icon: 'Settings', route: '/system',
    children: [
      { code: 'system-user', name: '用户管理', icon: '', route: '/system/users' },
      { code: 'system-role', name: '角色管理', icon: '', route: '/system/roles' },
      { code: 'system-menu', name: '菜单管理', icon: '', route: '/system/menus' },
      { code: 'system-dict', name: '数据字典', icon: '', route: '/system/dictionaries' },
    ],
  },
]

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
}

function getIcon(iconName: string) {
  return iconMap[iconName] || <FileText className="w-5 h-5" />
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([
    'master-data', 'purchase', 'sales', 'inventory', 'system',
  ])

  function toggleExpand(code: string) {
    setExpandedMenus((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    )
  }

  function isMenuActive(item: MenuItem): boolean {
    if (item.route && location.pathname === item.route) return true
    if (item.children) {
      return item.children.some((child) => location.pathname === child.route)
    }
    return false
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-30 transition-all duration-200 flex flex-col ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-gray-200 shrink-0">
        {!collapsed && (
          <span className="text-base font-semibold text-gray-900 whitespace-nowrap">
            潘嘟进销存系统
          </span>
        )}
        <button
          onClick={onToggle}
          className={`p-1.5 rounded-md hover:bg-gray-100 text-gray-500 ${collapsed ? 'mx-auto' : 'ml-auto'}`}
        >
          <MenuIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-2">
        {menuItems.map((item) => {
          const active = isMenuActive(item)
          const expanded = expandedMenus.includes(item.code)

          if (!item.children || item.children.length === 0) {
            return (
              <NavLink
                key={item.code}
                to={item.route}
                className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.name : undefined}
              >
                {getIcon(item.icon)}
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            )
          }

          return (
            <div key={item.code}>
              <button
                onClick={() => toggleExpand(item.code)}
                className={`w-full flex items-center gap-3 mx-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  active && !expanded
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.name : undefined}
              >
                {getIcon(item.icon)}
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    {expanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </>
                )}
              </button>
              {expanded && !collapsed && (
                <div className="ml-7 mr-2 mt-0.5">
                  {item.children.map((child) => {
                    const childActive = location.pathname === child.route
                    return (
                      <NavLink
                        key={child.code}
                        to={child.route}
                        className={`block px-3 py-1.5 rounded-md text-xs transition-colors ${
                          childActive
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {child.name}
                      </NavLink>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
