// ==================== 通用类型 ====================

export type Status = 'enabled' | 'disabled'
export type DocStatus = 'draft' | 'pending' | 'approved' | 'closed' | 'voided'
export type InOutStatus = 'pending' | 'partial' | 'completed' | 'cancelled'

export interface PageParams {
  page: number
  pageSize: number
  keyword?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  [key: string]: unknown
}

export interface PaginatedResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// ==================== 认证相关 ====================

export interface UserInfo {
  id: string
  account: string
  name: string
  phone: string
  role: string
  avatar?: string
}

export interface LoginForm {
  account: string
  password: string
}

export interface RegisterForm {
  companyName: string
  name: string
  phone: string
  password: string
  confirmPassword: string
}

// ==================== 基础资料 ====================

export interface Supplier {
  id: string
  code: string
  name: string
  category: string
  contact: string
  phone: string
  email: string
  address: string
  settlement: string
  paymentTerms: string
  bankName: string
  bankAccount: string
  taxNumber: string
  remark: string
  status: Status
  createdAt: string
}

export interface Customer {
  id: string
  code: string
  name: string
  type: string
  region: string
  contact: string
  phone: string
  email: string
  address: string
  creditLimit: number
  taxNumber: string
  remark: string
  status: Status
  createdAt: string
}

export interface Product {
  id: string
  code: string
  name: string
  barcode: string
  category: string
  brand: string
  unit: string
  spec: string
  model: string
  purchasePrice: number
  salesPrice: number
  minStock: number
  maxStock: number
  remark: string
  status: Status
  createdAt: string
}

export interface Warehouse {
  id: string
  code: string
  name: string
  type: string
  org: string
  address: string
  manager: string
  phone: string
  area: number
  capacity: number
  remark: string
  status: Status
  createdAt: string
}

export interface Store {
  id: string
  code: string
  name: string
  type: string
  region: string
  manager: string
  phone: string
  address: string
  area: number
  businessHours: string
  remark: string
  status: Status
  createdAt: string
}

// ==================== 采购管理 ====================

export interface PurchaseOrderItem {
  id: string
  productCode: string
  productName: string
  unit: string
  quantity: number
  unitPrice: number
  amount: number
  remark: string
}

export interface PurchaseOrder {
  id: string
  orderNo: string
  supplierName: string
  org: string
  orderDate: string
  expectedDate: string
  items: PurchaseOrderItem[]
  totalAmount: number
  remark: string
  status: DocStatus
  creator: string
  createdAt: string
}

export interface PurchaseInbound {
  id: string
  inboundNo: string
  sourceOrderNo: string
  supplierName: string
  warehouse: string
  inboundDate: string
  inspector: string
  quantity: number
  amount: number
  remark: string
  status: InOutStatus
  createdAt: string
}

export interface SupplierReturn {
  id: string
  returnNo: string
  supplierName: string
  warehouse: string
  returnDate: string
  quantity: number
  amount: number
  reason: string
  remark: string
  status: InOutStatus
  createdAt: string
}

// ==================== 销售管理 ====================

export interface SalesOrderItem {
  id: string
  productCode: string
  productName: string
  unit: string
  quantity: number
  unitPrice: number
  amount: number
  remark: string
}

export interface SalesOrder {
  id: string
  orderNo: string
  customerName: string
  org: string
  orderDate: string
  expectedDate: string
  items: SalesOrderItem[]
  totalAmount: number
  remark: string
  status: DocStatus
  creator: string
  createdAt: string
}

export interface SalesOutbound {
  id: string
  outboundNo: string
  sourceOrderNo: string
  customerName: string
  warehouse: string
  outboundDate: string
  carrier: string
  trackingNo: string
  quantity: number
  amount: number
  remark: string
  status: InOutStatus
  createdAt: string
}

export interface CustomerReturn {
  id: string
  returnNo: string
  customerName: string
  warehouse: string
  returnDate: string
  quantity: number
  amount: number
  reason: string
  remark: string
  status: InOutStatus
  createdAt: string
}

// ==================== 库存管理 ====================

export interface StockItem {
  id: string
  warehouse: string
  productCode: string
  productName: string
  category: string
  unit: string
  totalStock: number
  availableStock: number
  lockedStock: number
  frozenStock: number
  updatedAt: string
}

export interface StockMovement {
  id: string
  movementNo: string
  bizType: string
  sourceType: string
  sourceNo: string
  warehouse: string
  productName: string
  beforeQty: number
  changeQty: number
  afterQty: number
  operator: string
  operatedAt: string
}

export interface StockTransfer {
  id: string
  transferNo: string
  fromWarehouse: string
  toWarehouse: string
  transferDate: string
  quantity: number
  remark: string
  status: DocStatus
  creator: string
  createdAt: string
}

export interface StockAdjustment {
  id: string
  adjustmentNo: string
  warehouse: string
  type: 'surplus' | 'loss'
  adjustmentDate: string
  quantity: number
  reason: string
  remark: string
  status: DocStatus
  creator: string
  createdAt: string
}

// ==================== 系统设置 ====================

export interface SystemUser {
  id: string
  account: string
  name: string
  phone: string
  email: string
  role: string
  status: Status
  lastLoginAt: string
  createdAt: string
}

export interface Role {
  id: string
  code: string
  name: string
  description: string
  status: Status
  createdAt: string
}

export interface Menu {
  id: string
  name: string
  code: string
  parentId: string | null
  route: string
  type: 'menu' | 'button'
  icon: string
  permission: string
  sort: number
  status: Status
}

export interface DictionaryItem {
  id: string
  dictCode: string
  dictName: string
  itemCode: string
  itemName: string
  sort: number
  status: Status
  remark: string
}

// ==================== 首页 ====================

export interface DashboardData {
  todaySales: number
  todayPurchase: number
  totalSkuCount: number
  stockAlertCount: number
  pendingPurchaseOrders: number
  pendingSalesOrders: number
  salesTrend: { date: string; amount: number }[]
  purchaseTrend: { date: string; amount: number }[]
  stockAlerts: { productName: string; warehouse: string; stock: number; minStock: number }[]
  todos: { id: string; type: string; title: string; description: string; urgent: boolean }[]
}
