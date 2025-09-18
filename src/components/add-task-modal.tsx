'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Task } from '@/lib/stately'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
  }) => Promise<void>
  isLoading?: boolean
  editingTask?: Task | null
  mode?: 'create' | 'edit'
}

const priorityEmojis = {
  low: '🟢',
  medium: '🟡',
  high: '🟠',
  urgent: '🔴'
}

const priorityColors = {
  low: 'border-green-200 bg-green-50 text-green-700',
  medium: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  high: 'border-orange-200 bg-orange-50 text-orange-700',
  urgent: 'border-red-200 bg-red-50 text-red-700'
}

export function TaskModal({ isOpen, onClose, onSubmit, isLoading = false, editingTask = null, mode = 'create' }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')

  // Initialize form with editing task data when editing
  useEffect(() => {
    if (editingTask && mode === 'edit') {
      setTitle(editingTask.title)
      setDescription(editingTask.description)
      setPriority(editingTask.priority as 'low' | 'medium' | 'high' | 'urgent')
    }
  }, [editingTask, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority
    })

    // Only reset form after successful creation, not edit
    if (mode === 'create') {
      setTitle('')
      setDescription('')
      setPriority('medium')
    }
  }

  const handleClose = () => {
    if (mode === 'create') {
      setTitle('')
      setDescription('')
      setPriority('medium')
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 backdrop-blur animate-in zoom-in-95 duration-300">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {mode === 'edit' ? '✏️ Edit Task' : '✨ New Task'}
            </CardTitle>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-500 text-sm">
            {mode === 'edit' ? 'Make it even better 🎯' : 'Create something awesome 🚀'}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                📝 What needs to be done? <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Make it snappy and clear..."
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                💭 Tell us more
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                placeholder="Add context, links, or details..."
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                🎯 Priority Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    disabled={isLoading}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium text-sm
                      ${priority === p
                        ? `${priorityColors[p]} border-current transform scale-105`
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="text-lg">{priorityEmojis[p]}</span>
                    <span className="capitalize">{p}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 h-12 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!title.trim() || isLoading}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:from-gray-400 disabled:to-gray-400"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {mode === 'edit' ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{mode === 'edit' ? '💾' : '✨'}</span>
                    {mode === 'edit' ? 'Update Task' : 'Create Task'}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Legacy export for backward compatibility
export { TaskModal as AddTaskModal }