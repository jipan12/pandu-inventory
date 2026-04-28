import type {
  Supplier, Customer, Product, Warehouse, Store,
  PurchaseOrder, PurchaseInbound, SupplierReturn,
  SalesOrder, SalesOutbound, CustomerReturn,
  StockItem, StockMovement, StockTransfer, StockAdjustment,
  SystemUser, Role, Menu, DictionaryItem, DashboardData,
} from '@/types'

// ==================== 供应商数据 ====================
export const mockSuppliers: Supplier[] = [
  { id: 's1', code: 'GYS20240001', name: '深圳电子科技有限公司', category: '电子元器件', contact: '张伟', phone: '13800138001', email: 'zhangwei@szetech.com', address: '深圳市宝安区西乡街道固戍社区', settlement: '月结30天', paymentTerms: '月结30天', bankName: '中国工商银行深圳分行', bankAccount: '6222024000012345678', taxNumber: '91440300MA5DTY1234', remark: '主要电子元器件供应商', status: 'enabled', createdAt: '2024-01-15T08:00:00Z' },
  { id: 's2', code: 'GYS20240002', name: '广州五金机械有限公司', category: '五金配件', contact: '李强', phone: '13800138002', email: 'liqiang@gzwj.com', address: '广州市花都区狮岭镇', settlement: '月结60天', paymentTerms: '月结60天', bankName: '中国建设银行广州分行', bankAccount: '6227003320034567890', taxNumber: '91440100MA5DTY1235', remark: '', status: 'enabled', createdAt: '2024-01-20T09:30:00Z' },
  { id: 's3', code: 'GYS20240003', name: '上海化工原料供应有限公司', category: '化工原料', contact: '王芳', phone: '13800138003', email: 'wangfang@shhg.com', address: '上海市金山区石化街道', settlement: '现结', paymentTerms: '款到发货', bankName: '中国银行上海分行', bankAccount: '6217908000012345678', taxNumber: '91310000MA5DTY1236', remark: '化工原料长期合作', status: 'enabled', createdAt: '2024-02-01T10:00:00Z' },
  { id: 's4', code: 'GYS20240004', name: '北京机械设备制造有限公司', category: '机械设备', contact: '赵磊', phone: '13800138004', email: 'zhaolei@bjjx.com', address: '北京市大兴区亦庄经济开发区', settlement: '月结30天', paymentTerms: '货到付款', bankName: '中国农业银行北京分行', bankAccount: '6228480012345678901', taxNumber: '91110000MA5DTY1237', remark: '', status: 'enabled', createdAt: '2024-02-10T11:00:00Z' },
  { id: 's5', code: 'GYS20240005', name: '成都包装材料有限公司', category: '包装材料', contact: '陈丽', phone: '13800138005', email: 'chenli@cdbz.com', address: '成都市龙泉驿区经开区', settlement: '月结30天', paymentTerms: '月结30天', bankName: '招商银行成都分行', bankAccount: '6214850200123456789', taxNumber: '91510000MA5DTY1238', remark: '', status: 'enabled', createdAt: '2024-02-15T13:00:00Z' },
  { id: 's6', code: 'GYS20240006', name: '武汉自动化设备有限公司', category: '自动化设备', contact: '刘洋', phone: '13800138006', email: 'liuyang@whzdh.com', address: '武汉市东湖高新区', settlement: '月结90天', paymentTerms: '月结90天', bankName: '交通银行武汉分行', bankAccount: '6222620812345678901', taxNumber: '91420100MA5DTY1239', remark: '西门子授权经销商', status: 'enabled', createdAt: '2024-03-01T08:30:00Z' },
  { id: 's7', code: 'GYS20240007', name: '杭州五金配件贸易有限公司', category: '五金配件', contact: '孙敏', phone: '13800138007', email: 'sunmin@hzwj.com', address: '杭州市余杭区仓前街道', settlement: '现结', paymentTerms: '款到发货', bankName: '杭州银行余杭支行', bankAccount: '6233310001234567890', taxNumber: '91330100MA5DTY1240', remark: '', status: 'enabled', createdAt: '2024-03-05T09:00:00Z' },
  { id: 's8', code: 'GYS20240008', name: '东莞电子元器件有限公司', category: '电子元器件', contact: '周杰', phone: '13800138008', email: 'zhoujie@dgdz.com', address: '东莞市长安镇乌沙社区', settlement: '月结30天', paymentTerms: '月结30天', bankName: '东莞银行长安支行', bankAccount: '6234560001234567890', taxNumber: '91441900MA5DTY1241', remark: '华为供应链认证', status: 'enabled', createdAt: '2024-03-10T10:00:00Z' },
  { id: 's9', code: 'GYS20240009', name: '重庆化工有限公司', category: '化工原料', contact: '吴霞', phone: '13800138009', email: 'wuxia@cqhg.com', address: '重庆市长寿区晏家街道', settlement: '票到付款', paymentTerms: '票到付款', bankName: '重庆银行长寿支行', bankAccount: '6235690001234567890', taxNumber: '91500100MA5DTY1242', remark: '', status: 'disabled', createdAt: '2024-03-15T11:00:00Z' },
  { id: 's10', code: 'GYS20240010', name: '南京机械设备有限公司', category: '机械设备', contact: '郑刚', phone: '13800138010', email: 'zhenggang@njjx.com', address: '南京市江宁区秣陵街道', settlement: '月结60天', paymentTerms: '月结60天', bankName: '南京银行江宁支行', bankAccount: '6234110001234567890', taxNumber: '91320100MA5DTY1243', remark: '', status: 'enabled', createdAt: '2024-03-20T14:00:00Z' },
  { id: 's11', code: 'GYS20240011', name: '西安电子科技有限公司', category: '电子元器件', contact: '冯磊', phone: '13800138011', email: 'fenglei@xadz.com', address: '西安市高新区', settlement: '月结30天', paymentTerms: '月结30天', bankName: '西安银行高新支行', bankAccount: '6233260001234567890', taxNumber: '91610100MA5DTY1244', remark: '', status: 'enabled', createdAt: '2024-04-01T08:00:00Z' },
  { id: 's12', code: 'GYS20240012', name: '厦门包装制品有限公司', category: '包装材料', contact: '何敏', phone: '13800138012', email: 'hemin@xmbz.com', address: '厦门市集美区杏林街道', settlement: '月结30天', paymentTerms: '货到付款', bankName: '厦门银行集美支行', bankAccount: '6234510001234567890', taxNumber: '91350200MA5DTY1245', remark: '', status: 'enabled', createdAt: '2024-04-05T09:30:00Z' },
  { id: 's13', code: 'GYS20240013', name: '佛山自动化科技有限公司', category: '自动化设备', contact: '马超', phone: '13800138013', email: 'machao@fszdh.com', address: '佛山市顺德区北滘镇', settlement: '月结30天', paymentTerms: '月结30天', bankName: '顺德农商银行', bankAccount: '6234560001234567891', taxNumber: '91440600MA5DTY1246', remark: '施耐德合作伙伴', status: 'enabled', createdAt: '2024-04-10T10:00:00Z' },
  { id: 's14', code: 'GYS20240014', name: '郑州五金配件有限公司', category: '五金配件', contact: '黄明', phone: '13800138014', email: 'huangming@zzwj.com', address: '郑州市金水区花园路', settlement: '现结', paymentTerms: '款到发货', bankName: '郑州银行金水支行', bankAccount: '6234530001234567890', taxNumber: '91410100MA5DTY1247', remark: '', status: 'enabled', createdAt: '2024-04-15T11:00:00Z' },
  { id: 's15', code: 'GYS20240015', name: '苏州电子材料有限公司', category: '电子元器件', contact: '曹伟', phone: '13800138015', email: 'caowei@szdz.com', address: '苏州市工业园区', settlement: '月结60天', paymentTerms: '月结60天', bankName: '苏州银行工业园区支行', bankAccount: '6234320001234567890', taxNumber: '91320500MA5DTY1248', remark: '', status: 'disabled', createdAt: '2024-04-20T14:00:00Z' },
  { id: 's16', code: 'GYS20240016', name: '天津机械设备贸易有限公司', category: '机械设备', contact: '陆鹏', phone: '13800138016', email: 'lupeng@tjjx.com', address: '天津市滨海新区', settlement: '月结30天', paymentTerms: '月结30天', bankName: '天津银行滨海支行', bankAccount: '6234250001234567890', taxNumber: '91120100MA5DTY1249', remark: '', status: 'enabled', createdAt: '2024-05-01T08:00:00Z' },
  { id: 's17', code: 'GYS20240017', name: '合肥化工科技有限公司', category: '化工原料', contact: '江涛', phone: '13800138017', email: 'jiangtao@hfhg.com', address: '合肥市高新区', settlement: '票到付款', paymentTerms: '票到付款', bankName: '徽商银行合肥高新支行', bankAccount: '6234160001234567890', taxNumber: '91340100MA5DTY1250', remark: '', status: 'enabled', createdAt: '2024-05-05T10:00:00Z' },
  { id: 's18', code: 'GYS20240018', name: '大连五金有限公司', category: '五金配件', contact: '沈静', phone: '13800138018', email: 'shenjing@dlwj.com', address: '大连市开发区', settlement: '月结30天', paymentTerms: '月结30天', bankName: '大连银行开发区支行', bankAccount: '6234360001234567890', taxNumber: '91210200MA5DTY1251', remark: '', status: 'enabled', createdAt: '2024-05-10T11:00:00Z' },
  { id: 's19', code: 'GYS20240019', name: '青岛包装有限公司', category: '包装材料', contact: '林杰', phone: '13800138019', email: 'linjie@qdbz.com', address: '青岛市黄岛区', settlement: '月结30天', paymentTerms: '月结30天', bankName: '青岛银行黄岛支行', bankAccount: '6234210001234567890', taxNumber: '91370200MA5DTY1252', remark: '', status: 'enabled', createdAt: '2024-05-15T14:00:00Z' },
  { id: 's20', code: 'GYS20240020', name: '长沙自动化有限公司', category: '自动化设备', contact: '唐莉', phone: '13800138020', email: 'tangli@cszdh.com', address: '长沙市高新区麓谷', settlement: '月结60天', paymentTerms: '月结60天', bankName: '长沙银行麓谷支行', bankAccount: '6234310001234567890', taxNumber: '91430100MA5DTY1253', remark: '', status: 'enabled', createdAt: '2024-05-20T09:00:00Z' },
]

