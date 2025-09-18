import { useState } from 'react'
import { Project, updateProject } from '@/lib/stately'

interface EditProjectData {
  name: string
  description: string
  emoji: string
  color: string
  isPublic: boolean
}

export function useProjectEditing() {
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editProject = async (project: Project, updates: EditProjectData): Promise<Project> => {
    setIsEditing(true)
    setError(null)

    try {
      const updatedProject: Project = {
        ...project,
        name: updates.name,
        description: updates.description,
        emoji: updates.emoji,
        color: updates.color,
        isPublic: updates.isPublic,
        updatedAt: BigInt(Math.floor(Date.now() / 1000))
      }

      return await updateProject(updatedProject)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project'
      setError(errorMessage)
      throw err
    } finally {
      setIsEditing(false)
    }
  }

  const clearError = () => setError(null)

  return {
    editProject,
    isEditing,
    error,
    clearError
  }
}