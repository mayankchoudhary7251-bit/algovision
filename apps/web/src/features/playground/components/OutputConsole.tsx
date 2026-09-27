import { Terminal, Clock, MemoryStick, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import type { CodeExecutionResponse } from '../types/playground.types'
import { cn } from '@/shared/lib/utils'

interface OutputConsoleProps {
  result: CodeExecutionResponse | null
  isRunning: boolean
}

export function OutputConsole({ result, isRunning }: OutputConsoleProps) {
  return (
    <div className="flex flex-col h-full rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-3">
        <Terminal className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">Output Console</span>
        {result && (
          <span className={cn(
            'ml-auto flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
            result.status === 'SUCCESS'
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-red-400 bg-red-500/10'
          )}>
            {result.status === 'SUCCESS'
              ? <><CheckCircle className="h-3 w-3" /> Accepted</>
              : <><XCircle className="h-3 w-3" /> {result.status.replace('_', ' ')}</>
            }
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {isRunning ? (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
            Executing code...
          </div>
        ) : result ? (
          <div className="space-y-3">
            {result.status === 'SUCCESS' && result.output && (
              <div>
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Output</div>
                <pre className="text-emerald-400 whitespace-pre-wrap break-words">{result.output}</pre>
              </div>
            )}
            {result.error && (
              <div>
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-red-400" />
                  Error
                </div>
                <pre className="text-red-400 whitespace-pre-wrap break-words">{result.error}</pre>
              </div>
            )}
            {result.status === 'SUCCESS' && (
              <div className="flex items-center gap-4 border-t border-gray-800 pt-3 mt-3">
                {result.executionTime && result.executionTime !== 'null' && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" /> {result.executionTime}s
                  </span>
                )}
                {result.memoryUsed && result.memoryUsed !== 'null' && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <MemoryStick className="h-3 w-3" /> {result.memoryUsed} KB
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-600">
            Click <span className="text-brand-400 font-medium">Run Code</span> to execute your program
          </div>
        )}
      </div>
    </div>
  )
}