// ==================== 客户数据 ====================
export const mockCustomers: Customer[] = [
  { id: 'c1', code: 'KH20240001', name: '天猫旗舰店', type: '电商平台', region: '华东', contact: '马云飞', phone: '13900139001', email: 'mayunfei@tmall.com', address: '杭州市余杭区文一西路', creditLimit: 500000, taxNumber: '91330100MA5DTY2001', remark: '天猫平台旗舰店客户', status: 'enabled', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'c2', code: 'KH20240002', name: '沃尔玛（中国）', type: '大型商超', region: '华南', contact: '张经理', phone: '13900139002', email: 'zhang@walmart.cn', address: '深圳市福田区深南大道', creditLimit: 1000000, taxNumber: '91440300MA5DTY2002', remark: '', status: 'enabled', createdAt: '2024-01-15T09:00:00Z' },
  { id: 'c3', code: 'KH20240003', name: '美宜佳便利店', type: '连锁便利店', region: '华南', contact: '陈伟', phone: '13900139003', email: 'chenwei@meiyijia.com', address: '东莞市南城区', creditLimit: 300000, taxNumber: '91441900MA5DTY2003', remark: '', status: 'enabled', createdAt: '2024-01-20T10:00:00Z' },
  { id: 'c4', code: 'KH20240004', name: '京东自营', type: '电商平台', region: '华北', contact: '刘强', phone: '13900139004', email: 'liuqiang@jd.com', address: '北京市亦庄经济开发区', creditLimit: 800000, taxNumber: '91110000MA5DTY2004', remark: '', status: 'enabled', createdAt: '2024-01-25T11:00:00Z' },
  { id: 'c5', code: 'KH20240005', name: '大润发超市', type: '大型商超', region: '华东', contact: '王总监', phone: '13900139005', email: 'wang@rtmart.com', address: '上海市闵行区', creditLimit: 600000, taxNumber: '91310000MA5DTY2005', remark: '', status: 'enabled', createdAt: '2024-02-01T08:30:00Z' },
  { id: 'c6', code: 'KH20240006', name: '永辉超市', type: '大型商超', region: '西南', contact: '李明', phone: '13900139006', email: 'liming@yonghui.com', address: '重庆市渝北区', creditLimit: 450000, taxNumber: '91500100MA5DTY2006', remark: '', status: 'enabled', createdAt: '2024-02-05T09:00:00Z' },
  { id: 'c7', code: 'KH20240007', name: '盒马鲜生', type: '连锁便利店', region: '华东', contact: '赵敏', phone: '13900139007', email: 'zhaomin@freshhema.com', address: '上海市浦东新区', creditLimit: 400000, taxNumber: '91310000MA5DTY2007', remark: '', status: 'enabled', createdAt: '2024-02-10T10:00:00Z' },
  { id: 'c8', code: 'KH20240008', name: '美团优选', type: '电商平台', region: '华北', contact: '陈晨', phone: '13900139008', email: 'chenchen@meituan.com', address: '北京市朝阳区', creditLimit: 350000, taxNumber: '91110000MA5DTY2008', remark: '', status: 'enabled', createdAt: '2024-02-15T11:00:00Z' },
  { id: 'c9', code: 'KH20240009', name: '华润万家', type: '大型商超', region: '华南', contact: '周主任', phone: '13900139009', email: 'zhou@crv.com', address: '广州市天河区', creditLimit: 550000, taxNumber: '91440100MA5DTY2009', remark: '', status: 'disabled', createdAt: '2024-02-20T14:00:00Z' },
  { id: 'c10', code: 'KH20240010', name: '海底捞火锅', type: '餐饮连锁', region: '西南', contact: '吴采购', phone: '13900139010', email: 'wu@haidilao.com', address: '成都市高新区', creditLimit: 200000, taxNumber: '91510000MA5DTY2010', remark: '', status: 'enabled', createdAt: '2024-03-01T08:00:00Z' },
  { id: 'c11', code: 'KH20240011', name: '比亚迪汽车', type: '生产制造企业', region: '华南', contact: '王工', phone: '13900139011', email: 'wang@byd.com', address: '深圳市坪山区', creditLimit: 1500000, taxNumber: '91440300MA5DTY2011', remark: '', status: 'enabled', createdAt: '2024-03-05T09:30:00Z' },
  { id: 'c12', code: 'KH20240012', name: '海底捞供应链', type: '批发经销商', region: '西南', contact: '郑经理', phone: '13900139012', email: 'zheng@scm-haidilao.com', address: '成都市武侯区', creditLimit: 300000, taxNumber: '91510000MA5DTY2012', remark: '', status: 'enabled', createdAt: '2024-03-10T10:00:00Z' },
  { id: 'c13', code: 'KH20240013', name: '联想集团', type: '生产制造企业', region: '华北', contact: '孙工', phone: '13900139013', email: 'sun@lenovo.com', address: '北京市海淀区上地', creditLimit: 1200000, taxNumber: '91110000MA5DTY2013', remark: '', status: 'enabled', createdAt: '2024-03-15T11:00:00Z' },
  { id: 'c14', code: 'KH20240014', name: '拼多多', type: '电商平台', region: '华东', contact: '黄先生', phone: '13900139014', email: 'huang@pinduoduo.com', address: '上海市长宁区', creditLimit: 600000, taxNumber: '91310000MA5DTY2014', remark: '', status: 'enabled', createdAt: '2024-03-20T14:00:00Z' },
  { id: 'c15', code: 'KH20240015', name: '小米科技', type: '生产制造企业', region: '华北', contact: '雷经理', phone: '13900139015', email: 'lei@xiaomi.com', address: '北京市海淀区清河', creditLimit: 1000000, taxNumber: '91110000MA5DTY2015', remark: '', status: 'enabled', createdAt: '2024-04-01T08:00:00Z' },
  { id: 'c16', code: 'KH20240016', name: '全家便利店', type: '连锁便利店', region: '华东', contact: '林店长', phone: '13900139016', email: 'lin@familymart.com', address: '上海市静安区', creditLimit: 250000, taxNumber: '91310000MA5DTY2016', remark: '', status: 'enabled', createdAt: '2024-04-05T09:00:00Z' },
  { id: 'c17', code: 'KH20240017', name: '格力电器', type: '生产制造企业', region: '华南', contact: '董采购', phone: '13900139017', email: 'dong@gree.com', address: '珠海市香洲区', creditLimit: 800000, taxNumber: '91440400MA5DTY2017', remark: '', status: 'enabled', createdAt: '2024-04-10T10:00:00Z' },
  { id: 'c18', code: 'KH20240018', name: '苏宁易购', type: '大型商超', region: '华东', contact: '张总', phone: '13900139018', email: 'zhang@suning.com', address: '南京市玄武区', creditLimit: 700000, taxNumber: '91320100MA5DTY2018', remark: '', status: 'enabled', createdAt: '2024-04-15T11:00:00Z' },
  { id: 'c19', code: 'KH20240019', name: '顺丰速运', type: '批发经销商', region: '华南', contact: '刘经理', phone: '13900139019', email: 'liu@sf-express.com', address: '深圳市南山区', creditLimit: 400000, taxNumber: '91440300MA5DTY2019', remark: '', status: 'enabled', createdAt: '2024-04-20T14:00:00Z' },
  { id: 'c20', code: 'KH20240020', name: '滴滴出行', type: '电商平台', region: '华北', contact: '程先生', phone: '13900139020', email: 'cheng@didiglobal.com', address: '北京市海淀区', creditLimit: 300000, taxNumber: '91110000MA5DTY2020', remark: '', status: 'disabled', createdAt: '2024-05-01T08:00:00Z' },
]

