import type {
  PurchaseOrder, PurchaseInbound, SupplierReturn,
  SalesOrder, SalesOutbound, CustomerReturn,
  StockItem, StockMovement, StockTransfer, StockAdjustment,
  SystemUser, Role, Menu, DictionaryItem, DashboardData,
} from '@/types'

// ==================== 采购订单 ====================
export const mockPurchaseOrders: PurchaseOrder[] = [
  { id: 'po1', orderNo: 'PO20240301001', supplierName: '深圳电子科技有限公司', org: '华南区公司', orderDate: '2024-03-01', expectedDate: '2024-03-10', items: [{ id: 'poi1', productCode: 'SP20240001', productName: '集成电路芯片 ATmega328P', unit: '个', quantity: 500, unitPrice: 8.5, amount: 4250, remark: '' }], totalAmount: 4250, remark: '', status: 'approved', creator: '张三', createdAt: '2024-03-01T08:00:00Z' },
  { id: 'po2', orderNo: 'PO20240305001', supplierName: '广州五金机械有限公司', org: '华南区公司', orderDate: '2024-03-05', expectedDate: '2024-03-12', items: [{ id: 'poi2', productCode: 'SP20240002', productName: '不锈钢螺栓 M8x30', unit: '个', quantity: 10000, unitPrice: 0.35, amount: 3500, remark: '' }], totalAmount: 3500, remark: '', status: 'pending', creator: '张三', createdAt: '2024-03-05T09:00:00Z' },
  { id: 'po3', orderNo: 'PO20240310001', supplierName: '上海化工原料供应有限公司', org: '华东区公司', orderDate: '2024-03-10', expectedDate: '2024-03-18', items: [{ id: 'poi3', productCode: 'SP20240003', productName: '工业乙醇 99.5%', unit: 'kg', quantity: 200, unitPrice: 12, amount: 2400, remark: '' }], totalAmount: 2400, remark: '', status: 'approved', creator: '李四', createdAt: '2024-03-10T10:00:00Z' },
  { id: 'po4', orderNo: 'PO20240315001', supplierName: '北京机械设备制造有限公司', org: '华北区公司', orderDate: '2024-03-15', expectedDate: '2024-03-30', items: [{ id: 'poi4', productCode: 'SP20240004', productName: '数控机床主轴电机', unit: '台', quantity: 5, unitPrice: 8500, amount: 42500, remark: '急用' }], totalAmount: 42500, remark: '', status: 'draft', creator: '王五', createdAt: '2024-03-15T11:00:00Z' },
  { id: 'po5', orderNo: 'PO20240320001', supplierName: '成都包装材料有限公司', org: '西南区公司', orderDate: '2024-03-20', expectedDate: '2024-03-28', items: [{ id: 'poi5', productCode: 'SP20240005', productName: '防静电包装袋', unit: '包', quantity: 500, unitPrice: 15, amount: 7500, remark: '' }], totalAmount: 7500, remark: '', status: 'closed', creator: '张三', createdAt: '2024-03-20T14:00:00Z' },
  { id: 'po6', orderNo: 'PO20240401001', supplierName: '武汉自动化设备有限公司', org: '华中区公司', orderDate: '2024-04-01', expectedDate: '2024-04-15', items: [{ id: 'poi6', productCode: 'SP20240006', productName: 'PLC可编程控制器', unit: '台', quantity: 10, unitPrice: 3200, amount: 32000, remark: '' }], totalAmount: 32000, remark: '', status: 'approved', creator: '李四', createdAt: '2024-04-01T08:00:00Z' },
  { id: 'po7', orderNo: 'PO20240406001', supplierName: '杭州五金配件贸易有限公司', org: '华东区公司', orderDate: '2024-04-06', expectedDate: '2024-04-14', items: [{ id: 'poi7', productCode: 'SP20240008', productName: '六角螺母 M8', unit: '个', quantity: 20000, unitPrice: 0.08, amount: 1600, remark: '' }], totalAmount: 1600, remark: '', status: 'voided', creator: '王五', createdAt: '2024-04-06T09:00:00Z' },
  { id: 'po8', orderNo: 'PO20240412001', supplierName: '东莞电子元器件有限公司', org: '华南区公司', orderDate: '2024-04-12', expectedDate: '2024-04-20', items: [{ id: 'poi8', productCode: 'SP20240013', productName: '电容 100μF 16V', unit: '个', quantity: 5000, unitPrice: 0.15, amount: 750, remark: '' }], totalAmount: 750, remark: '', status: 'pending', creator: '张三', createdAt: '2024-04-12T10:00:00Z' },
  { id: 'po9', orderNo: 'PO20240420001', supplierName: '南京机械设备有限公司', org: '华东区公司', orderDate: '2024-04-20', expectedDate: '2024-05-10', items: [{ id: 'poi9', productCode: 'SP20240010', productName: '数控车床CK6150', unit: '台', quantity: 2, unitPrice: 65000, amount: 130000, remark: '' }], totalAmount: 130000, remark: '', status: 'draft', creator: '李四', createdAt: '2024-04-20T14:00:00Z' },
  { id: 'po10', orderNo: 'PO20240501001', supplierName: '苏州电子材料有限公司', org: '华东区公司', orderDate: '2024-05-01', expectedDate: '2024-05-12', items: [{ id: 'poi10', productCode: 'SP20240007', productName: '电阻 10KΩ 0805', unit: '个', quantity: 50000, unitPrice: 0.02, amount: 1000, remark: '' }], totalAmount: 1000, remark: '', status: 'approved', creator: '王五', createdAt: '2024-05-01T08:00:00Z' },
  { id: 'po11', orderNo: 'PO20240508001', supplierName: '西安电子科技有限公司', org: '西北区公司', orderDate: '2024-05-08', expectedDate: '2024-05-18', items: [{ id: 'poi11', productCode: 'SP20240019', productName: 'LED指示灯 红色', unit: '个', quantity: 8000, unitPrice: 0.08, amount: 640, remark: '' }], totalAmount: 640, remark: '', status: 'pending', creator: '张三', createdAt: '2024-05-08T09:00:00Z' },
  { id: 'po12', orderNo: 'PO20240515001', supplierName: '佛山自动化科技有限公司', org: '华南区公司', orderDate: '2024-05-15', expectedDate: '2024-05-25', items: [{ id: 'poi12', productCode: 'SP20240012', productName: '伺服驱动器', unit: '台', quantity: 8, unitPrice: 4500, amount: 36000, remark: '' }], totalAmount: 36000, remark: '', status: 'draft', creator: '李四', createdAt: '2024-05-15T10:00:00Z' },
  { id: 'po13', orderNo: 'PO20240520001', supplierName: '厦门包装制品有限公司', org: '华南区公司', orderDate: '2024-05-20', expectedDate: '2024-05-30', items: [{ id: 'poi13', productCode: 'SP20240011', productName: '纸箱 50x40x30cm', unit: '个', quantity: 3000, unitPrice: 2.8, amount: 8400, remark: '' }], totalAmount: 8400, remark: '', status: 'approved', creator: '王五', createdAt: '2024-05-20T11:00:00Z' },
  { id: 'po14', orderNo: 'PO20240601001', supplierName: '深圳电子科技有限公司', org: '华南区公司', orderDate: '2024-06-01', expectedDate: '2024-06-12', items: [{ id: 'poi14', productCode: 'SP20240001', productName: '集成电路芯片 ATmega328P', unit: '个', quantity: 800, unitPrice: 8.2, amount: 6560, remark: '补充库存' }], totalAmount: 6560, remark: '', status: 'approved', creator: '张三', createdAt: '2024-06-01T08:00:00Z' },
  { id: 'po15', orderNo: 'PO20240610001', supplierName: '成都包装材料有限公司', org: '西南区公司', orderDate: '2024-06-10', expectedDate: '2024-06-22', items: [{ id: 'poi15', productCode: 'SP20240017', productName: '气泡膜卷材', unit: '卷', quantity: 100, unitPrice: 65, amount: 6500, remark: '' }], totalAmount: 6500, remark: '', status: 'pending', creator: '李四', createdAt: '2024-06-10T09:30:00Z' },
]

