import { useState } from 'react'
import { Task, updateTask } from '@/lib/stately'

interface EditTaskData {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export function useTaskEditing() {
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editTask = async (task: Task, updates: EditTaskData): Promise<Task> => {
    setIsEditing(true)
    setError(null)

    try {
      const updatedTask: Task = {
        ...task,
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        updatedAt: BigInt(Math.floor(Date.now() / 1000))
      }

      return await updateTask(updatedTask)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task'
      setError(errorMessage)
      throw err
    } finally {
      setIsEditing(false)
    }
  }

  const clearError = () => setError(null)

  return {
    editTask,
    isEditing,
    error,
    clearError
  }
}