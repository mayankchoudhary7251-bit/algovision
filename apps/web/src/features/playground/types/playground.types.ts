
export type PlaygroundLanguage = 'JAVA' | 'CPP' | 'PYTHON' | 'JAVASCRIPT'

export interface CodeExecutionRequest {
  sourceCode: string
  language: PlaygroundLanguage
  stdin: string
}

export interface CodeExecutionResponse {
  output: string | null
  error: string | null
  executionTime: string | null
  memoryUsed: string | null
  status: 'SUCCESS' | 'COMPILE_ERROR' | 'RUNTIME_ERROR' | 'API_ERROR' | 'INVALID_LANGUAGE'
  language: string
}

export interface LanguageConfig {
  id: PlaygroundLanguage
  label: string
  monacoLanguage: string
  defaultCode: string
}
