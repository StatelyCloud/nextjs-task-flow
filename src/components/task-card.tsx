'use client'

import { useState } from 'react'
import { Task } from '@/lib/stately'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, priorityStyles, statusStyles, layoutClasses, animations } from '@/lib/styles'

interface TaskCardProps {
  task: Task
  onStatusChange?: (task: Task, status: Task['status']) => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: bigint) => void
}

export const formatDate = (timestamp?: bigint) => {
  if (!timestamp) return null
  return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const TaskActions = ({ task, onEdit, onDelete }: Pick<TaskCardProps, 'task' | 'onEdit' | 'onDelete'>) => (
  <div className="flex gap-1 ml-2">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onEdit?.(task)}
      className="h-6 w-6 p-0 hover:bg-gray-200"
    >
      ✏️
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onDelete?.(task.id)}
      className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
    >
      🗑️
    </Button>
  </div>
)

const TaskMeta = ({ task }: { task: Task }) => (
  <div className={cn(layoutClasses.flex.between, layoutClasses.flex.gap)}>
    <span>Created {formatDate(task.createdAt)}</span>
    {Number(task.commentCount) > 0 && (
      <span>💬 {Number(task.commentCount)}</span>
    )}
  </div>
)

export function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (onStatusChange && newStatus !== task.status) {
      setIsUpdating(true)
      try {
        onStatusChange(task, newStatus)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  return (
    <Card
      className={cn(
        'border-l-4 card-hover',
        priorityStyles[task.priority as keyof typeof priorityStyles].border,
        priorityStyles[task.priority as keyof typeof priorityStyles].bg,
        isUpdating && animations.loading
      )}
    >
      <CardHeader className="pb-3">
        <div className={layoutClasses.flex.between}>
          <CardTitle className="text-base font-medium text-gray-900 line-clamp-2">
            {task.title}
          </CardTitle>
          <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className={layoutClasses.flex.between}>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-primary-500',
              statusStyles[task.status as keyof typeof statusStyles].bg,
              statusStyles[task.status as keyof typeof statusStyles].text
            )}
            disabled={isUpdating}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          <div className="flex items-center gap-2">
            <Badge variant="priority" priority={task.priority}>
              {task.priority}
            </Badge>
            {task.dueDate > 0 && (
              <Badge className={cn(
                // If due date is past, use danger colors, else primary colors
                new Date(Number(task.dueDate) * 1000) < new Date()
                  ? 'bg-danger-100 text-danger-700'
                  : 'bg-primary-100 text-primary-700'
              )}>
                Due {formatDate(task.dueDate)}
              </Badge>
            )}
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <Badge key={index}>
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className={cn(layoutClasses.text.muted, layoutClasses.flex.between)}>
          <TaskMeta task={task} />
        </div>
      </CardContent>
    </Card>
  )
}