// ==================== 采购入库 ====================
export const mockPurchaseInbounds: PurchaseInbound[] = [
  { id: 'pi1', inboundNo: 'PI20240303001', sourceOrderNo: 'PO20240301001', supplierName: '深圳电子科技有限公司', warehouse: '华南总仓', inboundDate: '2024-03-03', inspector: '田主管', quantity: 500, amount: 4250, remark: '', status: 'completed', createdAt: '2024-03-03T10:00:00Z' },
  { id: 'pi2', inboundNo: 'PI20240312001', sourceOrderNo: 'PO20240310001', supplierName: '上海化工原料供应有限公司', warehouse: '华东分仓', inboundDate: '2024-03-12', inspector: '何主管', quantity: 200, amount: 2400, remark: '', status: 'completed', createdAt: '2024-03-12T14:00:00Z' },
  { id: 'pi3', inboundNo: 'PI20240403001', sourceOrderNo: 'PO20240401001', supplierName: '武汉自动化设备有限公司', warehouse: '华中分仓', inboundDate: '2024-04-03', inspector: '张主管', quantity: 10, amount: 32000, remark: '', status: 'completed', createdAt: '2024-04-03T10:00:00Z' },
  { id: 'pi4', inboundNo: 'PI20240415001', sourceOrderNo: 'PO20240412001', supplierName: '东莞电子元器件有限公司', warehouse: '华南总仓', inboundDate: '2024-04-15', inspector: '田主管', quantity: 5000, amount: 750, remark: '', status: 'partial', createdAt: '2024-04-15T11:00:00Z' },
  { id: 'pi5', inboundNo: 'PI20240503001', sourceOrderNo: 'PO20240501001', supplierName: '苏州电子材料有限公司', warehouse: '华东分仓', inboundDate: '2024-05-03', inspector: '何主管', quantity: 50000, amount: 1000, remark: '', status: 'completed', createdAt: '2024-05-03T09:00:00Z' },
  { id: 'pi6', inboundNo: 'PI20240522001', sourceOrderNo: 'PO20240520001', supplierName: '厦门包装制品有限公司', warehouse: '华南总仓', inboundDate: '2024-05-22', inspector: '田主管', quantity: 2800, amount: 7840, remark: '部分到货，剩余200个', status: 'partial', createdAt: '2024-05-22T14:00:00Z' },
  { id: 'pi7', inboundNo: 'PI20240603001', sourceOrderNo: 'PO20240601001', supplierName: '深圳电子科技有限公司', warehouse: '华南总仓', inboundDate: '2024-06-03', inspector: '田主管', quantity: 800, amount: 6560, remark: '', status: 'completed', createdAt: '2024-06-03T10:00:00Z' },
]

// ==================== 采购退货 ====================
export const mockSupplierReturns: SupplierReturn[] = [
  { id: 'sr1', returnNo: 'SR20240315001', supplierName: '深圳电子科技有限公司', warehouse: '华南总仓', returnDate: '2024-03-15', quantity: 20, amount: 170, reason: '芯片引脚氧化', remark: '', status: 'completed', createdAt: '2024-03-15T14:00:00Z' },
  { id: 'sr2', returnNo: 'SR20240410001', supplierName: '成都包装材料有限公司', warehouse: '西南分仓', returnDate: '2024-04-10', quantity: 30, amount: 450, reason: '包装袋破损', remark: '', status: 'completed', createdAt: '2024-04-10T10:00:00Z' },
  { id: 'sr3', returnNo: 'SR20240505001', supplierName: '苏州电子材料有限公司', warehouse: '华东分仓', returnDate: '2024-05-05', quantity: 1000, amount: 20, reason: '电阻阻值偏差超标', remark: '批次质量问题', status: 'pending', createdAt: '2024-05-05T11:00:00Z' },
]

