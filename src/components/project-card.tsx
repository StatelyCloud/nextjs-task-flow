'use client'

import Link from 'next/link'
import { Project } from '@/lib/stately'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, layoutClasses } from '@/lib/styles'

interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (projectId: bigint) => void
}

const formatDate = (timestamp?: bigint) => {
  if (!timestamp) return null
  return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const ProjectIcon = ({ project }: { project: Project }) => (
  <div 
    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
    style={{ backgroundColor: project.color }}
  >
    {project.emoji}
  </div>
)

const ProjectActions = ({ project, onEdit, onDelete }: Pick<ProjectCardProps, 'project' | 'onEdit' | 'onDelete'>) => (
  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onEdit?.(project)
      }}
      className="h-8 w-8 p-0 hover:bg-gray-200"
    >
      ✏️
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onDelete?.(project.id)
      }}
      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
    >
      🗑️
    </Button>
  </div>
)

const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => (
  <div className="mb-4">
    <div className={cn(layoutClasses.flex.between, layoutClasses.text.muted, 'mb-1')}>
      <span>Progress</span>
      <span>{percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all duration-300"
        style={{ 
          width: `${percentage}%`,
          backgroundColor: color 
        }}
      />
    </div>
  </div>
)

const TaskStats = ({ project }: { project: Project }) => (
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div className="text-center">
      <div className="text-lg font-semibold text-gray-900">
        {Number(project.taskCount) - Number(project.completedTaskCount)}
      </div>
      <div className={layoutClasses.text.muted}>Remaining</div>
    </div>
    <div className="text-center">
      <div className="text-lg font-semibold text-success-600">
        {Number(project.completedTaskCount)}
      </div>
      <div className={layoutClasses.text.muted}>Completed</div>
    </div>
  </div>
)

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const completionPercentage = Number(project.taskCount) > 0 
    ? Math.round((Number(project.completedTaskCount) / Number(project.taskCount)) * 100)
    : 0

  return (
    <Card className="card-hover group" hover>
      <CardHeader className="pb-3">
        <div className={layoutClasses.flex.between}>
          <div className={layoutClasses.flex.gap}>
            <ProjectIcon project={project} />
            <div>
              <CardTitle className={layoutClasses.text.cardTitle}>
                {project.name}
              </CardTitle>
              <p className={cn(layoutClasses.text.subtitle, 'mt-1')}>
                {Number(project.taskCount)} tasks • {completionPercentage}% complete
              </p>
            </div>
          </div>
          <ProjectActions project={project} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {project.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
        )}

        <ProgressBar percentage={completionPercentage} color={project.color} />
        <TaskStats project={project} />

        <div className={cn(layoutClasses.flex.between, layoutClasses.text.muted, 'mb-3')}>
          <span>Created {formatDate(project.createdAt)}</span>
          {project.isPublic && (
            <Badge className="bg-primary-100 text-primary-700">
              Public
            </Badge>
          )}
        </div>

        <Link href={`/projects/${project.id}`} className="block">
          <Button variant="outline" className="w-full">
            View Project
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}