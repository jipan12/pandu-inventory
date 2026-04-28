import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Breadcrumb from '@/components/layout/Breadcrumb'

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className={`transition-all duration-200 ${
          sidebarCollapsed ? 'ml-16' : 'ml-56'
        }`}
      >
        <Header />
        <Breadcrumb />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
