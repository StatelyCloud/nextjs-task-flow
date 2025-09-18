import { NextRequest, NextResponse } from 'next/server'
import { updateTask, deleteTask } from '@/lib/stately'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = BigInt(params.id)
    const body = await request.json()
    const { projectId, ...updates } = body
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    const updatedTask = await updateTask({
      id: taskId,
      projectId: BigInt(projectId),
      ...updates,
      updatedAt: BigInt(Math.floor(Date.now() / 1000)),
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Failed to update task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = BigInt(params.id)
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    await deleteTask(BigInt(projectId), taskId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}