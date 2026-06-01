import styles from './Sidebar.module.css'
import { VIEWS, VIEW_ICONS, VIEW_LABELS } from '../utils/constants'
import { getTagColor } from '../utils/helpers'

export default function Sidebar({ view, activeTag, counts, allTags, onViewChange, onTagClick, isOpen, onClose }) {
  function handleViewChangeWithClose(v) {
    onViewChange(v)
    onClose()
  }

  function handleTagClickWithClose(tag) {
    onTagClick(tag)
    onClose()
  }

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Logo */}
        <div className={styles.logo}>
          <h1>NoteNest</h1>
          <span>your notes, organized</span>
        </div>

        {/* Views */}
        <nav className={styles.navSection}>
          <div className={styles.navLabel}>Views</div>
          {VIEWS.map((v) => (
            <button
              key={v}
              className={`${styles.navItem} ${view === v && !activeTag ? styles.active : ''}`}
              onClick={() => handleViewChangeWithClose(v)}
            >
              <span className={styles.icon}>{VIEW_ICONS[v]}</span>
              {VIEW_LABELS[v]}
              <span className={styles.count}>{counts[v]}</span>
            </button>
          ))}
        </nav>
        {/* Tags */}
        {allTags.length > 0 && (
          <>
            <hr className={styles.divider} />
            <div className={styles.navSection}>
              <div className={styles.navLabel}>Tags</div>
              <div className={styles.tagList}>
                {allTags.map((tag) => {
                  const tc = getTagColor(tag)
                  return (
                    <button
                      key={tag}
                      className={`${styles.tagNav} ${activeTag === tag ? styles.tagActive : ''}`}
                      onClick={() => handleTagClickWithClose(tag)}
                    >
                      <span className={styles.tagDot} style={{ background: tc.dot }} />
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
