import { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Navbar } from '@/features/landing/components/Navbar'
import { Toolbar } from '../components/Toolbar'
import { OutputConsole } from '../components/OutputConsole'
import { LANGUAGE_CONFIGS } from '../components/languageConfigs'
import { playgroundApi } from '../api/playground.api'
import type { PlaygroundLanguage, CodeExecutionResponse } from '../types/playground.types'

export function PlaygroundPage() {
  const [language, setLanguage] = useState<PlaygroundLanguage>('PYTHON')
  const [code, setCode] = useState(LANGUAGE_CONFIGS[0].defaultCode)
  const [stdin, setStdin] = useState('')
  const [result, setResult] = useState<CodeExecutionResponse | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const editorRef = useRef<unknown>(null)

  const currentLang = LANGUAGE_CONFIGS.find(l => l.id === language)!

  function handleLanguageChange(lang: PlaygroundLanguage) {
    setLanguage(lang)
    const config = LANGUAGE_CONFIGS.find(l => l.id === lang)!
    setCode(config.defaultCode)
    setResult(null)
  }

  async function handleRun() {
    if (!code.trim()) { toast.error('Please write some code first'); return }
    setIsRunning(true)
    setResult(null)
    try {
      const response = await playgroundApi.runCode({ sourceCode: code, language, stdin })
      setResult(response)
      if (response.status === 'SUCCESS') {
        toast.success('Code executed successfully!')
      } else {
        toast.error(response.status.replace('_', ' '))
      }
    } catch {
      toast.error('Execution failed. Please try again.')
    } finally {
      setIsRunning(false)
    }
  }

  function handleClear() {
    setCode(currentLang.defaultCode)
    setResult(null)
  }

  function handleCopy() {
    navigator.clipboard.writeText(code)
    toast.success('Code copied to clipboard!')
  }

  function handleDownload() {
    const extensions: Record<PlaygroundLanguage, string> = {
      PYTHON: 'py', JAVA: 'java', CPP: 'cpp', JAVASCRIPT: 'js'
    }
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `solution.${extensions[language]}`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Code downloaded!')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold text-gray-100">Coding Playground</h1>
          <p className="mt-1 text-gray-400">Write, run, and test code in Java, C++, Python, and JavaScript</p>
        </motion.div>

        <div className="flex flex-col gap-4">
          <Toolbar
            language={language}
            languages={LANGUAGE_CONFIGS}
            isRunning={isRunning}
            onLanguageChange={handleLanguageChange}
            onRun={handleRun}
            onClear={handleClear}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" style={{ height: '60vh' }}>
            <div className="rounded-xl border border-gray-800 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-gray-800 bg-gray-900 px-4 py-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-gray-500 font-mono ml-2">
                  {currentLang.label.toLowerCase()}_solution.{
                    { PYTHON: 'py', JAVA: 'java', CPP: 'cpp', JAVASCRIPT: 'js' }[language]
                  }
                </span>
              </div>
              <Editor
                height="calc(100% - 37px)"
                language={currentLang.monacoLanguage}
                value={code}
                onChange={v => setCode(v ?? '')}
                onMount={editor => { editorRef.current = editor }}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  roundedSelection: true,
                  automaticLayout: true,
                  tabSize: 4,
                  padding: { top: 12 },
                }}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-3">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Standard Input (stdin)</div>
                <textarea
                  value={stdin}
                  onChange={e => setStdin(e.target.value)}
                  placeholder="Enter input for your program here..."
                  className="w-full h-20 bg-transparent text-sm text-gray-300 font-mono placeholder-gray-600 outline-none resize-none"
                />
              </div>
              <div className="flex-1">
                <OutputConsole result={result} isRunning={isRunning} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
