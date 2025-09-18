import { useState } from 'react'
import { Task } from '@/lib/stately'
import { createTask } from '@/lib/stately'

export function useTaskCreation(projectId: bigint) {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makeTask = async (task: Omit<Task, '$typeName' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    setIsCreating(true)
    setError(null)

    try {
      return await createTask(task)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task'
      setError(errorMessage)
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  const clearError = () => setError(null)

  return {
    makeTask,
    isCreating,
    error,
    clearError
  }
}