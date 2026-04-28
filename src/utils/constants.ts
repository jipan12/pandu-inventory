// ==================== 状态选项 ====================

export const STATUS_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'enabled', label: '启用' },
  { value: 'disabled', label: '禁用' },
]

export const DOC_STATUS_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'draft', label: '草稿' },
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已审核' },
  { value: 'closed', label: '已关闭' },
  { value: 'voided', label: '已作废' },
]

export const INOUT_STATUS_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'pending', label: '待处理' },
  { value: 'partial', label: '部分完成' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
]

// ==================== 下拉选项 ====================

export const SUPPLIER_CATEGORY_OPTIONS = [
  { value: '', label: '全部' },
  { value: '电子元器件', label: '电子元器件' },
  { value: '五金配件', label: '五金配件' },
  { value: '化工原料', label: '化工原料' },
  { value: '机械设备', label: '机械设备' },
  { value: '包装材料', label: '包装材料' },
  { value: '自动化设备', label: '自动化设备' },
]

export const CUSTOMER_TYPE_OPTIONS = [
  { value: '', label: '全部' },
  { value: '电商平台', label: '电商平台' },
  { value: '大型商超', label: '大型商超' },
  { value: '连锁便利店', label: '连锁便利店' },
  { value: '批发经销商', label: '批发经销商' },
  { value: '餐饮连锁', label: '餐饮连锁' },
  { value: '生产制造企业', label: '生产制造企业' },
]

export const REGION_OPTIONS = [
  { value: '', label: '全部' },
  { value: '华南', label: '华南' },
  { value: '华东', label: '华东' },
  { value: '华北', label: '华北' },
  { value: '西南', label: '西南' },
  { value: '华中', label: '华中' },
  { value: '西北', label: '西北' },
]

export const SETTLEMENT_OPTIONS = [
  { value: '', label: '全部' },
  { value: '现结', label: '现结' },
  { value: '月结30天', label: '月结30天' },
  { value: '月结60天', label: '月结60天' },
  { value: '月结90天', label: '月结90天' },
  { value: '票到付款', label: '票到付款' },
]

export const PAYMENT_TERMS_OPTIONS = [
  { value: '', label: '请选择' },
  { value: '款到发货', label: '款到发货' },
  { value: '货到付款', label: '货到付款' },
  { value: '月结30天', label: '月结30天' },
  { value: '月结60天', label: '月结60天' },
  { value: '月结90天', label: '月结90天' },
]

export const PRODUCT_CATEGORY_OPTIONS = [
  { value: '', label: '全部' },
  { value: '电子元器件', label: '电子元器件' },
  { value: '五金配件', label: '五金配件' },
  { value: '化工原料', label: '化工原料' },
  { value: '机械设备', label: '机械设备' },
  { value: '包装材料', label: '包装材料' },
  { value: '自动化设备', label: '自动化设备' },
]

export const BRAND_OPTIONS = [
  { value: '', label: '全部' },
  { value: '华为', label: '华为' },
  { value: '小米', label: '小米' },
  { value: '联想', label: '联想' },
  { value: '海尔', label: '海尔' },
  { value: '格力', label: '格力' },
  { value: '美的', label: '美的' },
  { value: '西门子', label: '西门子' },
  { value: '施耐德', label: '施耐德' },
]

export const UNIT_OPTIONS = [
  { value: '', label: '请选择' },
  { value: '个', label: '个' },
  { value: '箱', label: '箱' },
  { value: '件', label: '件' },
  { value: '台', label: '台' },
  { value: '套', label: '套' },
  { value: 'kg', label: 'kg' },
  { value: 'm', label: 'm' },
  { value: '卷', label: '卷' },
  { value: '包', label: '包' },
]

export const WAREHOUSE_TYPE_OPTIONS = [
  { value: '', label: '全部' },
  { value: '主仓', label: '主仓' },
  { value: '分仓', label: '分仓' },
  { value: '前置仓', label: '前置仓' },
]

