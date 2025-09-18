'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Task } from '@/lib/stately'

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

export function TaskModal({onClose, onSubmit, isLoading = false, editingTask = null, mode = 'create' }: {
  onClose: () => void
  onSubmit: (taskData: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    tags: string[]
  }) => Promise<void>
  isLoading?: boolean
  editingTask?: Task | null
  mode?: 'create' | 'edit'
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Initialize form with editing task data when editing
  useEffect(() => {
    if (editingTask && mode === 'edit') {
      setTitle(editingTask.title)
      setDescription(editingTask.description)
      setPriority(editingTask.priority as 'low' | 'medium' | 'high' | 'urgent')
      setTags(editingTask.tags || [])
    }
  }, [editingTask, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      tags
    })

    // Only reset form after successful creation, not edit
    if (mode === 'create') {
      setTitle('')
      setDescription('')
      setPriority('low')
      setTags([])
      setTagInput('')
    }
  }

  const handleClose = () => {
    if (mode === 'create') {
      setTitle('')
      setDescription('')
      setPriority('low')
      setTags([])
      setTagInput('')
    }
    onClose()
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

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

            <div className="space-y-3">
              <label htmlFor="tags" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                🏷️ Tags
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    id="tags"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                    placeholder="Add a tag..."
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!tagInput.trim() || isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          disabled={isLoading}
                          className="ml-1 text-blue-600 hover:text-blue-800 disabled:cursor-not-allowed"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {mode === 'edit' && editingTask && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  📊 Current Status
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      editingTask.status === 'completed' ? 'bg-green-100 text-green-800' :
                      editingTask.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      editingTask.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {editingTask.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm text-gray-800">
                      {new Date(Number(editingTask.createdAt) * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  {editingTask.completedAt && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">Completed:</span>
                      <span className="text-sm text-gray-800">
                        {new Date(Number(editingTask.completedAt) * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

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