// ==================== 商品数据 ====================
export const mockProducts: Product[] = [
  { id: 'p1', code: 'SP20240001', name: '集成电路芯片 ATmega328P', barcode: '6901234560001', category: '电子元器件', brand: '华为', unit: '个', spec: 'DIP-28封装', model: 'ATmega328P-PU', purchasePrice: 8.5, salesPrice: 15.8, minStock: 100, maxStock: 5000, remark: 'MCU微控制器', status: 'enabled', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'p2', code: 'SP20240002', name: '不锈钢螺栓 M8x30', barcode: '6901234560002', category: '五金配件', brand: '海尔', unit: '个', spec: 'M8x30mm', model: 'SS-M8-30', purchasePrice: 0.35, salesPrice: 0.89, minStock: 1000, maxStock: 50000, remark: '', status: 'enabled', createdAt: '2024-01-15T09:00:00Z' },
  { id: 'p3', code: 'SP20240003', name: '工业乙醇 99.5%', barcode: '6901234560003', category: '化工原料', brand: '西门子', unit: 'kg', spec: '25L/桶', model: 'ETOH-995', purchasePrice: 12.0, salesPrice: 22.5, minStock: 50, maxStock: 2000, remark: '', status: 'enabled', createdAt: '2024-01-20T10:00:00Z' },
  { id: 'p4', code: 'SP20240004', name: '数控机床主轴电机', barcode: '6901234560004', category: '机械设备', brand: '西门子', unit: '台', spec: '7.5kW 3000rpm', model: '1PH7133', purchasePrice: 8500, salesPrice: 12800, minStock: 2, maxStock: 50, remark: '', status: 'enabled', createdAt: '2024-01-25T11:00:00Z' },
  { id: 'p5', code: 'SP20240005', name: '防静电包装袋', barcode: '6901234560005', category: '包装材料', brand: '美的', unit: '包', spec: '30cmx40cm 100个/包', model: 'ESD-3040', purchasePrice: 15.0, salesPrice: 28.0, minStock: 200, maxStock: 10000, remark: '', status: 'enabled', createdAt: '2024-02-01T08:30:00Z' },
  { id: 'p6', code: 'SP20240006', name: 'PLC可编程控制器', barcode: '6901234560006', category: '自动化设备', brand: '西门子', unit: '台', spec: 'S7-1200系列', model: '6ES7214-1AG40-0XB0', purchasePrice: 3200, salesPrice: 5200, minStock: 5, maxStock: 200, remark: '', status: 'enabled', createdAt: '2024-02-05T09:00:00Z' },
  { id: 'p7', code: 'SP20240007', name: '电阻 10KΩ 0805', barcode: '6901234560007', category: '电子元器件', brand: '小米', unit: '个', spec: '0805 ±1%', model: 'RC0805-103F', purchasePrice: 0.02, salesPrice: 0.05, minStock: 5000, maxStock: 200000, remark: '', status: 'enabled', createdAt: '2024-02-10T10:00:00Z' },
  { id: 'p8', code: 'SP20240008', name: '六角螺母 M8', barcode: '6901234560008', category: '五金配件', brand: '海尔', unit: '个', spec: 'M8 镀锌', model: 'HN-M8-Z', purchasePrice: 0.08, salesPrice: 0.2, minStock: 2000, maxStock: 100000, remark: '', status: 'enabled', createdAt: '2024-02-15T11:00:00Z' },
  { id: 'p9', code: 'SP20240009', name: '聚氨酯涂料', barcode: '6901234560009', category: '化工原料', brand: '格力', unit: 'kg', spec: '20kg/桶', model: 'PU-200', purchasePrice: 45.0, salesPrice: 78.0, minStock: 20, maxStock: 500, remark: '', status: 'enabled', createdAt: '2024-02-20T14:00:00Z' },
  { id: 'p10', code: 'SP20240010', name: '数控车床CK6150', barcode: '6901234560010', category: '机械设备', brand: '施耐德', unit: '台', spec: 'φ500x1000mm', model: 'CK6150', purchasePrice: 65000, salesPrice: 98000, minStock: 1, maxStock: 10, remark: '', status: 'enabled', createdAt: '2024-03-01T08:00:00Z' },
  { id: 'p11', code: 'SP20240011', name: '纸箱 50x40x30cm', barcode: '6901234560011', category: '包装材料', brand: '美的', unit: '个', spec: '50cmx40cmx30cm 五层瓦楞', model: 'CB-504030', purchasePrice: 2.8, salesPrice: 5.5, minStock: 500, maxStock: 20000, remark: '', status: 'enabled', createdAt: '2024-03-05T09:00:00Z' },
  { id: 'p12', code: 'SP20240012', name: '伺服驱动器', barcode: '6901234560012', category: '自动化设备', brand: '施耐德', unit: '台', spec: '2kW 220V', model: 'LXM32AU45M2', purchasePrice: 4500, salesPrice: 7200, minStock: 3, maxStock: 100, remark: '', status: 'enabled', createdAt: '2024-03-10T10:00:00Z' },
  { id: 'p13', code: 'SP20240013', name: '电容 100μF 16V', barcode: '6901234560013', category: '电子元器件', brand: '华为', unit: '个', spec: 'φ8x12mm 铝电解', model: 'EC-100UF-16V', purchasePrice: 0.15, salesPrice: 0.35, minStock: 2000, maxStock: 100000, remark: '', status: 'enabled', createdAt: '2024-03-15T11:00:00Z' },
  { id: 'p14', code: 'SP20240014', name: '弹簧垫圈 M8', barcode: '6901234560014', category: '五金配件', brand: '联想', unit: '个', spec: 'M8 65Mn', model: 'SW-M8', purchasePrice: 0.05, salesPrice: 0.12, minStock: 3000, maxStock: 150000, remark: '', status: 'disabled', createdAt: '2024-03-20T14:00:00Z' },
  { id: 'p15', code: 'SP20240015', name: '环氧树脂AB胶', barcode: '6901234560015', category: '化工原料', brand: '施耐德', unit: 'kg', spec: 'A:B=1:1 5kg/组', model: 'EP-AB-5', purchasePrice: 85.0, salesPrice: 150.0, minStock: 10, maxStock: 300, remark: '', status: 'enabled', createdAt: '2024-04-01T08:00:00Z' },
  { id: 'p16', code: 'SP20240016', name: '工业缝纫机', barcode: '6901234560016', category: '机械设备', brand: '格力', unit: '台', spec: '5000rpm 电脑控制', model: 'IS-5000D', purchasePrice: 2800, salesPrice: 4500, minStock: 3, maxStock: 50, remark: '', status: 'enabled', createdAt: '2024-04-05T09:00:00Z' },
  { id: 'p17', code: 'SP20240017', name: '气泡膜卷材', barcode: '6901234560017', category: '包装材料', brand: '小米', unit: '卷', spec: '1.2mx50m 双层', model: 'BM-120-50', purchasePrice: 65.0, salesPrice: 120.0, minStock: 20, maxStock: 500, remark: '', status: 'enabled', createdAt: '2024-04-10T10:00:00Z' },
  { id: 'p18', code: 'SP20240018', name: '变频器 3.7kW', barcode: '6901234560018', category: '自动化设备', brand: '西门子', unit: '台', spec: '3.7kW 380V', model: '6SL3210-1KE17-5UF1', purchasePrice: 2800, salesPrice: 4500, minStock: 3, maxStock: 80, remark: '', status: 'enabled', createdAt: '2024-04-15T11:00:00Z' },
  { id: 'p19', code: 'SP20240019', name: 'LED指示灯 红色', barcode: '6901234560019', category: '电子元器件', brand: '联想', unit: '个', spec: '5mm 2V 20mA', model: 'LED-R-5', purchasePrice: 0.08, salesPrice: 0.2, minStock: 1000, maxStock: 50000, remark: '', status: 'enabled', createdAt: '2024-04-20T14:00:00Z' },
  { id: 'p20', code: 'SP20240020', name: '工业机器人关节电机', barcode: '6901234560020', category: '自动化设备', brand: '华为', unit: '台', spec: '3.5kW 4000rpm', model: 'RJM-3500', purchasePrice: 12000, salesPrice: 18800, minStock: 2, maxStock: 30, remark: '', status: 'enabled', createdAt: '2024-05-01T08:00:00Z' },
]