// ==================== 销售订单 ====================
export const mockSalesOrders: SalesOrder[] = [
  { id: 'so1', orderNo: 'SO20240302001', customerName: '天猫旗舰店', org: '华东区公司', orderDate: '2024-03-02', expectedDate: '2024-03-05', items: [{ id: 'soi1', productCode: 'SP20240001', productName: '集成电路芯片 ATmega328P', unit: '个', quantity: 200, unitPrice: 15.8, amount: 3160, remark: '' }], totalAmount: 3160, remark: '', status: 'approved', creator: '王五', createdAt: '2024-03-02T08:00:00Z' },
  { id: 'so2', orderNo: 'SO20240308001', customerName: '沃尔玛（中国）', org: '华南区公司', orderDate: '2024-03-08', expectedDate: '2024-03-12', items: [{ id: 'soi2', productCode: 'SP20240002', productName: '不锈钢螺栓 M8x30', unit: '个', quantity: 5000, unitPrice: 0.89, amount: 4450, remark: '' }], totalAmount: 4450, remark: '', status: 'approved', creator: '张三', createdAt: '2024-03-08T09:00:00Z' },
  { id: 'so3', orderNo: 'SO20240315001', customerName: '京东自营', org: '华北区公司', orderDate: '2024-03-15', expectedDate: '2024-03-20', items: [{ id: 'soi3', productCode: 'SP20240006', productName: 'PLC可编程控制器', unit: '台', quantity: 5, unitPrice: 5200, amount: 26000, remark: '' }], totalAmount: 26000, remark: '', status: 'pending', creator: '李四', createdAt: '2024-03-15T10:00:00Z' },
  { id: 'so4', orderNo: 'SO20240322001', customerName: '海底捞火锅', org: '西南区公司', orderDate: '2024-03-22', expectedDate: '2024-03-28', items: [{ id: 'soi4', productCode: 'SP20240009', productName: '聚氨酯涂料', unit: 'kg', quantity: 50, unitPrice: 78, amount: 3900, remark: '' }], totalAmount: 3900, remark: '', status: 'draft', creator: '王五', createdAt: '2024-03-22T11:00:00Z' },
  { id: 'so5', orderNo: 'SO20240401001', customerName: '比亚迪汽车', org: '华南区公司', orderDate: '2024-04-01', expectedDate: '2024-04-10', items: [{ id: 'soi5', productCode: 'SP20240012', productName: '伺服驱动器', unit: '台', quantity: 3, unitPrice: 7200, amount: 21600, remark: '' }], totalAmount: 21600, remark: '', status: 'approved', creator: '张三', createdAt: '2024-04-01T08:00:00Z' },
  { id: 'so6', orderNo: 'SO20240410001', customerName: '拼多多', org: '华东区公司', orderDate: '2024-04-10', expectedDate: '2024-04-15', items: [{ id: 'soi6', productCode: 'SP20240007', productName: '电阻 10KΩ 0805', unit: '个', quantity: 30000, unitPrice: 0.05, amount: 1500, remark: '' }], totalAmount: 1500, remark: '', status: 'closed', createdAt: '2024-04-10T09:00:00Z', creator: '李四' },
  { id: 'so7', orderNo: 'SO20240420001', customerName: '小米科技', org: '华北区公司', orderDate: '2024-04-20', expectedDate: '2024-05-01', items: [{ id: 'soi7', productCode: 'SP20240020', productName: '工业机器人关节电机', unit: '台', quantity: 2, unitPrice: 18800, amount: 37600, remark: '' }], totalAmount: 37600, remark: '', status: 'voided', creator: '王五', createdAt: '2024-04-20T14:00:00Z' },
  { id: 'so8', orderNo: 'SO20240501001', customerName: '格力电器', org: '华南区公司', orderDate: '2024-05-01', expectedDate: '2024-05-08', items: [{ id: 'soi8', productCode: 'SP20240016', productName: '工业缝纫机', unit: '台', quantity: 5, unitPrice: 4500, amount: 22500, remark: '' }], totalAmount: 22500, remark: '', status: 'pending', creator: '张三', createdAt: '2024-05-01T08:00:00Z' },
  { id: 'so9', orderNo: 'SO20240515001', customerName: '永辉超市', org: '西南区公司', orderDate: '2024-05-15', expectedDate: '2024-05-22', items: [{ id: 'soi9', productCode: 'SP20240005', productName: '防静电包装袋', unit: '包', quantity: 300, unitPrice: 28, amount: 8400, remark: '' }], totalAmount: 8400, remark: '', status: 'approved', creator: '李四', createdAt: '2024-05-15T10:00:00Z' },
  { id: 'so10', orderNo: 'SO20240601001', customerName: '联想集团', org: '华北区公司', orderDate: '2024-06-01', expectedDate: '2024-06-10', items: [{ id: 'soi10', productCode: 'SP20240018', productName: '变频器 3.7kW', unit: '台', quantity: 8, unitPrice: 4500, amount: 36000, remark: '' }], totalAmount: 36000, remark: '', status: 'draft', creator: '王五', createdAt: '2024-06-01T09:00:00Z' },
  { id: 'so11', orderNo: 'SO20240608001', customerName: '大润发超市', org: '华东区公司', orderDate: '2024-06-08', expectedDate: '2024-06-15', items: [{ id: 'soi11', productCode: 'SP20240011', productName: '纸箱 50x40x30cm', unit: '个', quantity: 2000, unitPrice: 5.5, amount: 11000, remark: '' }], totalAmount: 11000, remark: '', status: 'pending', creator: '张三', createdAt: '2024-06-08T10:00:00Z' },
]

// ==================== 销售出库 ====================
export const mockSalesOutbounds: SalesOutbound[] = [
  { id: 'sb1', outboundNo: 'SOB20240304001', sourceOrderNo: 'SO20240302001', customerName: '天猫旗舰店', warehouse: '华东分仓', outboundDate: '2024-03-04', carrier: '顺丰速运', trackingNo: 'SF1234567890', quantity: 200, amount: 3160, remark: '', status: 'completed', createdAt: '2024-03-04T10:00:00Z' },
  { id: 'sb2', outboundNo: 'SOB20240310001', sourceOrderNo: 'SO20240308001', customerName: '沃尔玛（中国）', warehouse: '华南总仓', outboundDate: '2024-03-10', carrier: '京东物流', trackingNo: 'JD9876543210', quantity: 5000, amount: 4450, remark: '', status: 'completed', createdAt: '2024-03-10T14:00:00Z' },
  { id: 'sb3', outboundNo: 'SOB20240403001', sourceOrderNo: 'SO20240401001', customerName: '比亚迪汽车', warehouse: '华南总仓', outboundDate: '2024-04-03', carrier: '德邦物流', trackingNo: 'DB5678901234', quantity: 3, amount: 21600, remark: '', status: 'completed', createdAt: '2024-04-03T11:00:00Z' },
  { id: 'sb4', outboundNo: 'SOB20240412001', sourceOrderNo: 'SO20240410001', customerName: '拼多多', warehouse: '华东分仓', outboundDate: '2024-04-12', carrier: '中通快递', trackingNo: 'ZT2468013579', quantity: 15000, amount: 750, remark: '分批发货', status: 'partial', createdAt: '2024-04-12T09:00:00Z' },
  { id: 'sb5', outboundNo: 'SOB20240518001', sourceOrderNo: 'SO20240515001', customerName: '永辉超市', warehouse: '西南分仓', outboundDate: '2024-05-18', carrier: '圆通速递', trackingNo: 'YT1357924680', quantity: 300, amount: 8400, remark: '', status: 'completed', createdAt: '2024-05-18T10:00:00Z' },
]

