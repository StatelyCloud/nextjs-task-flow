'use server'

import { createClient, type DatabaseClient } from '../../generated'
import type { Task, Project, User, Comment, ProjectMember, Role, Theme } from '../../generated'
import { nodeTransport } from '@stately-cloud/client/node';

// Initialize StatelyDB client
const client  = createClient({
  storeId: BigInt(process.env.STATELY_STORE_ID as string), // Store ID
  transport: nodeTransport,
  region: "us-east-1", // AWS region
});

const mapStatus = (lhs: Partial<Task>, rhs: Partial<Task>): "unchanged" | "complete" | "incomplete" => {
  if (lhs.status === rhs.status) return "unchanged"
  if (lhs.status === "complete" || lhs.status === "archived") {
    return "incomplete"
  }
  if (rhs.status === "complete" || rhs.status === "archived") {
    return "complete"
  }
  return "unchanged"
}

export type { Task, Project, User, Comment, ProjectMember, Role, Theme, DatabaseClient }

// Task functions
export async function createTask(task: Omit<Task, '$typeName' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
  const res = await client.transaction(async (tx) => {
    const project = await tx.get("Project", `/project-${task.projectId}`)
    if (!project) throw new Error('Project not found')
    project.taskCount += BigInt(1)
    await tx.put(project)
    await tx.put(client.create("Task", { ...task as Task }))
  })
  return res.puts[1] as Task
}

export async function getTask(projectId: bigint, taskId: bigint): Promise<Task | undefined> {
  return await client.get("Task", `/project-${projectId}/task-${taskId}`)
}

export async function updateTask(updates: Partial<Task>): Promise<Task> {
  const res = await client.transaction(async (tx) => {
    const existingTask = await tx.get("Task", `/project-${updates.projectId}/task-${updates.id}`)
    if (!existingTask) throw new Error('Task not found')

    const updatedTask = { ...existingTask, ...updates }
    await tx.put(updatedTask)
    
    const statusChange = mapStatus(existingTask, updates)
    if (statusChange != "unchanged") {
      const project = await tx.get("Project", `/project-${existingTask.projectId}`)
      if (!project) throw new Error('Project not found')
      project.completedTaskCount += statusChange === "complete" ? BigInt(1) : BigInt(-1)
      await tx.put(project)
    }
  })
  return res.puts[0] as Task
}

export async function deleteTask(projectId: bigint, taskId: bigint): Promise<void> {
  await client.transaction(async (tx) => {
    const project = await tx.get("Project", `/project-${projectId}`)
    if (!project) throw new Error('Project not found')
    project.taskCount -= BigInt(1)
    await tx.put(project)
    const keyPath = `/project-${projectId}/task-${taskId}`
    await tx.del(keyPath)
  })
  return
}

export async function getProjectTasks(projectId: bigint): Promise<Task[]> {
  const keyPathPrefix = `/project-${projectId}/task-`
  const iter = client.beginList(keyPathPrefix)

  const res = [];
  for await (const item of iter) {
    if (client.isType(item, "Task")) {
      res.push(item);
    }
  }
  return res;
}

// Project functions
export async function createProject(project: Omit<Project, '$typeName' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  return await client.put(client.create("Project", { ...project as Project }))
}

export async function getProject(projectId: bigint): Promise<Project | undefined> {
  const keyPath = `/project-${projectId}`
  return await client.get("Project", keyPath)
}

export async function updateProject(updates: Partial<Project>): Promise<Project> {
  const res = await client.transaction(async (tx) => {
    const existingProject = await tx.get("Project", `/project-${updates.id}`)
    if (!existingProject) throw new Error('Project not found')

    const updatedProject = { ...existingProject, ...updates }
    await tx.put(updatedProject)
  })
  return res.puts[0] as Project
}

export async function deleteProject(projectId: bigint): Promise<void> {
  const keyPath = `/project-${projectId}`
  return await client.del(keyPath)
}

export async function getUserProjects(userId: bigint): Promise<Project[]> {
  // This would need to be implemented based on your access patterns
  // For now, we'll scan all projects and filter
  const iter = client.beginList(`/user-${userId}/project`)

  const projects: Project[] = [];
  for await (const item of iter) {
    if (client.isType(item, "Project")) {
      projects.push(item);
    }
  }
  return projects.filter((project: Project) => project.ownerId === userId)
}

// User functions
export async function createUser(user: Omit<User, 'createdAt' | 'lastActiveAt'>): Promise<User> {
  return await client.put(user as User)
}

export async function getUser(userId: bigint): Promise<User | undefined> {
  return await client.get("User", `/user-${userId}`)
}

export async function updateUser(updates: Partial<User>): Promise<User> {
  const res = await client.transaction(async (tx) => {
    const existingUser = await tx.get("User", `/user-${updates.id}`)
    if (!existingUser) throw new Error('User not found')

    const updatedUser = { ...existingUser, ...updates }
    await tx.put(updatedUser)
  })
  return res.puts[0] as User
}

export async function updateLastActive(userId: bigint) {
  return await client.transaction( async (tx) => {
    const user = await tx.get("User",  `/user-${userId}`) // Ensure user exists
    if (!user) throw new Error('User not found')

    user.lastActiveAt = BigInt(Math.floor(Date.now() / 1000))
    await tx.put(user)
  })
}

// Comment functions
export async function createComment(comment: Omit<Comment, '$typeName' | 'id' | 'createdAt' | 'updatedAt'>) {
  return await client.put(client.create("Comment", { ...comment as Comment }))
}

export async function getTaskComments(projectId: string, taskId: string) {
  const iter = client.beginList(`/project-${projectId}/task-${taskId}/comment-`)
  const comments: Comment[] = []
  for await (const item of iter) {
    if (client.isType(item, "Comment")) {
      comments.push(item)
    }
  }
  return comments
}

export async function updateComment(updates: Partial<Comment>) {
  const res = await client.transaction(async (tx) => {
    const existingComment = await tx.get("Comment", `/project-${updates.projectId}/task-${updates.taskId}/comment-${updates.id}`)
    if (!existingComment) throw new Error('Comment not found')

    const updatedComment = { ...existingComment, ...updates }
    await tx.put(updatedComment)
  })
  return res.puts[0] as Comment
}

export async function deleteComment(projectId: string, taskId: string, commentId: string) {
  const keyPath = `/project-${projectId}/task-${taskId}/comment-${commentId}`
  return await client.del(keyPath)
}