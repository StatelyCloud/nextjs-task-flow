import Link from 'next/link'
import { PlusIcon, FolderIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { StatGrid } from '@/components/ui/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { layoutClasses } from '@/lib/styles'

const stats = [
  { title: 'Projects', value: '0', icon: <FolderIcon className="h-8 w-8" />, color: 'text-primary-600' },
  { title: 'In Progress', value: '0', icon: <ClockIcon className="h-8 w-8" />, color: 'text-warning-600' },
  { title: 'Completed', value: '0', icon: <CheckCircleIcon className="h-8 w-8" />, color: 'text-success-600' },
]

const features = [
  { icon: '⚡', title: 'Real-time Collaboration', desc: 'Work together in real-time with StatelyDB\'s powerful backend' },
  { icon: '🎨', title: 'Beautiful UI', desc: 'Modern, responsive design with smooth animations' },
  { icon: '🚀', title: 'Fast & Scalable', desc: 'Built with Next.js 14+ for optimal performance' },
]

export default function HomePage() {
  return (
    <div className={layoutClasses.container}>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gradient mb-4">
          ✨ TaskFlow
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A modern task management application built with Next.js 14+ and StatelyDB - 
          learn how to build real-time, collaborative todo apps!
        </p>
      </div>

      <StatGrid stats={stats} className="mb-12" />

      <div className="text-center">
        <Card className="glass max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Get Started with TaskFlow</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Create your first project and start managing tasks like a pro!
            </p>
            <Link href="/projects/new">
              <Button className={layoutClasses.flex.gap}>
                <PlusIcon className="h-5 w-5" />
                Create Your First Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
          ✨ Features
        </h3>
        <div className={layoutClasses.grid.responsive}>
          {features.map((feature, index) => (
            <Card key={index} className="glass" hover>
              <CardContent className="p-6">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}