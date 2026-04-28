import { useEffect, useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import SearchPanel, { SearchField } from '@/components/common/SearchPanel'
import DataTable from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import FormDialog, { FormSection, FormField, FormInput, FormSelect, FormTextarea } from '@/components/common/FormDialog'
import DetailDrawer, { DetailSection, DetailField } from '@/components/common/DetailDrawer'
import { createCrudApi } from '@/mock/api'
import { mockDictionaries } from '@/mock/data-more'
import { STATUS_MAP, STATUS_OPTIONS } from '@/utils/constants'
import type { DictionaryItem, PageParams } from '@/types'

const api = createCrudApi<DictionaryItem>(mockDictionaries, {
  keywordFields: ['dictCode', 'dictName', 'itemName'],
  categoryFields: { dictCode: 'dictCode' },
})

const emptyForm: Partial<DictionaryItem> = { dictCode: '', dictName: '', itemCode: '', itemName: '', sort: 0, remark: '' }
const dictCodeOptions = [...new Set(mockDictionaries.map(d => d.dictCode))]

export default function DictionaryPage() {
  const [list, setList] = useState<DictionaryItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<PageParams>({ page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false); const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<DictionaryItem>>({ ...emptyForm })
  const [detailOpen, setDetailOpen] = useState(false); const [detail, setDetail] = useState<DictionaryItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => { setLoading(true); const res = await api.list(params); setList(res.list); setTotal(res.total); setLoading(false) }, [params])
  useEffect(() => { fetchData() }, [fetchData])
  function handleSearch() { setPage(1); setParams((p) => ({ ...p, page: 1 })) }
  function handleReset() { setParams({ page: 1, pageSize: 10 }); setPage(1) }
  function openCreate() { setEditingId(null); setForm({ ...emptyForm }); setFormOpen(true) }
  function openEdit(d: DictionaryItem) { setEditingId(d.id); setForm({ ...d }); setFormOpen(true) }
  function openDetail(d: DictionaryItem) { setDetail(d); setDetailOpen(true) }
  async function handleFormSubmit() { if (!form.dictCode || !form.dictName || !form.itemName) return; setFormLoading(true); if (editingId) await api.update(editingId, form); else await api.create({ ...form, status: 'enabled' } as DictionaryItem); setFormLoading(false); setFormOpen(false); fetchData() }
  async function handleDelete() { if (deleteId) { await api.remove(deleteId); setDeleteId(null); fetchData() } }
  async function handleToggleStatus(id: string) { await api.toggleStatus(id); fetchData() }
  function setField(f: keyof DictionaryItem, v: string | number) { setForm((p) => ({ ...p, [f]: v })) }

  const columns = [
    { key: 'dictCode', title: '字典编码', dataIndex: 'dictCode' as keyof DictionaryItem },
    { key: 'dictName', title: '字典名称', dataIndex: 'dictName' as keyof DictionaryItem },
    { key: 'itemCode', title: '字典项编码', dataIndex: 'itemCode' as keyof DictionaryItem },
    { key: 'itemName', title: '字典项名称', dataIndex: 'itemName' as keyof DictionaryItem },
    { key: 'sort', title: '排序', dataIndex: 'sort' as keyof DictionaryItem },
    { key: 'status', title: '状态', render: (_: unknown, r: DictionaryItem) => <StatusBadge status={r.status} statusMap={STATUS_MAP} /> },
    { key: 'remark', title: '备注', dataIndex: 'remark' as keyof DictionaryItem },
    { key: 'actions', title: '操作', width: '200px', render: (_: unknown, r: DictionaryItem) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openDetail(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">详情</button>
        <button onClick={() => openEdit(r)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">编辑</button>
        <button onClick={() => handleToggleStatus(r.id)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">{r.status === 'enabled' ? '禁用' : '启用'}</button>
        <button onClick={() => setDeleteId(r.id)} className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded">删除</button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="数据字典" description="管理系统数据字典项"><button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800"><Plus className="w-3.5 h-3.5" />新增字典项</button></PageHeader>
      <SearchPanel onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <SearchField label="关键词"><FormInput placeholder="字典编码/名称/项名" value={params.keyword || ''} onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value }))} /></SearchField>
        <SearchField label="字典编码"><FormSelect options={[{ value: '', label: '全部' }, ...dictCodeOptions.map(d => ({ value: d, label: d }))]} value={params.dictCode as string || ''} onChange={(e) => setParams((p) => ({ ...p, dictCode: e.target.value }))} /></SearchField>
        <SearchField label="使用状态"><FormSelect options={STATUS_OPTIONS} value={params.status || ''} onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))} /></SearchField>
      </SearchPanel>
      <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={{ page, pageSize: 10, total, onChange: (p) => { setPage(p); setParams((prev) => ({ ...prev, page: p })) } }} />
      <FormDialog open={formOpen} title={editingId ? '编辑字典项' : '新增字典项'} loading={formLoading} onConfirm={handleFormSubmit} onCancel={() => setFormOpen(false)}>
        <FormSection title="字典分组">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="字典编码" required><FormInput value={form.dictCode || ''} onChange={(e) => setField('dictCode', e.target.value)} placeholder="如 SETTLEMENT" /></FormField>
            <FormField label="字典名称" required><FormInput value={form.dictName || ''} onChange={(e) => setField('dictName', e.target.value)} placeholder="如 结算方式" /></FormField>
          </div>
        </FormSection>
        <FormSection title="字典项明细">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="字典项编码"><FormInput value={form.itemCode || ''} onChange={(e) => setField('itemCode', e.target.value)} /></FormField>
            <FormField label="字典项名称" required><FormInput value={form.itemName || ''} onChange={(e) => setField('itemName', e.target.value)} /></FormField>
            <FormField label="排序"><FormInput type="number" value={form.sort || ''} onChange={(e) => setField('sort', Number(e.target.value))} /></FormField>
          </div>
        </FormSection>
        <FormSection title="备注"><FormTextarea value={form.remark || ''} onChange={(e) => setField('remark', e.target.value)} /></FormSection>
      </FormDialog>
      <DetailDrawer open={detailOpen} title="字典项详情" onClose={() => setDetailOpen(false)}>
        {detail && (<>
          <DetailSection title="字典分组"><div className="grid grid-cols-2 gap-2">
            <DetailField label="字典编码" value={detail.dictCode} mono /><DetailField label="字典名称" value={detail.dictName} />
          </div></DetailSection>
          <DetailSection title="字典项明细"><div className="grid grid-cols-2 gap-2">
            <DetailField label="字典项编码" value={detail.itemCode || '-'} /><DetailField label="字典项名称" value={detail.itemName} />
            <DetailField label="排序" value={String(detail.sort)} /><DetailField label="状态" value={<StatusBadge status={detail.status} statusMap={STATUS_MAP} />} />
          </div></DetailSection>
          {detail.remark && <DetailSection title="备注"><p className="text-sm text-gray-600">{detail.remark}</p></DetailSection>}
        </>)}
      </DetailDrawer>
      <ConfirmDialog open={!!deleteId} title="确认删除" description="删除后可能影响引用该字典项的业务数据，确定删除吗？" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
