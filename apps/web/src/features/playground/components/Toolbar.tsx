import { Play, Trash2, Copy, Download, Loader2 } from 'lucide-react'
import type { PlaygroundLanguage, LanguageConfig } from '../types/playground.types'
import { cn } from '@/shared/lib/utils'

interface ToolbarProps {
  language: PlaygroundLanguage
  languages: LanguageConfig[]
  isRunning: boolean
  onLanguageChange: (lang: PlaygroundLanguage) => void
  onRun: () => void
  onClear: () => void
  onCopy: () => void
  onDownload: () => void
}

export function Toolbar({
  language, languages, isRunning,
  onLanguageChange, onRun, onClear, onCopy, onDownload
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3">
      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={e => onLanguageChange(e.target.value as PlaygroundLanguage)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-100 outline-none focus:border-brand-500 cursor-pointer"
        >
          {languages.map(l => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onCopy} title="Copy code"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-all">
          <Copy className="h-4 w-4" />
        </button>
        <button onClick={onDownload} title="Download code"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-all">
          <Download className="h-4 w-4" />
        </button>
        <button onClick={onClear} title="Clear editor"
          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all">
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          onClick={onRun}
          disabled={isRunning}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all',
            'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isRunning ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Running...</>
          ) : (
            <><Play className="h-4 w-4" />Run Code</>
          )}
        </button>
      </div>
    </div>
  )
}