// 辅助函数：生成更多商品...
for (let i = 21; i <= 25; i++) {
  mockProducts.push({
    id: `p${i}`,
    code: `SP2024${String(i).padStart(4, '0')}`,
    name: `测试商品${i}`,
    barcode: `690123456${String(i).padStart(4, '0')}`,
    category: ['电子元器件', '五金配件', '化工原料', '机械设备', '包装材料'][i % 5],
    brand: ['华为', '小米', '联想', '海尔', '格力'][i % 5],
    unit: ['个', '台', 'kg', '件', '包'][i % 5],
    spec: `规格${i}`,
    model: `MODEL-${i}`,
    purchasePrice: parseFloat((Math.random() * 1000 + 1).toFixed(2)),
    salesPrice: parseFloat((Math.random() * 1500 + 2).toFixed(2)),
    minStock: Math.floor(Math.random() * 100) + 1,
    maxStock: Math.floor(Math.random() * 5000) + 100,
    remark: '',
    status: i % 14 === 0 ? 'disabled' : 'enabled',
    createdAt: `2024-0${(i % 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T08:00:00Z`,
  })
}

// ==================== 仓库数据 ====================
export const mockWarehouses: Warehouse[] = [
  { id: 'w1', code: 'CK20240001', name: '华南总仓', type: '主仓', org: '华南区公司', address: '深圳市龙华区观澜街道', manager: '田主管', phone: '13700137001', area: 5000, capacity: 25000, remark: '华南区域中心仓库', status: 'enabled', createdAt: '2024-01-01T08:00:00Z' },
  { id: 'w2', code: 'CK20240002', name: '华东分仓', type: '分仓', org: '华东区公司', address: '上海市嘉定区安亭镇', manager: '何主管', phone: '13700137002', area: 3000, capacity: 15000, remark: '', status: 'enabled', createdAt: '2024-01-05T09:00:00Z' },
  { id: 'w3', code: 'CK20240003', name: '华北分仓', type: '分仓', org: '华北区公司', address: '北京市通州区马驹桥', manager: '吕主管', phone: '13700137003', area: 2800, capacity: 14000, remark: '', status: 'enabled', createdAt: '2024-01-10T10:00:00Z' },
  { id: 'w4', code: 'CK20240004', name: '西南分仓', type: '分仓', org: '西南区公司', address: '成都市青白江区', manager: '施主管', phone: '13700137004', area: 2500, capacity: 12000, remark: '', status: 'enabled', createdAt: '2024-01-15T11:00:00Z' },
  { id: 'w5', code: 'CK20240005', name: '华中分仓', type: '分仓', org: '华中区公司', address: '武汉市东西湖区', manager: '张主管', phone: '13700137005', area: 2200, capacity: 11000, remark: '', status: 'enabled', createdAt: '2024-01-20T08:30:00Z' },
  { id: 'w6', code: 'CK20240006', name: '西北分仓', type: '分仓', org: '西北区公司', address: '西安市未央区', manager: '曹主管', phone: '13700137006', area: 2000, capacity: 10000, remark: '', status: 'enabled', createdAt: '2024-01-25T09:00:00Z' },
  { id: 'w7', code: 'CK20240007', name: '深圳前置仓', type: '前置仓', org: '华南区公司', address: '深圳市南山区科技园', manager: '许主管', phone: '13700137007', area: 800, capacity: 4000, remark: '服务于科技园周边客户', status: 'enabled', createdAt: '2024-02-01T10:00:00Z' },
  { id: 'w8', code: 'CK20240008', name: '上海前置仓', type: '前置仓', org: '华东区公司', address: '上海市浦东新区张江', manager: '丁主管', phone: '13700137008', area: 900, capacity: 4500, remark: '', status: 'enabled', createdAt: '2024-02-05T11:00:00Z' },
  { id: 'w9', code: 'CK20240009', name: '广州前置仓', type: '前置仓', org: '华南区公司', address: '广州市黄埔区', manager: '彭主管', phone: '13700137009', area: 850, capacity: 4200, remark: '', status: 'disabled', createdAt: '2024-02-10T14:00:00Z' },
  { id: 'w10', code: 'CK20240010', name: '重庆前置仓', type: '前置仓', org: '西南区公司', address: '重庆市江北区', manager: '谭主管', phone: '13700137010', area: 750, capacity: 3800, remark: '', status: 'enabled', createdAt: '2024-02-15T08:00:00Z' },
]