// ==================== 销售退货 ====================
export const mockCustomerReturns: CustomerReturn[] = [
  { id: 'cr1', returnNo: 'CR20240320001', customerName: '天猫旗舰店', warehouse: '华东分仓', returnDate: '2024-03-20', quantity: 10, amount: 158, reason: '芯片型号不符', remark: '', status: 'completed', createdAt: '2024-03-20T14:00:00Z' },
  { id: 'cr2', returnNo: 'CR20240415001', customerName: '京东自营', warehouse: '华北分仓', returnDate: '2024-04-15', quantity: 1, amount: 5200, reason: 'PLC外壳有划痕', remark: '', status: 'completed', createdAt: '2024-04-15T10:00:00Z' },
  { id: 'cr3', returnNo: 'CR20240520001', customerName: '拼多多', warehouse: '华东分仓', returnDate: '2024-05-20', quantity: 2000, amount: 100, reason: '电阻包装破损', remark: '', status: 'pending', createdAt: '2024-05-20T11:00:00Z' },
]

// ==================== 库存查询 ====================
export const mockStockItems: StockItem[] = [
  { id: 'si1', warehouse: '华南总仓', productCode: 'SP20240001', productName: '集成电路芯片 ATmega328P', category: '电子元器件', unit: '个', totalStock: 8500, availableStock: 8000, lockedStock: 500, frozenStock: 0, updatedAt: '2024-06-03T10:00:00Z' },
  { id: 'si2', warehouse: '华南总仓', productCode: 'SP20240002', productName: '不锈钢螺栓 M8x30', category: '五金配件', unit: '个', totalStock: 45000, availableStock: 42000, lockedStock: 3000, frozenStock: 0, updatedAt: '2024-05-22T14:00:00Z' },
  { id: 'si3', warehouse: '华东分仓', productCode: 'SP20240003', productName: '工业乙醇 99.5%', category: '化工原料', unit: 'kg', totalStock: 1200, availableStock: 1180, lockedStock: 0, frozenStock: 20, updatedAt: '2024-03-12T14:00:00Z' },
  { id: 'si4', warehouse: '华中分仓', productCode: 'SP20240006', productName: 'PLC可编程控制器', category: '自动化设备', unit: '台', totalStock: 45, availableStock: 42, lockedStock: 3, frozenStock: 0, updatedAt: '2024-04-03T10:00:00Z' },
  { id: 'si5', warehouse: '华东分仓', productCode: 'SP20240007', productName: '电阻 10KΩ 0805', category: '电子元器件', unit: '个', totalStock: 85000, availableStock: 83000, lockedStock: 2000, frozenStock: 0, updatedAt: '2024-05-03T09:00:00Z' },
  { id: 'si6', warehouse: '华南总仓', productCode: 'SP20240013', productName: '电容 100μF 16V', category: '电子元器件', unit: '个', totalStock: 48000, availableStock: 45000, lockedStock: 3000, frozenStock: 0, updatedAt: '2024-04-15T11:00:00Z' },
  { id: 'si7', warehouse: '西南分仓', productCode: 'SP20240005', productName: '防静电包装袋', category: '包装材料', unit: '包', totalStock: 2800, availableStock: 2500, lockedStock: 200, frozenStock: 100, updatedAt: '2024-05-18T10:00:00Z' },
  { id: 'si8', warehouse: '华南总仓', productCode: 'SP20240020', productName: '工业机器人关节电机', category: '自动化设备', unit: '台', totalStock: 12, availableStock: 10, lockedStock: 1, frozenStock: 1, updatedAt: '2024-05-01T08:00:00Z' },
  { id: 'si9', warehouse: '华南总仓', productCode: 'SP20240016', productName: '工业缝纫机', category: '机械设备', unit: '台', totalStock: 25, availableStock: 20, lockedStock: 5, frozenStock: 0, updatedAt: '2024-05-01T08:00:00Z' },
  { id: 'si10', warehouse: '华北分仓', productCode: 'SP20240018', productName: '变频器 3.7kW', category: '自动化设备', unit: '台', totalStock: 32, availableStock: 30, lockedStock: 0, frozenStock: 2, updatedAt: '2024-06-01T09:00:00Z' },
  { id: 'si11', warehouse: '华东分仓', productCode: 'SP20240001', productName: '集成电路芯片 ATmega328P', category: '电子元器件', unit: '个', totalStock: 3200, availableStock: 3000, lockedStock: 200, frozenStock: 0, updatedAt: '2024-05-20T14:00:00Z' },
  { id: 'si12', warehouse: '华北分仓', productCode: 'SP20240006', productName: 'PLC可编程控制器', category: '自动化设备', unit: '台', totalStock: 28, availableStock: 25, lockedStock: 3, frozenStock: 0, updatedAt: '2024-05-15T10:00:00Z' },
  { id: 'si13', warehouse: '西北分仓', productCode: 'SP20240019', productName: 'LED指示灯 红色', category: '电子元器件', unit: '个', totalStock: 35000, availableStock: 33000, lockedStock: 2000, frozenStock: 0, updatedAt: '2024-05-08T09:00:00Z' },
  { id: 'si14', warehouse: '华南总仓', productCode: 'SP20240011', productName: '纸箱 50x40x30cm', category: '包装材料', unit: '个', totalStock: 8800, availableStock: 8500, lockedStock: 300, frozenStock: 0, updatedAt: '2024-05-22T14:00:00Z' },
  { id: 'si15', warehouse: '华东分仓', productCode: 'SP20240017', productName: '气泡膜卷材', category: '包装材料', unit: '卷', totalStock: 180, availableStock: 175, lockedStock: 0, frozenStock: 5, updatedAt: '2024-06-10T09:30:00Z' },
]

