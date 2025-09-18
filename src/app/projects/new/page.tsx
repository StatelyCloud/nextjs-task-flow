'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Project, createProject } from '../../../lib/stately'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { clsx } from 'clsx'

const projectColors = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#ec4899', // pink
  '#6b7280', // gray
]

const projectEmojis = [
  '🚀', '💼', '📱', '🎨', '📊', '🔧', '📚', '🌟', '🎯', '💡',
  '🏆', '📝', '🎵', '🍕', '🌈', '⚡', '🔥', '❤️', '🎮', '🌸'
]

export default function NewProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Omit<Project, '$typeName' |'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    color: projectColors[0],
    emoji: projectEmojis[0],
    ownerId: BigInt(1), // TODO: Replace with actual user ID from auth
    isActive: true,
    taskCount: BigInt(0),
    completedTaskCount: BigInt(0),
    isPublic: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const project = await createProject(formData)
      console.log('Project created:', formData)

      // Redirect to the new project page
      router.push(`/projects/${project.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
        <p className="text-gray-600">
          Set up a new project to organize and track your tasks
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project name"
              />
            </div>

            {/* Project Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your project (optional)"
              />
            </div>

            {/* Project Emoji */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Icon
              </label>
              <div className="grid grid-cols-10 gap-2">
                {projectEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                    className={clsx(
                      'w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg hover:border-blue-300 transition-colors',
                      formData.emoji === emoji
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Color
              </label>
              <div className="grid grid-cols-10 gap-2">
                {projectColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={clsx(
                      'w-10 h-10 rounded-lg border-2 transition-all',
                      formData.color === color
                        ? 'border-gray-800 scale-110'
                        : 'border-gray-200 hover:scale-105'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Project Visibility */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Make this project public
                </span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Public projects can be viewed by anyone with the link
              </p>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.emoji}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {formData.name || 'Project Name'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formData.description || 'Project description...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!formData.name?.trim()}
          >
            Create Project
          </Button>
        </div>
      </form>
    </div>
  )
}