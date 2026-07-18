import apiClient from '@/shared/lib/apiClient'

export interface Topic {
  id: string
  slug: string
  name: string
  category: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  description: string
  timeComplexity: string
  spaceComplexity: string
}

export interface UserProgress {
  id: string
  topic: Topic
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  completedAt: string | null
}

export const dashboardApi = {
  getTopics: (): Promise<Topic[]> =>
    apiClient.get('/topics').then(r => r.data),

  getProgress: (): Promise<UserProgress[]> =>
    apiClient.get('/progress').then(r => r.data),

  updateProgress: (topicSlug: string, status: string): Promise<void> =>
    apiClient.put(`/progress/${topicSlug}`, { status }).then(() => undefined),
}
