import { ChatThreadType } from '@/types/ChatThread'

export const sortChatThreads = (chatThreads: ChatThreadType[]) => {
  const now = new Date()
  const today = new Date(now.setHours(0, 0, 0, 0))
  const timestamps = {
    yesterday: new Date(today),
    last7Days: new Date(today),
    last30Days: new Date(today),
  }

  timestamps.yesterday.setDate(today.getDate() - 1)
  timestamps.last7Days.setDate(today.getDate() - 7)
  timestamps.last30Days.setDate(today.getDate() - 30)

  const groups: Record<string, ChatThreadType[]> = {
    Today: [],
    Yesterday: [],
    'Last 7 Days': [],
    'Last 30 Days': [],
  }

  const sortedChatThreads = chatThreads.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  sortedChatThreads.forEach((item) => {
    const itemDate = new Date(new Date(item.updatedAt).setHours(0, 0, 0, 0))

    if (itemDate >= today) {
      groups['Today'].push(item)
    } else if (itemDate >= timestamps.yesterday) {
      groups['Yesterday'].push(item)
    } else if (itemDate >= timestamps.last7Days) {
      groups['Last 7 Days'].push(item)
    } else if (itemDate >= timestamps.last30Days) {
      groups['Last 30 Days'].push(item)
    }
  })

  return groups
}
