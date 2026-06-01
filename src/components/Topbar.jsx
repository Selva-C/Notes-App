import styles from './Topbar.module.css'
import { VIEW_LABELS } from '../utils/constants'

export default function Topbar({ view, activeTag, search, trashCount, onSearch, onNewNote, onEmptyTrash, onMenuToggle }) {
  return (
    <div className={styles.topbar}>
      <div className={styles.topbarContent}>
        <button className={styles.menuBtn} onClick={onMenuToggle} title="Menu">
          ☰
        </button>
        <h2 className={styles.title}>
          {activeTag ? `#${activeTag}` : VIEW_LABELS[view]}
        </h2>

        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search notes…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {view === 'notes' && (
          <button className={styles.newBtn} onClick={onNewNote}>
            + New Note
          </button>
        )}

        {view === 'trash' && trashCount > 0 && (
          <button className={styles.dangerBtn} onClick={onEmptyTrash}>
            Empty Trash
          </button>
        )}
      </div>
    </div>
  )
}
