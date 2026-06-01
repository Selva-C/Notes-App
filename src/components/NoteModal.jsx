import { useState } from 'react'
import styles from './NoteModal.module.css'
import { NOTE_COLORS } from '../utils/constants'
import { getTagColor } from '../utils/helpers'

export default function NoteModal({
  mode,
  note,
  onSave,
  onClose,
  onEdit,
  onTrash,
  onRestore,
  onDelete,
  onArchive,
  onPin,
  view,
}) {
  const [title, setTitle] = useState(note.title || '')
  const [body, setBody] = useState(note.body || '')
  const [tags, setTags] = useState(note.tags || [])
  const [color, setColor] = useState(note.color || NOTE_COLORS[0])
  const [tagInput, setTagInput] = useState('')

  const isView = mode === 'view'

  function handleTagKeyDown(e) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const t = tagInput.trim().replace(/^#/, '').toLowerCase()
      if (t && !tags.includes(t)) setTags([...tags, t])
      setTagInput('')
    }
  }

  function removeTag(tag) {
    setTags(tags.filter((t) => t !== tag))
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ background: color }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          {isView ? (
            <h2 className={styles.viewTitle}>{note.title || 'Untitled'}</h2>
          ) : (
            <input
              className={styles.titleInput}
              placeholder="Note title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          )}
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        {isView ? (
          <p className={styles.viewBody}>{note.body}</p>
        ) : (
          <textarea
            className={styles.bodyInput}
            placeholder="Write your note here…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
          />
        )}

        {/* Tags */}
        <div className={styles.tagsRow}>
          {tags.map((t) => {
            const tc = getTagColor(t)
            return (
              <span
                key={t}
                className={styles.tagChip}
                style={{ background: tc.bg, color: tc.text }}
              >
                #{t}
                {!isView && (
                  <button onClick={() => removeTag(t)}>✕</button>
                )}
              </span>
            )
          })}
          {!isView && (
            <input
              className={styles.tagInput}
              placeholder="Add tag…"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
          )}
        </div>

        {/* Color picker (edit/create only) */}
        {!isView && (
          <div className={styles.colorRow}>
            <span className={styles.colorLabel}>Color</span>
            <div className={styles.colorOptions}>
              {NOTE_COLORS.map((c) => (
                <div
                  key={c}
                  className={`${styles.colorOpt} ${color === c ? styles.colorSelected : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className={styles.footer}>
          {isView && view !== 'trash' && (
            <>
              <button className={styles.btnGhost} onClick={onPin}>
                {note.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button className={styles.btnGhost} onClick={onArchive}>
                {note.archived ? 'Unarchive' : 'Archive'}
              </button>
              <button className={styles.btnGhost} onClick={onEdit}>Edit</button>
              <button className={styles.btnDanger} onClick={onTrash}>Move to Trash</button>
            </>
          )}
          {isView && view === 'trash' && (
            <>
              <button className={styles.btnGhost} onClick={onRestore}>Restore</button>
              <button className={styles.btnDanger} onClick={onDelete}>Delete Forever</button>
            </>
          )}
          {!isView && (
            <>
              <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
              <button
                className={styles.btnPrimary}
                onClick={() => onSave({ id: note.id, title, body, tags, color })}
              >
                {note.id ? 'Update Note' : 'Create Note'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
