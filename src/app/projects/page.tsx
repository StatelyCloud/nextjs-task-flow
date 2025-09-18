'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Project, getUserProjects, deleteProject, updateProject } from '@/lib/stately'
import { ProjectCard } from '@/components/project-card'
import { ProjectModal } from '@/components/project-modal'
import { useProjectEditing } from '@/hooks/use-project-editing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CardSkeleton } from '@/components/ui/loading'
import { StatGrid } from '@/components/ui/stat-card'
import { layoutClasses } from '@/lib/styles'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { editProject, isEditing, error: editError } = useProjectEditing()

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true)
        setError(null)
        // TODO: Replace with actual user ID from auth
        const userProjects = await getUserProjects(BigInt(1))
        setProjects(userProjects)
      } catch (err) {
        console.error('Failed to load projects:', err)
        setError('Failed to load projects. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const handleDeleteProject = async (projectId: bigint) => {
    try {
      await deleteProject(projectId)
      setProjects(prev => prev.filter(p => p.id !== projectId))
    } catch (err) {
      console.error('Failed to delete project:', err)
      setError('Failed to delete project. Please try again.')
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = async (editData: {
    name: string
    description: string
    emoji: string
    color: string
    isPublic: boolean
  }) => {
    if (!editingProject) return

    try {
      const updatedProject = await editProject(editingProject, editData)
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p))
      setIsEditModalOpen(false)
      setEditingProject(null)
    } catch (err) {
      console.error('Failed to edit project:', err)
      setError('Failed to edit project. Please try again.')
    }
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingProject(null)
  }

  const stats = [
    { title: 'Total Projects', value: projects.length.toString(), color: 'text-primary-600' },
    { title: 'Active Tasks', value: projects.reduce((sum, p) => sum + Number(p.taskCount - p.completedTaskCount), 0).toString(), color: 'text-warning-600' },
    { title: 'Completed Tasks', value: projects.reduce((sum, p) => sum + Number(p.completedTaskCount), 0).toString(), color: 'text-success-600' },
  ]

  if (loading) {
    return (
      <div className={layoutClasses.container}>
        <div className="space-y-6">
          <div className="h-8 loading-shimmer rounded w-1/4"></div>
          <CardSkeleton />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={layoutClasses.container}>
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600 mb-4">
              Error Loading Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={layoutClasses.container}>
      <div className={layoutClasses.flex.between + ' mb-8'}>
        <div>
          <h1 className={layoutClasses.text.title + ' mb-2'}>Projects</h1>
          <p className={layoutClasses.text.subtitle}>
            Manage your projects and track progress across all tasks
          </p>
        </div>
        <Link href="/projects/new">
          <Button>+ New Project</Button>
        </Link>
      </div>

      {projects.length > 0 ? (
        <>
          <div className={layoutClasses.grid.responsive}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
          
          <StatGrid stats={stats} className="mt-12" />
        </>
      ) : (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-600 mb-4">
              No Projects Yet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-6">
              Create your first project to start organizing your tasks
            </p>
            <Link href="/projects/new">
              <Button>Create Your First Project</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        isLoading={isEditing}
        editingProject={editingProject}
        mode="edit"
      />
    </div>
  )
}