// ==================== 库存流水 ====================
export const mockStockMovements: StockMovement[] = [
  { id: 'sm1', movementNo: 'MV20240303001', bizType: '采购入库', sourceType: '采购入库单', sourceNo: 'PI20240303001', warehouse: '华南总仓', productName: '集成电路芯片 ATmega328P', beforeQty: 8000, changeQty: 500, afterQty: 8500, operator: '田主管', operatedAt: '2024-03-03T10:00:00Z' },
  { id: 'sm2', movementNo: 'MV20240304001', bizType: '销售出库', sourceType: '销售出库单', sourceNo: 'SOB20240304001', warehouse: '华东分仓', productName: '集成电路芯片 ATmega328P', beforeQty: 3400, changeQty: -200, afterQty: 3200, operator: '何主管', operatedAt: '2024-03-04T10:00:00Z' },
  { id: 'sm3', movementNo: 'MV20240310001', bizType: '销售出库', sourceType: '销售出库单', sourceNo: 'SOB20240310001', warehouse: '华南总仓', productName: '不锈钢螺栓 M8x30', beforeQty: 50000, changeQty: -5000, afterQty: 45000, operator: '田主管', operatedAt: '2024-03-10T14:00:00Z' },
  { id: 'sm4', movementNo: 'MV20240312001', bizType: '采购入库', sourceType: '采购入库单', sourceNo: 'PI20240312001', warehouse: '华东分仓', productName: '工业乙醇 99.5%', beforeQty: 1000, changeQty: 200, afterQty: 1200, operator: '何主管', operatedAt: '2024-03-12T14:00:00Z' },
  { id: 'sm5', movementNo: 'MV20240315001', bizType: '采购退货出库', sourceType: '采购退货单', sourceNo: 'SR20240315001', warehouse: '华南总仓', productName: '集成电路芯片 ATmega328P', beforeQty: 8520, changeQty: -20, afterQty: 8500, operator: '田主管', operatedAt: '2024-03-15T14:00:00Z' },
  { id: 'sm6', movementNo: 'MV20240320001', bizType: '销售退货入库', sourceType: '销售退货单', sourceNo: 'CR20240320001', warehouse: '华东分仓', productName: '集成电路芯片 ATmega328P', beforeQty: 3190, changeQty: 10, afterQty: 3200, operator: '何主管', operatedAt: '2024-03-20T14:00:00Z' },
  { id: 'sm7', movementNo: 'MV20240403001', bizType: '采购入库', sourceType: '采购入库单', sourceNo: 'PI20240403001', warehouse: '华中分仓', productName: 'PLC可编程控制器', beforeQty: 35, changeQty: 10, afterQty: 45, operator: '张主管', operatedAt: '2024-04-03T10:00:00Z' },
  { id: 'sm8', movementNo: 'MV20240403002', bizType: '销售出库', sourceType: '销售出库单', sourceNo: 'SOB20240403001', warehouse: '华南总仓', productName: '伺服驱动器', beforeQty: 28, changeQty: -3, afterQty: 25, operator: '田主管', operatedAt: '2024-04-03T11:00:00Z' },
  { id: 'sm9', movementNo: 'MV20240410001', bizType: '采购退货出库', sourceType: '采购退货单', sourceNo: 'SR20240410001', warehouse: '西南分仓', productName: '防静电包装袋', beforeQty: 2830, changeQty: -30, afterQty: 2800, operator: '施主管', operatedAt: '2024-04-10T10:00:00Z' },
  { id: 'sm10', movementNo: 'MV20240412001', bizType: '销售出库', sourceType: '销售出库单', sourceNo: 'SOB20240412001', warehouse: '华东分仓', productName: '电阻 10KΩ 0805', beforeQty: 100000, changeQty: -15000, afterQty: 85000, operator: '何主管', operatedAt: '2024-04-12T09:00:00Z' },
  { id: 'sm11', movementNo: 'MV20240415001', bizType: '采购入库', sourceType: '采购入库单', sourceNo: 'PI20240415001', warehouse: '华南总仓', productName: '电容 100μF 16V', beforeQty: 45000, changeQty: 3000, afterQty: 48000, operator: '田主管', operatedAt: '2024-04-15T11:00:00Z' },
  { id: 'sm12', movementNo: 'MV20240503001', bizType: '采购入库', sourceType: '采购入库单', sourceNo: 'PI20240503001', warehouse: '华东分仓', productName: '电阻 10KΩ 0805', beforeQty: 65000, changeQty: 20000, afterQty: 85000, operator: '何主管', operatedAt: '2024-05-03T09:00:00Z' },
  { id: 'sm13', movementNo: 'MV20240518001', bizType: '销售出库', sourceType: '销售出库单', sourceNo: 'SOB20240518001', warehouse: '西南分仓', productName: '防静电包装袋', beforeQty: 3100, changeQty: -300, afterQty: 2800, operator: '施主管', operatedAt: '2024-05-18T10:00:00Z' },
  { id: 'sm14', movementNo: 'MV20240522001', bizType: '采购入库', sourceType: '采购入库单', sourceNo: 'PI20240522001', warehouse: '华南总仓', productName: '纸箱 50x40x30cm', beforeQty: 6000, changeQty: 2800, afterQty: 8800, operator: '田主管', operatedAt: '2024-05-22T14:00:00Z' },
  { id: 'sm15', movementNo: 'MV20240603001', bizType: '采购入库', sourceType: '采购入库单', sourceNo: 'PI20240603001', warehouse: '华南总仓', productName: '集成电路芯片 ATmega328P', beforeQty: 8100, changeQty: 800, afterQty: 8900, operator: '田主管', operatedAt: '2024-06-03T10:00:00Z' },
]

// ==================== 库存调拨 ====================
export const mockStockTransfers: StockTransfer[] = [
  { id: 'tf1', transferNo: 'TF20240306001', fromWarehouse: '华南总仓', toWarehouse: '深圳前置仓', transferDate: '2024-03-06', quantity: 1000, remark: '前置仓补货', status: 'approved', creator: '田主管', createdAt: '2024-03-06T10:00:00Z' },
  { id: 'tf2', transferNo: 'TF20240316001', fromWarehouse: '华东分仓', toWarehouse: '上海前置仓', transferDate: '2024-03-16', quantity: 500, remark: '', status: 'approved', creator: '何主管', createdAt: '2024-03-16T14:00:00Z' },
  { id: 'tf3', transferNo: 'TF20240408001', fromWarehouse: '华南总仓', toWarehouse: '华中分仓', transferDate: '2024-04-08', quantity: 2000, remark: '区域调拨', status: 'pending', creator: '田主管', createdAt: '2024-04-08T09:00:00Z' },
  { id: 'tf4', transferNo: 'TF20240425001', fromWarehouse: '华北分仓', toWarehouse: '西北分仓', transferDate: '2024-04-25', quantity: 800, remark: '', status: 'draft', creator: '吕主管', createdAt: '2024-04-25T11:00:00Z' },
  { id: 'tf5', transferNo: 'TF20240510001', fromWarehouse: '西南分仓', toWarehouse: '重庆前置仓', transferDate: '2024-05-10', quantity: 300, remark: '前置仓配货', status: 'voided', creator: '施主管', createdAt: '2024-05-10T08:00:00Z' },
]

