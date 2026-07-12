import { motion } from 'framer-motion'

const TECH_CATEGORIES = [
  {
    label: 'Frontend',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/5',
    techs: [
      { name: 'React 18',       icon: '⚛️',  description: 'UI framework' },
      { name: 'TypeScript 5',   icon: '🔷',  description: 'Type safety' },
      { name: 'Vite 5',         icon: '⚡',  description: 'Build tool' },
      { name: 'Tailwind CSS',   icon: '🎨',  description: 'Styling' },
      { name: 'Framer Motion',  icon: '🎬',  description: 'Animations' },
      { name: 'React Router',   icon: '🔀',  description: 'Routing' },
      { name: 'TanStack Query', icon: '🔄',  description: 'Server state' },
      { name: 'Zustand',        icon: '🐻',  description: 'Client state' },
    ],
  },
  {
    label: 'Backend',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/5',
    techs: [
      { name: 'Java 17',        icon: '☕',  description: 'Language' },
      { name: 'Spring Boot 3',  icon: '🍃',  description: 'Framework' },
      { name: 'Spring Security',icon: '🔒',  description: 'Auth & authz' },
      { name: 'Spring Data JPA',icon: '🗄️',  description: 'ORM layer' },
      { name: 'JWT',            icon: '🎫',  description: 'Authentication' },
      { name: 'Flyway',         icon: '🦅',  description: 'DB migrations' },
      { name: 'Lombok',         icon: '🌶️',  description: 'Code generation' },
      { name: 'MapStruct',      icon: '🗺️',  description: 'DTO mapping' },
    ],
  },
  {
    label: 'Infrastructure',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/5',
    techs: [
      { name: 'PostgreSQL 16',  icon: '🐘',  description: 'Primary DB' },
      { name: 'Redis 7',        icon: '🔴',  description: 'Cache layer' },
      { name: 'Docker',         icon: '🐳',  description: 'Containers' },
      { name: 'GitHub Actions', icon: '⚙️',  description: 'CI/CD' },
      { name: 'Vercel',         icon: '▲',   description: 'Frontend deploy' },
      { name: 'Render',         icon: '🚀',  description: 'Backend deploy' },
    ],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const categoryVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export function TechStackSection() {
  return (
    <section className="relative bg-gray-950 py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-400">
            Tech Stack
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-50 sm:text-4xl">
            Built with{' '}
            <span className="text-gradient">industry-standard</span> tools
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Every technology was chosen for a reason — performance, developer experience,
            and real-world relevance for software engineering interviews.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {TECH_CATEGORIES.map((category) => (
            <motion.div
              key={category.label}
              variants={categoryVariants}
              className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${category.border.replace('border-', 'to-').replace('/20', '/50')}`} />
                <h3 className={`text-sm font-bold uppercase tracking-widest ${category.color}`}>
                  {category.label}
                </h3>
                <div className={`h-px flex-1 bg-gradient-to-l from-transparent ${category.border.replace('border-', 'to-').replace('/20', '/50')}`} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {category.techs.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    className={`flex items-center gap-3 rounded-xl border ${category.border} ${category.bg} p-3 transition-all hover:border-opacity-50`}
                  >
                    <span className="text-xl" role="img" aria-label={tech.name}>
                      {tech.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-gray-200">
                        {tech.name}
                      </div>
                      <div className="truncate text-xs text-gray-500">
                        {tech.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
