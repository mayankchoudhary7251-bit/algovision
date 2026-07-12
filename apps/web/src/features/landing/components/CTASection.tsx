import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

export function CTASection() {
  return (
    <section className="relative bg-gray-950 py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-brand-500/20 bg-gradient-to-b from-brand-500/10 to-transparent p-12 text-center backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 shadow-2xl shadow-brand-500/40"
          >
            <Zap className="h-8 w-8 text-white" />
          </motion.div>

          <h2 className="text-3xl font-extrabold tracking-tight text-gray-50 sm:text-4xl lg:text-5xl">
            Ready to master
            <br />
            <span className="text-gradient">DSA visually?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
            Join thousands of students and engineers who are learning
            algorithms the right way — by seeing them in action.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/auth/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-brand-500/40 hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/visualizer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-8 py-4 text-base font-semibold text-gray-300 transition-all hover:border-gray-600 hover:text-white hover:-translate-y-0.5"
            >
              Explore Algorithms
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required · Free forever · Open source
          </p>
        </motion.div>
      </div>
    </section>
  )
}
