'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Task, Project, deleteTask, updateTask, getProject, getProjectTasks } from '@/lib/stately'
import { TaskCard } from '@/components/task-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TaskModal } from '@/components/add-task-modal'
import { useTaskCreation } from '@/hooks/use-task-creation'
import { useTaskEditing } from '@/hooks/use-task-editing'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = BigInt(params.id as string)
  
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | Task['status']>('all')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  const { makeTask, isCreating, error: createError } = useTaskCreation(projectId)
  const { editTask, isEditing, error: editError } = useTaskEditing()

  useEffect(() => {
    async function loadProjectData() {
      try {
        setLoading(true)
        setError(null)
        
        const [projectData, projectTasks] = await Promise.all([
          getProject(projectId),
          getProjectTasks(projectId)
        ])

        if (!projectData) {
          setError('Project not found')
          return
        }

        setProject(projectData)
        setTasks(projectTasks)
      } catch (err) {
        console.error('Failed to load project data:', err)
        setError('Failed to load project data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadProjectData()
  }, [projectId])

  const handleTaskStatusChange = async (task: Task, newStatus: Task['status']) => {
    try {
      const updates: Task =  {
        ...task,
        status: newStatus,
        // If marking as completed, set completedAt timestamp
        completedAt: newStatus === 'completed' ? BigInt(Math.floor(Date.now() / 1000)) : BigInt(0),
      }
      
      await updateTask(updates)

      setTasks(prev => prev.map(t => 
        t.id === task.id
          ? { ...t, ...updates }
          : t
      ))
    } catch (err) {
      console.error('Failed to update task status:', err)
      setError('Failed to update task status. Please try again.')
    }
  }

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task)
    setModalMode('edit')
    setShowTaskModal(true)
  }

  const handleTaskDelete = async (taskId: bigint) => {
    try {
      await deleteTask(projectId, taskId)
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (err) {
      console.error('Failed to delete task:', err)
      setError('Failed to delete task. Please try again.')
    }
  }

  const handleCreateTask = async (taskData: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
  }) => {
    try {
      // Convert the simple taskData to a full Task object for the API
      const fullTaskData = {
        projectId,
        title: taskData.title,
        description: taskData.description,
        status: filter === 'all' ? 'todo' : filter,
        priority: taskData.priority,
        assigneeId: BigInt(1), // TODO: Replace with actual user ID
        creatorId: BigInt(1), // TODO: Replace with actual user ID
        tags: [],
        isActive: true,
        dueDate: BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default due in 7 days
        order: BigInt(1),
        commentCount: BigInt(0),
        completedAt: BigInt(0),
      }

      const newTask = await makeTask(fullTaskData)
      setTasks(prev => [...prev, newTask])
      setShowTaskModal(false)
      setEditingTask(null)
    } catch (err) {
      // Error is already handled by the hook
      console.error('Failed to create task:', err)
    }
  }

  const handleEditTask = async (taskData: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
  }) => {
    if (!editingTask) return

    try {
      const updatedTask = await editTask(editingTask, taskData)
      setTasks(prev => prev.map(task =>
        task.id === editingTask.id ? updatedTask : task
      ))
      setShowTaskModal(false)
      setEditingTask(null)
    } catch (err) {
      // Error is already handled by the hook
      console.error('Failed to edit task:', err)
    }
  }

  const handleOpenCreateModal = () => {
    setEditingTask(null)
    setModalMode('create')
    setShowTaskModal(true)
  }

  const handleCloseModal = () => {
    setShowTaskModal(false)
    setEditingTask(null)
  }

  const filteredTasks = tasks.filter(task => 
    filter === 'all' || task.status === filter
  )

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    archived: tasks.filter(t => t.status === 'archived').length,
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600 mb-4">
              {error || 'Project Not Found'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-6">
              {error || 'The project you are looking for does not exist.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/projects">
                <Button>Back to Projects</Button>
              </Link>
              {error && (
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Project Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                ← Back to Projects
              </Button>
            </Link>
          </div>
          <Button onClick={handleOpenCreateModal}>
            + Add Task
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: project.color }}
          >
            {project.emoji}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-gray-600 mb-1">
                {tasksByStatus.todo}
              </div>
              <div className="text-sm text-gray-500">To Do</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {tasksByStatus['in-progress']}
              </div>
              <div className="text-sm text-gray-500">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {tasksByStatus.completed}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-gray-400 mb-1">
                {tasksByStatus.archived}
              </div>
              <div className="text-sm text-gray-500">Archived</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Task Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'todo', 'in-progress', 'completed', 'archived'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status === 'all' ? 'All Tasks' : status.replace('-', ' ')}
            {status !== 'all' && ` (${tasksByStatus[status]})`}
          </Button>
        ))}
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleTaskStatusChange}
              onEdit={handleTaskEdit}
              onDelete={handleTaskDelete}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-600 mb-4">
              {filter === 'all' ? 'No Tasks Yet' : `No ${filter.replace('-', ' ')} Tasks`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? 'Create your first task to get started'
                : `No tasks are currently ${filter.replace('-', ' ')}`
              }
            </p>
            <Button onClick={handleOpenCreateModal}>
              Add New Task
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={handleCloseModal}
        onSubmit={modalMode === 'create' ? handleCreateTask : handleEditTask}
        isLoading={modalMode === 'create' ? isCreating : isEditing}
        editingTask={editingTask}
        mode={modalMode}
      />

      {/* Task Error Notifications */}
      {createError && (
        <div className="fixed bottom-6 right-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm animate-in slide-in-from-bottom duration-300 max-w-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl">❌</span>
            <div>
              <p className="font-semibold text-sm">Create Failed!</p>
              <p className="text-sm">{createError}</p>
            </div>
          </div>
        </div>
      )}

      {editError && (
        <div className="fixed bottom-6 right-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm animate-in slide-in-from-bottom duration-300 max-w-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl">❌</span>
            <div>
              <p className="font-semibold text-sm">Update Failed!</p>
              <p className="text-sm">{editError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}