import { useState } from 'react'
import styles from './App.module.css'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import NoteCard from './components/NoteCard'
import NoteModal from './components/NoteModal'
import EmptyState from './components/EmptyState'
import Toast from './components/Toast'

import { useLocalStorage } from './hooks/useLocalStorage'
import { useToast } from './hooks/useToast'
import { filterNotes, generateId } from './utils/helpers'
import { NOTE_COLORS } from './utils/constants'

export default function App() {
  const [notes, setNotes] = useLocalStorage('notenest_notes', [])
  const [view, setView] = useState('notes')
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [modal, setModal] = useState(null) // { mode: 'create'|'edit'|'view', note: {} }
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toast, showToast } = useToast()

  // ─── Derived data ────────────────────────────────────────────────────────────

  const allTags = [...new Set(
    notes.filter((n) => !n.trashed).flatMap((n) => n.tags || [])
  )]

  const counts = {
    notes: notes.filter((n) => !n.archived && !n.trashed).length,
    pinned: notes.filter((n) => n.pinned && !n.archived && !n.trashed).length,
    archive: notes.filter((n) => n.archived && !n.trashed).length,
    trash: notes.filter((n) => n.trashed).length,
  }

  const filtered = filterNotes(notes, { view, search, activeTag })
  const pinnedNotes = view === 'notes' ? filtered.filter((n) => n.pinned) : []
  const unpinnedNotes = view === 'notes' ? filtered.filter((n) => !n.pinned) : filtered

  // ─── Note actions ─────────────────────────────────────────────────────────

  function saveNote(data) {
    if (data.id) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === data.id ? { ...n, ...data, updatedAt: Date.now() } : n
        )
      )
      showToast('Note updated ✓')
    } else {
      const newNote = {
        ...data,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        pinned: false,
        archived: false,
        trashed: false,
      }
      setNotes((prev) => [newNote, ...prev])
      showToast('Note created ✓')
    }
    setModal(null)
  }

  function pinNote(id) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    )
  }

  function archiveNote(id) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, archived: !n.archived, pinned: false } : n
      )
    )
    showToast('Note archived')
  }

  function trashNote(id) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, trashed: true, pinned: false, archived: false }
          : n
      )
    )
    showToast('Moved to trash')
  }

  function restoreNote(id) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, trashed: false } : n))
    )
    showToast('Note restored ✓')
  }

  function deleteForever(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    showToast('Deleted permanently')
  }

  function emptyTrash() {
    setNotes((prev) => prev.filter((n) => !n.trashed))
    showToast('Trash emptied')
  }

  // ─── Modal helpers ────────────────────────────────────────────────────────

  function openCreate() {
    setModal({
      mode: 'create',
      note: { title: '', body: '', tags: [], color: NOTE_COLORS[0] },
    })
  }

  function openView(note) {
    setModal({ mode: 'view', note })
  }

  function openEdit(note) {
    setModal({ mode: 'edit', note })
  }

  function handleViewChange(v) {
    setView(v)
    setActiveTag(null)
  }

  function handleTagClick(tag) {
    setActiveTag(activeTag === tag ? null : tag)
    setView('notes')
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className={styles.layout}>
      <Sidebar
        view={view}
        activeTag={activeTag}
        counts={counts}
        allTags={allTags}
        onViewChange={handleViewChange}
        onTagClick={handleTagClick}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={styles.main}>
        <Topbar
          view={view}
          activeTag={activeTag}
          search={search}
          trashCount={counts.trash}
          onSearch={setSearch}
          onNewNote={openCreate}
          onEmptyTrash={emptyTrash}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className={styles.notesArea}>
          {filtered.length === 0 ? (
            <EmptyState view={view} hasSearch={!!search} />
          ) : (
            <>
              {/* Pinned section */}
              {pinnedNotes.length > 0 && (
                <>
                  <div className={styles.sectionLabel}>📌 Pinned</div>
                  <div className={styles.grid}>
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        view={view}
                        onOpen={() => openView(note)}
                        onPin={() => pinNote(note.id)}
                        onArchive={() => archiveNote(note.id)}
                        onTrash={() => trashNote(note.id)}
                        onRestore={() => restoreNote(note.id)}
                        onDelete={() => deleteForever(note.id)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Remaining notes */}
              {unpinnedNotes.length > 0 && (
                <>
                  {pinnedNotes.length > 0 && (
                    <div className={styles.sectionLabel}>Other notes</div>
                  )}
                  <div className={styles.grid}>
                    {unpinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        view={view}
                        onOpen={() => openView(note)}
                        onPin={() => pinNote(note.id)}
                        onArchive={() => archiveNote(note.id)}
                        onTrash={() => trashNote(note.id)}
                        onRestore={() => restoreNote(note.id)}
                        onDelete={() => deleteForever(note.id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <NoteModal
          mode={modal.mode}
          note={modal.note}
          view={view}
          onSave={saveNote}
          onClose={() => setModal(null)}
          onEdit={() => openEdit(modal.note)}
          onTrash={() => { trashNote(modal.note.id); setModal(null) }}
          onRestore={() => { restoreNote(modal.note.id); setModal(null) }}
          onDelete={() => { deleteForever(modal.note.id); setModal(null) }}
          onArchive={() => { archiveNote(modal.note.id); setModal(null) }}
          onPin={() => pinNote(modal.note.id)}
        />
      )}

      <Toast message={toast} />
    </div>
  )
}
