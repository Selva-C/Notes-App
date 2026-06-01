import styles from './NoteCard.module.css'
import { getTagColor, formatDate } from '../utils/helpers'

export default function NoteCard({ note, view, onOpen, onPin, onArchive, onTrash, onRestore, onDelete }) {
  return (
    <div
      className={`${styles.card} ${note.pinned ? styles.pinned : ''}`}
      style={{ background: note.color || '#1a1825' }}
      onClick={onOpen}
    >
      {/* Pin indicator */}
      {note.pinned && <span className={styles.pinIndicator}>📌</span>}

      {/* Hover action buttons */}
      <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
        {view !== 'trash' && (
          <>
            {view !== 'archive' && (
              <button className={styles.actBtn} title="Pin" onClick={onPin}>
                {note.pinned ? '📌' : '📍'}
              </button>
            )}
            {view !== 'archive' ? (
              <button className={styles.actBtn} title="Archive" onClick={onArchive}>📦</button>
            ) : (
              <button className={styles.actBtn} title="Unarchive" onClick={onArchive}>↩️</button>
            )}
            <button className={styles.actBtn} title="Trash" onClick={onTrash}>🗑️</button>
          </>
        )}
        {view === 'trash' && (
          <>
            <button className={styles.actBtn} title="Restore" onClick={onRestore}>↩️</button>
            <button className={styles.actBtn} title="Delete forever" onClick={onDelete}>❌</button>
          </>
        )}
      </div>

      {/* Content */}
      <div
        className={styles.cardTitle}
        style={{ paddingRight: note.pinned ? '20px' : '70px' }}
      >
        {note.title || 'Untitled'}
      </div>

      {note.body && <div className={styles.cardBody}>{note.body}</div>}

      {note.tags?.length > 0 && (
        <div className={styles.cardTags}>
          {note.tags.slice(0, 3).map((tag) => {
            const tc = getTagColor(tag)
            return (
              <span
                key={tag}
                className={styles.cardTag}
                style={{ background: tc.bg, color: tc.text }}
              >
                #{tag}
              </span>
            )
          })}
          {note.tags.length > 3 && (
            <span
              className={styles.cardTag}
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted)' }}
            >
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className={styles.cardDate}>
        {formatDate(note.updatedAt || note.createdAt)}
      </div>
    </div>
  )
}
