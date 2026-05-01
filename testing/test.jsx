import React, { useState, useMemo, useEffect } from 'react'
import { progressApi } from '../services/api'
import { useApi } from '../hooks/useApi'

import { Search, Filter, Edit3, Trash2, X, Check, ChevronDown, History as HistoryIcon, Brain } from 'lucide-react'
import toast from 'react-hot-toast'
import { format, parseISO } from 'date-fns'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'

const DAY_TYPE_STYLES = {
  normal: 'bg-slate-700/60 text-slate-300',
  exam: 'bg-red-500/10 text-red-400 border border-red-500/20',
  holiday: 'bg-green-500/10 text-green-400 border border-green-500/20',
}

function EditModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState({
    dayType: entry.dayType || 'normal',
    sessionsCompleted: String(entry.sessionsCompleted || ''),
    questionsSolved: String(entry.questionsSolved || ''),
    topic: entry.topic || '',
    notes: entry.notes || '',
    revision: entry.revision || false,
  })

  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    try {
      setLoading(true)

      await progressApi.update(entry._id, {
        ...form,
        sessionsCompleted: Number(form.sessionsCompleted),
        questionsSolved: Number(form.questionsSolved),
      })

      toast.success('Entry updated!')
      onSave()
    } catch (err) {
      console.error(err)
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md">
        <div className="flex justify-between p-4 border-b border-slate-800">
          <h3 className="text-white font-bold">Edit Entry</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="p-4 space-y-3">
          <input className="input" value={form.topic} onChange={e => set('topic', e.target.value)} />
          <input className="input" value={form.sessionsCompleted} onChange={e => set('sessionsCompleted', e.target.value)} />
          <input className="input" value={form.questionsSolved} onChange={e => set('questionsSolved', e.target.value)} />
        </div>

        <div className="p-4 flex gap-2">
          <button onClick={handleSave} disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function History() {

  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [editEntry, setEditEntry] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const {
    data,
    loading,
    execute: fetchHistory
  } = useApi(() => progressApi.getAll())

  const runDelete = async (fn) => {
    try {
      await fn()
    } catch (err) {
      console.error(err)
      toast.error('Delete failed')
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const entries = useMemo(() => {
    const raw = data?.data || data || []
    return [...raw].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [data])

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const matchSearch = !search || (e.topic || '').toLowerCase().includes(search.toLowerCase())
      const matchFrom = !dateFrom || e.date >= dateFrom
      const matchTo = !dateTo || e.date <= dateTo
      return matchSearch && matchFrom && matchTo
    })
  }, [entries, search, dateFrom, dateTo])

  const handleDelete = async (id) => {
    await runDelete(async () => {
      await progressApi.remove(id)
      toast.success('Entry deleted')
      setDeleteId(null)
      await fetchHistory()
    })
  }

  return (
    <div className="p-6">

      {editEntry && (
        <EditModal
          entry={editEntry}
          onSave={() => { setEditEntry(null); fetchHistory() }}
          onClose={() => setEditEntry(null)}
        />
      )}

      <h1 className="text-2xl text-white mb-4">History</h1>

      {loading ? (
        <LoadingSpinner text="Loading..." />
      ) : (
        filtered.map(entry => (
          <div key={entry._id} className="card mb-2">
            <div className="flex justify-between">
              <div>
                <p>{entry.topic}</p>
                <p>{entry.sessionsCompleted} sessions</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setEditEntry(entry)}>Edit</button>

                {deleteId === entry._id ? (
                  <>
                    <button onClick={() => handleDelete(entry._id)}>Confirm</button>
                    <button onClick={() => setDeleteId(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setDeleteId(entry._id)}>Delete</button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}