import apiClient from '@/shared/lib/apiClient'
import type { CodeExecutionRequest, CodeExecutionResponse } from '../types/playground.types'

export const playgroundApi = {
  runCode: (request: CodeExecutionRequest): Promise<CodeExecutionResponse> =>
    apiClient.post('/code/run', request).then(r => r.data),
}
