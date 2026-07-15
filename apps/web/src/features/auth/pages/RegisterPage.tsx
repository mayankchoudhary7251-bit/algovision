import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Zap, Mail, Lock, User, Loader2, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerSchema, type RegisterFormData } from '../schemas/auth.schemas'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/authStore'
import { cn } from '@/shared/lib/utils'

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
]

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const passwordValue = watch('password', '')

  async function onSubmit(data: RegisterFormData) {
    try {
      const response = await authApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
      })
      setAuth(response)
      toast.success('Account created! Welcome to AlgoVision.')
      navigate('/dashboard', { replace: true })
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string; errors?: Record<string, string> } } }
      const detail = err?.response?.data?.detail
      const fieldErrors = err?.response?.data?.errors
      if (fieldErrors) {
        Object.values(fieldErrors).forEach((msg) => toast.error(msg))
      } else {
        toast.error(detail ?? 'Registration failed. Please try again.')
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 shadow-lg shadow-brand-500/25">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-100">
                Algo<span className="text-brand-400">Vision</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-100">Create your account</h1>
            <p className="mt-2 text-sm text-gray-400">
              Start mastering DSA visually — free forever
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  {...register('username')}
                  type="text"
                  autoComplete="username"
                  placeholder="your_username"
                  className={cn(
                    'w-full rounded-lg border bg-gray-800/50 py-3 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 outline-none transition-all',
                    'focus:border-brand-500 focus:ring-1 focus:ring-brand-500',
                    errors.username ? 'border-red-500' : 'border-gray-700'
                  )}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={cn(
                    'w-full rounded-lg border bg-gray-800/50 py-3 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 outline-none transition-all',
                    'focus:border-brand-500 focus:ring-1 focus:ring-brand-500',
                    errors.email ? 'border-red-500' : 'border-gray-700'
                  )}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className={cn(
                    'w-full rounded-lg border bg-gray-800/50 py-3 pl-10 pr-11 text-sm text-gray-100 placeholder-gray-500 outline-none transition-all',
                    'focus:border-brand-500 focus:ring-1 focus:ring-brand-500',
                    errors.password ? 'border-red-500' : 'border-gray-700'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordValue && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {PASSWORD_RULES.map((rule) => {
                    const passing = rule.test(passwordValue)
                    return (
                      <div key={rule.label} className="flex items-center gap-1">
                        {passing ? (
                          <Check className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <X className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        )}
                        <span className={cn(
                          'text-xs',
                          passing ? 'text-emerald-400' : 'text-gray-500'
                        )}>
                          {rule.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  className={cn(
                    'w-full rounded-lg border bg-gray-800/50 py-3 pl-10 pr-11 text-sm text-gray-100 placeholder-gray-500 outline-none transition-all',
                    'focus:border-brand-500 focus:ring-1 focus:ring-brand-500',
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create free account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-brand-400 hover:text-brand-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
