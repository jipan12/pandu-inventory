import { useEffect, useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import SearchPanel, { SearchField } from '@/components/common/SearchPanel'
import DataTable from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import FormDialog, { FormSection, FormField, FormInput, FormSelect } from '@/components/common/FormDialog'
import DetailDrawer, { DetailSection, DetailField } from '@/components/common/DetailDrawer'
import { createCrudApi } from '@/mock/api'
import { mockUsers } from '@/mock/data-more'
import { formatDateTime } from '@/utils/format'
import { STATUS_MAP, STATUS_OPTIONS, ROLE_OPTIONS } from '@/utils/constants'
import type { SystemUser, PageParams } from '@/types'

const api = createCrudApi<SystemUser>(mockUsers, {
  keywordFields: ['account', 'name', 'phone'],
  categoryFields: { role: 'role' },
})

const emptyForm: Partial<SystemUser> = { account: '', name: '', phone: '', email: '', role: '' }

export default function UserPage() {
  const [list, setList] = useState<SystemUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<SystemUser>>({ ...emptyForm })
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<SystemUser | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [resetPwdId, setResetPwdId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false)
  }, [params])
  useEffect(() => { fetchData() }, [fetchData])
  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }
  function openCreate() { setEditingId(null); setForm({ ...emptyForm }); setFormOpen(true) }
  function openEdit(u: SystemUser) { setEditingId(u.id); setForm({ ...u }); setFormOpen(true) }
  function openDetail(u: SystemUser) { setDetail(u); setDetailOpen(true) }
  async function handleFormSubmit() {
    if (!form.account || !form.name) return
    setFormLoading(true)
    if (editingId) await api.update(editingId, form)
    else await api.create({ ...form, status: 'enabled', lastLoginAt: '', createdAt: new Date().toISOString() } as SystemUser)
    setFormLoading(false); setFormOpen(false); fetchData()
  }
  async function handleDelete() { if (deleteId) { await api.remove(deleteId); setDeleteId(null); fetchData() } }
  async function handleToggleStatus(id: string) { await api.toggleStatus(id); fetchData() }
  function handleResetPwd() { setResetPwdId(null) }
  function setField(f: keyof SystemUser, v: string) { setForm((p) => ({ ...p, [f]: v })) }

  const columns = [
    { key: 'account', title: '用户账号', dataIndex: 'account' as keyof SystemUser },
    { key: 'name', title: '用户姓名', dataIndex: 'name' as keyof SystemUser },
    { key: 'phone', title: '手机号', dataIndex: 'phone' as keyof SystemUser },
    { key: 'role', title: '所属角色', dataIndex: 'role' as keyof SystemUser },
    { key: 'status', title: '状态', render: (_: unknown, r: SystemUser) => <StatusBadge status={r.status} statusMap={STATUS_MAP} /> },
    { key: 'lastLoginAt', title: '最近登录', render: (_: unknown, r: SystemUser) => formatDateTime(r.lastLoginAt) },
    { key: 'createdAt', title: '创建时间', render: (_: unknown, r: SystemUser) => formatDateTime(r.createdAt) },
    { key: 'actions', title: '操作', width: '240px', render: (_: unknown, r: SystemUser) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openDetail(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">详情</button>
        <button onClick={() => openEdit(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">编辑</button>
        <button onClick={() => setResetPwdId(r.id)} className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded">重置密码</button>
        <button onClick={() => handleToggleStatus(r.id)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">{r.status === 'enabled' ? '禁用' : '启用'}</button>
        <button onClick={() => setDeleteId(r.id)} className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded">删除</button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="用户管理" description="管理系统用户账号"><button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800"><Plus className="w-3.5 h-3.5" />新增用户</button></PageHeader>
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="账号/姓名/手机号" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="所属角色"><FormSelect options={ROLE_OPTIONS} value={params.role as string || ''} onChange={(e) => setParams((p) => ({ ...p, role: e.target.value }))} /></SearchField>
        <SearchField label="使用状态"><FormSelect options={STATUS_OPTIONS} value={params.status || ''} onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />

      <FormDialog open={formOpen} title={editingId ? '编辑用户' : '新增用户'} loading={formLoading} onConfirm={handleFormSubmit} onCancel={() => setFormOpen(false)}>
        <FormSection title="基本信息">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="用户账号" required><FormInput value={form.account || ''} onChange={(e) => setField('account', e.target.value)} /></FormField>
            <FormField label="用户姓名" required><FormInput value={form.name || ''} onChange={(e) => setField('name', e.target.value)} /></FormField>
            <FormField label="手机号"><FormInput value={form.phone || ''} onChange={(e) => setField('phone', e.target.value)} /></FormField>
            <FormField label="电子邮箱"><FormInput value={form.email || ''} onChange={(e) => setField('email', e.target.value)} /></FormField>
          </div>
        </FormSection>
        <FormSection title="角色分配">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="所属角色" required><FormSelect options={ROLE_OPTIONS.filter(o => o.value !== '')} value={form.role || ''} onChange={(e) => setField('role', e.target.value)} /></FormField>
          </div>
        </FormSection>
      </FormDialog>

      <DetailDrawer open={detailOpen} title="用户详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="基本信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="用户账号" value={detail.account} mono /><DetailField label="用户姓名" value={detail.name} />
            <DetailField label="手机号" value={detail.phone} /><DetailField label="电子邮箱" value={detail.email} />
          </div></DetailSection>
          <DetailSection title="账户信息"><div className="grid grid-cols-2 gap-2">
            <DetailField label="所属角色" value={detail.role} /><DetailField label="状态" value={<StatusBadge status={detail.status} statusMap={STATUS_MAP} />} />
            <DetailField label="最近登录" value={formatDateTime(detail.lastLoginAt)} /><DetailField label="创建时间" value={formatDateTime(detail.createdAt)} />
          </div></DetailSection>
        </>)}
      </DetailDrawer>

      <ConfirmDialog open={!!deleteId} title="确认删除" description="删除后该用户将无法登录系统，确定删除吗？" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmDialog open={!!resetPwdId} title="重置密码" description="确定要将密码重置为默认密码 123456 吗？" variant="warning" onConfirm={handleResetPwd} onCancel={() => setResetPwdId(null)} />
    </div>
  )
}
