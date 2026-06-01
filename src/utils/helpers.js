import { TAG_COLORS } from './constants'

/**
 * Returns a consistent color object for a given tag string.
 */
export function getTagColor(tag) {
  let hash = 0
  for (let c of tag) hash = (hash * 31 + c.charCodeAt(0)) % TAG_COLORS.length
  return TAG_COLORS[hash]
}

/**
 * Formats a timestamp into a readable date string.
 */
export function formatDate(ts) {
  const d = new Date(ts)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Generates a unique ID based on timestamp + random suffix.
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Filters notes based on current view, search query, and active tag.
 */
export function filterNotes(notes, { view, search, activeTag }) {
  return notes.filter((n) => {
    // View filter
    if (view === 'notes' && (n.archived || n.trashed)) return false
    if (view === 'pinned' && (!n.pinned || n.archived || n.trashed)) return false
    if (view === 'archive' && (!n.archived || n.trashed)) return false
    if (view === 'trash' && !n.trashed) return false

    // Search filter
    if (search) {
      const q = search.toLowerCase()
      if (
        !n.title.toLowerCase().includes(q) &&
        !n.body.toLowerCase().includes(q)
      )
        return false
    }

    // Tag filter
    if (activeTag && view !== 'trash') {
      if (!n.tags || !n.tags.includes(activeTag)) return false
    }

    return true
  })
}
