import { createHashRouter, Navigate } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import SupplierPage from '@/pages/master-data/SupplierPage'
import CustomerPage from '@/pages/master-data/CustomerPage'
import ProductPage from '@/pages/master-data/ProductPage'
import WarehousePage from '@/pages/master-data/WarehousePage'
import StorePage from '@/pages/master-data/StorePage'
import PurchaseOrderPage from '@/pages/purchase/PurchaseOrderPage'
import PurchaseInboundPage from '@/pages/purchase/PurchaseInboundPage'
import SupplierReturnPage from '@/pages/purchase/SupplierReturnPage'
import SalesOrderPage from '@/pages/sales/SalesOrderPage'
import SalesOutboundPage from '@/pages/sales/SalesOutboundPage'
import CustomerReturnPage from '@/pages/sales/CustomerReturnPage'
import StockQueryPage from '@/pages/inventory/StockQueryPage'
import StockMovementPage from '@/pages/inventory/StockMovementPage'
import StockTransferPage from '@/pages/inventory/StockTransferPage'
import StockAdjustmentPage from '@/pages/inventory/StockAdjustmentPage'
import UserPage from '@/pages/system/UserPage'
import RolePage from '@/pages/system/RolePage'
import MenuPage from '@/pages/system/MenuPage'
import DictionaryPage from '@/pages/system/DictionaryPage'

export const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'master-data/suppliers', element: <SupplierPage /> },
          { path: 'master-data/customers', element: <CustomerPage /> },
          { path: 'master-data/products', element: <ProductPage /> },
          { path: 'master-data/warehouses', element: <WarehousePage /> },
          { path: 'master-data/stores', element: <StorePage /> },
          { path: 'purchase/orders', element: <PurchaseOrderPage /> },
          { path: 'purchase/inbounds', element: <PurchaseInboundPage /> },
          { path: 'purchase/returns', element: <SupplierReturnPage /> },
          { path: 'sales/orders', element: <SalesOrderPage /> },
          { path: 'sales/outbounds', element: <SalesOutboundPage /> },
          { path: 'sales/returns', element: <CustomerReturnPage /> },
          { path: 'inventory/stocks', element: <StockQueryPage /> },
          { path: 'inventory/movements', element: <StockMovementPage /> },
          { path: 'inventory/transfers', element: <StockTransferPage /> },
          { path: 'inventory/adjustments', element: <StockAdjustmentPage /> },
          { path: 'system/users', element: <UserPage /> },
          { path: 'system/roles', element: <RolePage /> },
          { path: 'system/menus', element: <MenuPage /> },
          { path: 'system/dictionaries', element: <DictionaryPage /> },
        ],
      },
    ],
  },
])
