import { Outlet } from 'react-router-dom'
import { Store } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-xl font-semibold text-gray-900">
          潘嘟进销存系统
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          中小企业进销存管理平台
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-200 rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