// ==================== 库存调整 ====================
export const mockStockAdjustments: StockAdjustment[] = [
  { id: 'sa1', adjustmentNo: 'SA20240308001', warehouse: '华南总仓', type: 'loss', adjustmentDate: '2024-03-08', quantity: -5, reason: '盘点异常 - 芯片丢失', remark: '', status: 'approved', creator: '田主管', createdAt: '2024-03-08T15:00:00Z' },
  { id: 'sa2', adjustmentNo: 'SA20240325001', warehouse: '华东分仓', type: 'surplus', adjustmentDate: '2024-03-25', quantity: 3, reason: '盘点发现多余螺丝', remark: '', status: 'approved', creator: '何主管', createdAt: '2024-03-25T10:00:00Z' },
  { id: 'sa3', adjustmentNo: 'SA20240418001', warehouse: '华北分仓', type: 'loss', adjustmentDate: '2024-04-18', quantity: -2, reason: '产品破损报废', remark: '运输途中损坏', status: 'pending', creator: '吕主管', createdAt: '2024-04-18T11:00:00Z' },
  { id: 'sa4', adjustmentNo: 'SA20240512001', warehouse: '西南分仓', type: 'surplus', adjustmentDate: '2024-05-12', quantity: 10, reason: '来料多出', remark: '', status: 'draft', creator: '施主管', createdAt: '2024-05-12T09:00:00Z' },
]

