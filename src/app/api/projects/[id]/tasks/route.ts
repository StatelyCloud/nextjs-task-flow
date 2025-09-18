import { NextRequest, NextResponse } from 'next/server'
import { getProjectTasks, createTask } from '@/lib/stately'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = BigInt(params.id)
    const tasks = await getProjectTasks(projectId)
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = BigInt(params.id)
    const body = await request.json()
    const { title, description, status = 'todo', priority = 'medium', assigneeId, creatorId, tags = [], dueDate } = body

    if (!title || !creatorId) {
      return NextResponse.json({ error: 'Title and creator ID are required' }, { status: 400 })
    }

    const task = await createTask({
      projectId,
      title,
      description: description || '',
      status,
      priority,
      assigneeId: BigInt(assigneeId || creatorId),
      creatorId: BigInt(creatorId),
      tags,
      dueDate: dueDate ? BigInt(dueDate) : BigInt(0),
      isActive: true,
      order: BigInt(Date.now()),
      commentCount: BigInt(0),
      completedAt: status === 'completed' ? BigInt(Math.floor(Date.now() / 1000)) : BigInt(0),
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Failed to create task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}