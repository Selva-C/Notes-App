import styles from './EmptyState.module.css'

const MESSAGES = {
  notes: { icon: '📝', text: 'No notes yet. Click "+ New Note" to get started!' },
  pinned: { icon: '📌', text: 'No pinned notes. Pin important notes to find them quickly.' },
  archive: { icon: '📦', text: 'No archived notes.' },
  trash: { icon: '🗑️', text: 'Trash is empty.' },
}

export default function EmptyState({ view, hasSearch }) {
  const { icon, text } = MESSAGES[view] || MESSAGES.notes
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <p>{hasSearch ? 'No notes match your search.' : text}</p>
    </div>
  )
}