// ==================== 系统用户 ====================
export const mockUsers: SystemUser[] = [
  { id: 'u1', account: 'admin', name: '系统管理员', phone: '13800000001', email: 'admin@weitash.com', role: '系统管理员', status: 'enabled', lastLoginAt: '2024-06-15T09:30:00Z', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u2', account: 'zhangsan', name: '张三', phone: '13800000002', email: 'zhangsan@weitash.com', role: '采购经理', status: 'enabled', lastLoginAt: '2024-06-14T14:20:00Z', createdAt: '2024-01-02T08:00:00Z' },
  { id: 'u3', account: 'lisi', name: '李四', phone: '13800000003', email: 'lisi@weitash.com', role: '采购员', status: 'enabled', lastLoginAt: '2024-06-15T08:15:00Z', createdAt: '2024-01-03T09:00:00Z' },
  { id: 'u4', account: 'wangwu', name: '王五', phone: '13800000004', email: 'wangwu@weitash.com', role: '销售经理', status: 'enabled', lastLoginAt: '2024-06-14T16:45:00Z', createdAt: '2024-01-04T10:00:00Z' },
  { id: 'u5', account: 'zhaoqi', name: '赵七', phone: '13800000005', email: 'zhaoqi@weitash.com', role: '销售员', status: 'enabled', lastLoginAt: '2024-06-13T11:30:00Z', createdAt: '2024-01-05T11:00:00Z' },
  { id: 'u6', account: 'sunba', name: '孙八', phone: '13800000006', email: 'sunba@weitash.com', role: '仓库管理员', status: 'enabled', lastLoginAt: '2024-06-15T07:00:00Z', createdAt: '2024-01-06T08:30:00Z' },
  { id: 'u7', account: 'caijiu', name: '蔡九', phone: '13800000007', email: 'caijiu@weitash.com', role: '财务主管', status: 'enabled', lastLoginAt: '2024-06-12T09:00:00Z', createdAt: '2024-01-07T09:30:00Z' },
  { id: 'u8', account: 'qianshi', name: '钱十', phone: '13800000008', email: 'qianshi@weitash.com', role: '会计', status: 'disabled', lastLoginAt: '2024-05-20T10:00:00Z', createdAt: '2024-01-08T10:00:00Z' },
  { id: 'u9', account: 'zhouyi', name: '周一', phone: '13800000009', email: 'zhouyi@weitash.com', role: '出纳', status: 'enabled', lastLoginAt: '2024-06-14T08:00:00Z', createdAt: '2024-01-09T11:00:00Z' },
  { id: 'u10', account: 'wuer', name: '吴二', phone: '13800000010', email: 'wuer@weitash.com', role: '运营总监', status: 'enabled', lastLoginAt: '2024-06-15T10:00:00Z', createdAt: '2024-01-10T14:00:00Z' },
  { id: 'u11', account: 'zhengsan', name: '郑三', phone: '13800000011', email: 'zhengsan@weitash.com', role: '普通用户', status: 'enabled', lastLoginAt: '2024-06-10T15:00:00Z', createdAt: '2024-01-11T08:00:00Z' },
  { id: 'u12', account: 'fengsi', name: '冯四', phone: '13800000012', email: 'fengsi@weitash.com', role: '采购员', status: 'enabled', lastLoginAt: '2024-06-11T09:00:00Z', createdAt: '2024-01-12T09:00:00Z' },
]

// ==================== 角色 ====================
export const mockRoles: Role[] = [
  { id: 'r1', code: 'ROLE_ADMIN', name: '系统管理员', description: '拥有系统全部权限，可管理所有模块和用户', status: 'enabled', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'r2', code: 'ROLE_PURCHASE_MGR', name: '采购经理', description: '负责采购管理模块的审核和供应商管理', status: 'enabled', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'r3', code: 'ROLE_PURCHASE', name: '采购员', description: '负责采购订单的创建和跟踪', status: 'enabled', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'r4', code: 'ROLE_SALES_MGR', name: '销售经理', description: '负责销售管理模块的审核和客户管理', status: 'enabled', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'r5', code: 'ROLE_SALES', name: '销售员', description: '负责销售订单的创建和跟踪', status: 'enabled', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'r6', code: 'ROLE_WAREHOUSE', name: '仓库管理员', description: '负责库存管理、出入库操作', status: 'enabled', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'r7', code: 'ROLE_FINANCE_MGR', name: '财务主管', description: '负责财务审核和报表查看', status: 'enabled', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'r8', code: 'ROLE_ACCOUNTANT', name: '会计', description: '负责财务对账和发票管理', status: 'enabled', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'r9', code: 'ROLE_CASHIER', name: '出纳', description: '负责收付款操作', status: 'enabled', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'r10', code: 'ROLE_OPERATIONS', name: '运营总监', description: '负责运营数据分析和业务决策支持', status: 'enabled', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'r11', code: 'ROLE_USER', name: '普通用户', description: '仅有基本查看权限', status: 'enabled', createdAt: '2024-01-01T00:00:00Z' },
]

// ==================== 菜单 ====================
export const mockMenus: Menu[] = [
  { id: 'm1', name: '首页', code: 'home', parentId: null, route: '/dashboard', type: 'menu', icon: 'LayoutDashboard', permission: '', sort: 1, status: 'enabled' },
  { id: 'm2', name: '数据看板', code: 'home-dashboard', parentId: 'm1', route: '/dashboard', type: 'menu', icon: '', permission: 'home:dashboard:view', sort: 1, status: 'enabled' },
  { id: 'm3', name: '基础资料', code: 'master-data', parentId: null, route: '/master-data', type: 'menu', icon: 'Database', permission: '', sort: 2, status: 'enabled' },
  { id: 'm4', name: '供应商管理', code: 'master-supplier', parentId: 'm3', route: '/master-data/suppliers', type: 'menu', icon: '', permission: 'master:supplier:view', sort: 1, status: 'enabled' },
  { id: 'm5', name: '客户管理', code: 'master-customer', parentId: 'm3', route: '/master-data/customers', type: 'menu', icon: '', permission: 'master:customer:view', sort: 2, status: 'enabled' },
  { id: 'm6', name: '商品管理', code: 'master-product', parentId: 'm3', route: '/master-data/products', type: 'menu', icon: '', permission: 'master:product:view', sort: 3, status: 'enabled' },
  { id: 'm7', name: '仓库管理', code: 'master-warehouse', parentId: 'm3', route: '/master-data/warehouses', type: 'menu', icon: '', permission: 'master:warehouse:view', sort: 4, status: 'enabled' },
  { id: 'm8', name: '门店管理', code: 'master-store', parentId: 'm3', route: '/master-data/stores', type: 'menu', icon: '', permission: 'master:store:view', sort: 5, status: 'enabled' },
  { id: 'm9', name: '采购管理', code: 'purchase', parentId: null, route: '/purchase', type: 'menu', icon: 'ShoppingCart', permission: '', sort: 3, status: 'enabled' },
  { id: 'm10', name: '采购订单', code: 'purchase-order', parentId: 'm9', route: '/purchase/orders', type: 'menu', icon: '', permission: 'purchase:order:view', sort: 1, status: 'enabled' },
  { id: 'm11', name: '采购入库', code: 'purchase-inbound', parentId: 'm9', route: '/purchase/inbounds', type: 'menu', icon: '', permission: 'purchase:inbound:view', sort: 2, status: 'enabled' },
  { id: 'm12', name: '采购退货', code: 'purchase-return', parentId: 'm9', route: '/purchase/returns', type: 'menu', icon: '', permission: 'purchase:return:view', sort: 3, status: 'enabled' },
  { id: 'm13', name: '销售管理', code: 'sales', parentId: null, route: '/sales', type: 'menu', icon: 'TrendingUp', permission: '', sort: 4, status: 'enabled' },
  { id: 'm14', name: '销售订单', code: 'sales-order', parentId: 'm13', route: '/sales/orders', type: 'menu', icon: '', permission: 'sales:order:view', sort: 1, status: 'enabled' },
  { id: 'm15', name: '销售出库', code: 'sales-outbound', parentId: 'm13', route: '/sales/outbounds', type: 'menu', icon: '', permission: 'sales:outbound:view', sort: 2, status: 'enabled' },
  { id: 'm16', name: '销售退货', code: 'sales-return', parentId: 'm13', route: '/sales/returns', type: 'menu', icon: '', permission: 'sales:return:view', sort: 3, status: 'enabled' },
  { id: 'm17', name: '库存管理', code: 'inventory', parentId: null, route: '/inventory', type: 'menu', icon: 'Package', permission: '', sort: 5, status: 'enabled' },
  { id: 'm18', name: '库存查询', code: 'inventory-stock', parentId: 'm17', route: '/inventory/stocks', type: 'menu', icon: '', permission: 'inventory:stock:view', sort: 1, status: 'enabled' },
  { id: 'm19', name: '库存流水', code: 'inventory-movement', parentId: 'm17', route: '/inventory/movements', type: 'menu', icon: '', permission: 'inventory:movement:view', sort: 2, status: 'enabled' },
  { id: 'm20', name: '库存调拨', code: 'inventory-transfer', parentId: 'm17', route: '/inventory/transfers', type: 'menu', icon: '', permission: 'inventory:transfer:view', sort: 3, status: 'enabled' },
  { id: 'm21', name: '库存调整', code: 'inventory-adjustment', parentId: 'm17', route: '/inventory/adjustments', type: 'menu', icon: '', permission: 'inventory:adjustment:view', sort: 4, status: 'enabled' },
  { id: 'm22', name: '系统设置', code: 'system', parentId: null, route: '/system', type: 'menu', icon: 'Settings', permission: '', sort: 6, status: 'enabled' },
  { id: 'm23', name: '用户管理', code: 'system-user', parentId: 'm22', route: '/system/users', type: 'menu', icon: '', permission: 'system:user:view', sort: 1, status: 'enabled' },
  { id: 'm24', name: '角色管理', code: 'system-role', parentId: 'm22', route: '/system/roles', type: 'menu', icon: '', permission: 'system:role:view', sort: 2, status: 'enabled' },
  { id: 'm25', name: '菜单管理', code: 'system-menu', parentId: 'm22', route: '/system/menus', type: 'menu', icon: '', permission: 'system:menu:view', sort: 3, status: 'enabled' },
  { id: 'm26', name: '数据字典', code: 'system-dict', parentId: 'm22', route: '/system/dictionaries', type: 'menu', icon: '', permission: 'system:dict:view', sort: 4, status: 'enabled' },
  { id: 'm27', name: '新增', code: 'purchase-order-create', parentId: 'm10', route: '', type: 'button', icon: '', permission: 'purchase:order:create', sort: 1, status: 'enabled' },
  { id: 'm28', name: '编辑', code: 'purchase-order-edit', parentId: 'm10', route: '', type: 'button', icon: '', permission: 'purchase:order:edit', sort: 2, status: 'enabled' },
  { id: 'm29', name: '删除', code: 'purchase-order-delete', parentId: 'm10', route: '', type: 'button', icon: '', permission: 'purchase:order:delete', sort: 3, status: 'enabled' },
  { id: 'm30', name: '审核', code: 'purchase-order-audit', parentId: 'm10', route: '', type: 'button', icon: '', permission: 'purchase:order:audit', sort: 4, status: 'enabled' },
]

// ==================== 数据字典 ====================
export const mockDictionaries: DictionaryItem[] = [
  { id: 'd1', dictCode: 'SUPPLIER_CATEGORY', dictName: '供应商分类', itemCode: 'S001', itemName: '电子元器件', sort: 1, status: 'enabled', remark: '' },
  { id: 'd2', dictCode: 'SUPPLIER_CATEGORY', dictName: '供应商分类', itemCode: 'S002', itemName: '五金配件', sort: 2, status: 'enabled', remark: '' },
  { id: 'd3', dictCode: 'SUPPLIER_CATEGORY', dictName: '供应商分类', itemCode: 'S003', itemName: '化工原料', sort: 3, status: 'enabled', remark: '' },
  { id: 'd4', dictCode: 'SUPPLIER_CATEGORY', dictName: '供应商分类', itemCode: 'S004', itemName: '机械设备', sort: 4, status: 'enabled', remark: '' },
  { id: 'd5', dictCode: 'SUPPLIER_CATEGORY', dictName: '供应商分类', itemCode: 'S005', itemName: '包装材料', sort: 5, status: 'enabled', remark: '' },
  { id: 'd6', dictCode: 'SUPPLIER_CATEGORY', dictName: '供应商分类', itemCode: 'S006', itemName: '自动化设备', sort: 6, status: 'enabled', remark: '' },
  { id: 'd7', dictCode: 'CUSTOMER_TYPE', dictName: '客户类型', itemCode: 'C001', itemName: '电商平台', sort: 1, status: 'enabled', remark: '' },
  { id: 'd8', dictCode: 'CUSTOMER_TYPE', dictName: '客户类型', itemCode: 'C002', itemName: '大型商超', sort: 2, status: 'enabled', remark: '' },
  { id: 'd9', dictCode: 'CUSTOMER_TYPE', dictName: '客户类型', itemCode: 'C003', itemName: '连锁便利店', sort: 3, status: 'enabled', remark: '' },
  { id: 'd10', dictCode: 'CUSTOMER_TYPE', dictName: '客户类型', itemCode: 'C004', itemName: '批发经销商', sort: 4, status: 'enabled', remark: '' },
  { id: 'd11', dictCode: 'CUSTOMER_TYPE', dictName: '客户类型', itemCode: 'C005', itemName: '餐饮连锁', sort: 5, status: 'enabled', remark: '' },
  { id: 'd12', dictCode: 'CUSTOMER_TYPE', dictName: '客户类型', itemCode: 'C006', itemName: '生产制造企业', sort: 6, status: 'enabled', remark: '' },
  { id: 'd13', dictCode: 'SETTLEMENT', dictName: '结算方式', itemCode: 'ST001', itemName: '现结', sort: 1, status: 'enabled', remark: '' },
  { id: 'd14', dictCode: 'SETTLEMENT', dictName: '结算方式', itemCode: 'ST002', itemName: '月结30天', sort: 2, status: 'enabled', remark: '' },
  { id: 'd15', dictCode: 'SETTLEMENT', dictName: '结算方式', itemCode: 'ST003', itemName: '月结60天', sort: 3, status: 'enabled', remark: '' },
  { id: 'd16', dictCode: 'SETTLEMENT', dictName: '结算方式', itemCode: 'ST004', itemName: '月结90天', sort: 4, status: 'enabled', remark: '' },
  { id: 'd17', dictCode: 'PAYMENT_TERMS', dictName: '付款条件', itemCode: 'PT001', itemName: '款到发货', sort: 1, status: 'enabled', remark: '' },
  { id: 'd18', dictCode: 'PAYMENT_TERMS', dictName: '付款条件', itemCode: 'PT002', itemName: '货到付款', sort: 2, status: 'enabled', remark: '' },
  { id: 'd19', dictCode: 'WAREHOUSE_TYPE', dictName: '仓库类型', itemCode: 'WT001', itemName: '主仓', sort: 1, status: 'enabled', remark: '' },
  { id: 'd20', dictCode: 'WAREHOUSE_TYPE', dictName: '仓库类型', itemCode: 'WT002', itemName: '分仓', sort: 2, status: 'enabled', remark: '' },
  { id: 'd21', dictCode: 'WAREHOUSE_TYPE', dictName: '仓库类型', itemCode: 'WT003', itemName: '前置仓', sort: 3, status: 'enabled', remark: '' },
]

// ==================== 首页Dashboard ====================
export const mockDashboard: DashboardData = {
  todaySales: 128560.50,
  todayPurchase: 85600.00,
  totalSkuCount: 2468,
  stockAlertCount: 15,
  pendingPurchaseOrders: 5,
  pendingSalesOrders: 8,
  salesTrend: [
    { date: '04-21', amount: 95000 }, { date: '04-22', amount: 112000 }, { date: '04-23', amount: 88000 },
    { date: '04-24', amount: 135000 }, { date: '04-25', amount: 102000 }, { date: '04-26', amount: 118000 },
    { date: '04-27', amount: 128560 },
  ],
  purchaseTrend: [
    { date: '04-21', amount: 75000 }, { date: '04-22', amount: 68000 }, { date: '04-23', amount: 92000 },
    { date: '04-24', amount: 80000 }, { date: '04-25', amount: 72000 }, { date: '04-26', amount: 91000 },
    { date: '04-27', amount: 85600 },
  ],
  stockAlerts: [
    { productName: '集成电路芯片 ATmega328P', warehouse: '华南总仓', stock: 85, minStock: 100 },
    { productName: '数控机床主轴电机', warehouse: '华南总仓', stock: 1, minStock: 2 },
    { productName: '环氧树脂AB胶', warehouse: '华东分仓', stock: 8, minStock: 10 },
    { productName: '工业机器人关节电机', warehouse: '华南总仓', stock: 1, minStock: 2 },
    { productName: '伺服驱动器', warehouse: '华北分仓', stock: 2, minStock: 3 },
  ],
  todos: [
    { id: 't1', type: 'purchase', title: '采购订单待审核', description: 'PO20240305001 - 广州五金机械有限公司 ¥3,500', urgent: true },
    { id: 't2', type: 'purchase', title: '采购订单待审核', description: 'PO20240412001 - 东莞电子元器件有限公司 ¥750', urgent: false },
    { id: 't3', type: 'sales', title: '销售订单待审核', description: 'SO20240315001 - 京东自营 ¥26,000', urgent: true },
    { id: 't4', type: 'sales', title: '销售订单待审核', description: 'SO20240501001 - 格力电器 ¥22,500', urgent: false },
    { id: 't5', type: 'inventory', title: '库存调拨待审核', description: 'TF20240408001 - 华南总仓→华中分仓', urgent: false },
    { id: 't6', type: 'inventory', title: '库存调整待审核', description: 'SA20240418001 - 华北分仓产品破损报废', urgent: false },
    { id: 't7', type: 'purchase', title: '采购退货待处理', description: 'SR20240505001 - 苏州电子材料有限公司', urgent: false },
  ],
}