// ==================== 门店数据 ====================
export const mockStores: Store[] = [
  { id: 'st1', code: 'MD20240001', name: '深圳华强北旗舰店', type: '旗舰店', region: '华南', manager: '罗店长', phone: '13600136001', address: '深圳市福田区华强北路1001号', area: 500, businessHours: '09:00-22:00', remark: '品牌旗舰门店', status: 'enabled', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'st2', code: 'MD20240002', name: '上海南京路直营店', type: '直营店', region: '华东', manager: '林店长', phone: '13600136002', address: '上海市黄浦区南京东路500号', area: 350, businessHours: '10:00-22:00', remark: '', status: 'enabled', createdAt: '2024-01-15T09:00:00Z' },
  { id: 'st3', code: 'MD20240003', name: '北京国贸加盟店', type: '加盟店', region: '华北', manager: '陈店长', phone: '13600136003', address: '北京市朝阳区建国门外大街1号', area: 280, businessHours: '09:30-21:30', remark: '', status: 'enabled', createdAt: '2024-01-20T10:00:00Z' },
  { id: 'st4', code: 'MD20240004', name: '成都太古里专柜', type: '专柜', region: '西南', manager: '杨店长', phone: '13600136004', address: '成都市锦江区中纱帽街8号', area: 120, businessHours: '10:00-22:00', remark: '', status: 'enabled', createdAt: '2024-01-25T11:00:00Z' },
  { id: 'st5', code: 'MD20240005', name: '武汉光谷快闪店', type: '快闪店', region: '华中', manager: '周店长', phone: '13600136005', address: '武汉市洪山区珞喻路1037号', area: 80, businessHours: '10:00-20:00', remark: '临时活动门店', status: 'disabled', createdAt: '2024-02-01T08:30:00Z' },
  { id: 'st6', code: 'MD20240006', name: '西安钟楼直营店', type: '直营店', region: '西北', manager: '吴店长', phone: '13600136006', address: '西安市碑林区东大街589号', area: 300, businessHours: '09:30-21:00', remark: '', status: 'enabled', createdAt: '2024-02-05T09:00:00Z' },
  { id: 'st7', code: 'MD20240007', name: '广州天河城旗舰店', type: '旗舰店', region: '华南', manager: '郑店长', phone: '13600136007', address: '广州市天河区天河路208号', area: 450, businessHours: '10:00-22:00', remark: '', status: 'enabled', createdAt: '2024-02-10T10:00:00Z' },
  { id: 'st8', code: 'MD20240008', name: '杭州西湖直营店', type: '直营店', region: '华东', manager: '王店长', phone: '13600136008', address: '杭州市上城区延安路258号', area: 320, businessHours: '09:00-21:30', remark: '', status: 'enabled', createdAt: '2024-02-15T11:00:00Z' },
  { id: 'st9', code: 'MD20240009', name: '南京新街口加盟店', type: '加盟店', region: '华东', manager: '赵店长', phone: '13600136009', address: '南京市秦淮区中山南路189号', area: 260, businessHours: '09:30-21:00', remark: '', status: 'enabled', createdAt: '2024-02-20T14:00:00Z' },
  { id: 'st10', code: 'MD20240010', name: '重庆解放碑专柜', type: '专柜', region: '西南', manager: '钱店长', phone: '13600136010', address: '重庆市渝中区民族路188号', area: 130, businessHours: '10:00-22:00', remark: '', status: 'enabled', createdAt: '2024-03-01T08:00:00Z' },
  { id: 'st11', code: 'MD20240011', name: '长沙五一广场直营店', type: '直营店', region: '华中', manager: '李店长', phone: '13600136011', address: '长沙市芙蓉区五一大道800号', area: 280, businessHours: '09:00-21:00', remark: '', status: 'enabled', createdAt: '2024-03-05T09:00:00Z' },
  { id: 'st12', code: 'MD20240012', name: '郑州二七加盟店', type: '加盟店', region: '华中', manager: '孙店长', phone: '13600136012', address: '郑州市二七区德化街36号', area: 240, businessHours: '09:30-21:30', remark: '', status: 'enabled', createdAt: '2024-03-10T10:00:00Z' },
  { id: 'st13', code: 'MD20240013', name: '天津和平路直营店', type: '直营店', region: '华北', manager: '武店长', phone: '13600136013', address: '天津市和平区和平路300号', area: 300, businessHours: '09:30-21:00', remark: '', status: 'enabled', createdAt: '2024-03-15T11:00:00Z' },
  { id: 'st14', code: 'MD20240014', name: '苏州观前街专柜', type: '专柜', region: '华东', manager: '马店长', phone: '13600136014', address: '苏州市姑苏区观前街210号', area: 110, businessHours: '10:00-21:30', remark: '', status: 'enabled', createdAt: '2024-03-20T14:00:00Z' },
  { id: 'st15', code: 'MD20240015', name: '兰州中心快闪店', type: '快闪店', region: '西北', manager: '刘店长', phone: '13600136015', address: '兰州市城关区庆阳路188号', area: 70, businessHours: '10:00-20:00', remark: '限时促销活动', status: 'enabled', createdAt: '2024-04-01T08:00:00Z' },
]