export const WAREHOUSE_OPTIONS = [
  { value: '', label: '全部' },
  { value: '华南总仓', label: '华南总仓' },
  { value: '华东分仓', label: '华东分仓' },
  { value: '华北分仓', label: '华北分仓' },
  { value: '西南分仓', label: '西南分仓' },
  { value: '华中分仓', label: '华中分仓' },
  { value: '西北分仓', label: '西北分仓' },
  { value: '深圳前置仓', label: '深圳前置仓' },
  { value: '上海前置仓', label: '上海前置仓' },
]

export const ORG_OPTIONS = [
  { value: '', label: '全部' },
  { value: '华南区公司', label: '华南区公司' },
  { value: '华东区公司', label: '华东区公司' },
  { value: '西南区公司', label: '西南区公司' },
  { value: '华北区公司', label: '华北区公司' },
  { value: '华中区公司', label: '华中区公司' },
  { value: '西北区公司', label: '西北区公司' },
]

export const STORE_TYPE_OPTIONS = [
  { value: '', label: '全部' },
  { value: '旗舰店', label: '旗舰店' },
  { value: '直营店', label: '直营店' },
  { value: '加盟店', label: '加盟店' },
  { value: '专柜', label: '专柜' },
  { value: '快闪店', label: '快闪店' },
]

export const BIZ_TYPE_OPTIONS = [
  { value: '', label: '全部' },
  { value: '采购入库', label: '采购入库' },
  { value: '销售出库', label: '销售出库' },
  { value: '采购退货出库', label: '采购退货出库' },
  { value: '销售退货入库', label: '销售退货入库' },
  { value: '库存调拨出库', label: '库存调拨出库' },
  { value: '库存调拨入库', label: '库存调拨入库' },
  { value: '库存调整', label: '库存调整' },
]

export const ADJUSTMENT_TYPE_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'surplus', label: '盘盈' },
  { value: 'loss', label: '盘亏' },
]

export const ROLE_OPTIONS = [
  { value: '', label: '全部' },
  { value: '系统管理员', label: '系统管理员' },
  { value: '采购经理', label: '采购经理' },
  { value: '采购员', label: '采购员' },
  { value: '销售经理', label: '销售经理' },
  { value: '销售员', label: '销售员' },
  { value: '仓库管理员', label: '仓库管理员' },
  { value: '财务主管', label: '财务主管' },
  { value: '会计', label: '会计' },
  { value: '出纳', label: '出纳' },
  { value: '运营总监', label: '运营总监' },
  { value: '普通用户', label: '普通用户' },
]

export const MENU_TYPE_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'menu', label: '菜单' },
  { value: 'button', label: '按钮' },
]

// ==================== 状态映射 ====================

export const STATUS_MAP: Record<string, { label: string; className: string }> = {
  enabled: { label: '启用', className: 'bg-green-100 text-green-700 ring-green-600/20' },
  disabled: { label: '禁用', className: 'bg-red-100 text-red-700 ring-red-600/20' },
}

export const DOC_STATUS_MAP: Record<string, { label: string; className: string }> = {
  draft: { label: '草稿', className: 'bg-gray-100 text-gray-600 ring-gray-500/20' },
  pending: { label: '待审核', className: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20' },
  approved: { label: '已审核', className: 'bg-green-100 text-green-700 ring-green-600/20' },
  closed: { label: '已关闭', className: 'bg-gray-100 text-gray-500 ring-gray-400/20' },
  voided: { label: '已作废', className: 'bg-red-100 text-red-700 ring-red-600/20' },
}

export const INOUT_STATUS_MAP: Record<string, { label: string; className: string }> = {
  pending: { label: '待处理', className: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20' },
  partial: { label: '部分完成', className: 'bg-blue-100 text-blue-700 ring-blue-600/20' },
  completed: { label: '已完成', className: 'bg-green-100 text-green-700 ring-green-600/20' },
  cancelled: { label: '已取消', className: 'bg-gray-100 text-gray-500 ring-gray-400/20' },
}
