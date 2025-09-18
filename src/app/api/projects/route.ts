import { NextRequest, NextResponse } from 'next/server'
import { getUserProjects, createProject } from '@/lib/stately'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const projects = await getUserProjects(BigInt(userId))
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, color, emoji, ownerId, isPublic = false } = body

    if (!name || !ownerId) {
      return NextResponse.json({ error: 'Name and owner ID are required' }, { status: 400 })
    }

    const project = await createProject({
      name,
      description: description || '',
      color: color || '#3b82f6',
      emoji: emoji || '📋',
      ownerId,
      isActive: true,
      isPublic,
      taskCount: BigInt(0),
      completedTaskCount: BigInt(0),
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Failed to create project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}