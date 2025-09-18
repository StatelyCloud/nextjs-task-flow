'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Project } from '@/lib/stately'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (projectData: {
    name: string
    description: string
    emoji: string
    color: string
    isPublic: boolean
  }) => Promise<void>
  isLoading?: boolean
  editingProject?: Project | null
  mode?: 'create' | 'edit'
}

const defaultEmojis = ['🚀', '💼', '📊', '🎯', '💡', '🌟', '🔥', '⚡', '🎨', '🛠️', '📈', '🏆']
const defaultColors = [
  '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B',
  '#10B981', '#F97316', '#EC4899', '#6366F1',
  '#14B8A6', '#84CC16', '#F43F5E', '#8B5A2B'
]

export function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editingProject = null,
  mode = 'create'
}: ProjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [emoji, setEmoji] = useState('🚀')
  const [color, setColor] = useState('#3B82F6')
  const [isPublic, setIsPublic] = useState(false)

  // Initialize form with editing project data when editing
  useEffect(() => {
    if (editingProject && mode === 'edit') {
      setName(editingProject.name)
      setDescription(editingProject.description || '')
      setEmoji(editingProject.emoji)
      setColor(editingProject.color)
      setIsPublic(editingProject.isPublic || false)
    }
  }, [editingProject, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      emoji,
      color,
      isPublic
    })

    // Only reset form after successful creation, not edit
    if (mode === 'create') {
      setName('')
      setDescription('')
      setEmoji('🚀')
      setColor('#3B82F6')
      setIsPublic(false)
    }
  }

  const handleClose = () => {
    if (mode === 'create') {
      setName('')
      setDescription('')
      setEmoji('🚀')
      setColor('#3B82F6')
      setIsPublic(false)
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
              {mode === 'edit' ? '✏️ Edit Project' : '✨ New Project'}
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
            {mode === 'edit' ? 'Update your project details 🎯' : 'Bring your ideas to life 🚀'}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                📝 Project Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter project name..."
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                💭 Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                placeholder="What's this project about?"
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                🎨 Project Icon
              </label>
              <div className="grid grid-cols-6 gap-2">
                {defaultEmojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    disabled={isLoading}
                    className={`
                      w-12 h-12 rounded-xl border-2 transition-all duration-200 text-lg
                      ${emoji === e
                        ? 'border-blue-500 bg-blue-50 transform scale-110'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                🌈 Project Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {defaultColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    disabled={isLoading}
                    className={`
                      w-12 h-12 rounded-xl border-2 transition-all duration-200
                      ${color === c
                        ? 'border-gray-800 transform scale-110'
                        : 'border-gray-200 hover:border-gray-400'
                      }
                    `}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                id="isPublic"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isLoading}
              />
              <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                🌍 Make this project public
              </label>
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
                disabled={!name.trim() || isLoading}
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
                    {mode === 'edit' ? 'Update Project' : 'Create Project'}
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