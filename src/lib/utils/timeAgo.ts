export const timeAgo = (dateString: Date): string => {
  const date: Date = new Date(dateString)
  const now: Date = new Date()
  const diff: number = Math.abs(now.getTime() - date.getTime())

  const minute: number = 60 * 1000
  const hour: number = 60 * minute
  const day: number = 24 * hour
  const week: number = 7 * day
  const month: number = 30 * day // Roughly
  const year: number = 365 * day // Roughly

  if (diff < minute) {
    return `${Math.floor(diff / 1000)} seconds ago`
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)} minutes ago`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)} hours ago`
  } else if (diff < week) {
    return `${Math.floor(diff / day)} days ago`
  } else if (diff < month) {
    return `${Math.floor(diff / week)} weeks ago`
  } else if (diff < year) {
    return `${Math.floor(diff / month)} months ago`
  } else {
    return `${Math.floor(diff / year)} years ago`
  }
}
