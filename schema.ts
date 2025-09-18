import {
  arrayOf,
  bool,
  enumType,
  itemType,
  string,
  timestampSeconds,
  uint,
} from "@stately-cloud/schema";

/**
 * Task item type definition for the task management application.
 * Represents a single task with status tracking and collaboration features.
 */
itemType("Task", {
  keyPath: "/project-:projectId/task-:id",
  fields: {
    /** Unique identifier for the task (auto-generated sequence) */
    id: { type: uint, required: false, initialValue: "sequence" },
    /** ID of the project that owns this task */
    projectId: { type: uint },
    /** Task title or name */
    title: { type: string },
    /** Detailed description of the task */
    description: { type: string },
    /** Current status of the task */
    status: { type: string }, // todo, in-progress, completed, archived
    /** Priority level of the task */
    priority: { type: string }, // low, medium, high, urgent
    /** ID of the user assigned to this task */
    assigneeId: { type: uint },
    /** ID of the user who created this task */
    creatorId: { type: uint },
    /** Due date timestamp for the task */
    dueDate: { type: timestampSeconds, required: false },
    /** Tags associated with the task (comma-separated) */
    tags: { type: arrayOf(string), required: false },
    /** Whether the task is currently active/visible */
    isActive: { type: bool },
    /** Display order position for the task */
    order: { type: uint },
    /** Number of comments on this task */
    commentCount: { type: uint, required: false },
    /** Timestamp when the task was created */
    createdAt: {
      type: timestampSeconds,
      fromMetadata: "createdAtTime",
    },
    /** Timestamp when the task was last updated */
    updatedAt: {
      type: timestampSeconds,
      fromMetadata: "lastModifiedAtTime",
    },
    /** Timestamp when the task was completed */
    completedAt: { type: timestampSeconds, required: false },
  },
});

/**
 * Project item type definition for organizing tasks.
 * Represents a project container that holds multiple tasks.
 */
itemType("Project", {
  keyPath: [ "/project-:id", "/user-:ownerId/project-:id" ],
  fields: {
    /** Unique identifier for the project */
    id: { type: uint, initialValue: "rand53" },
    /** Project name or title */
    name: { type: string },
    /** Project description */
    description: { type: string },
    /** Project color theme for UI */
    color: { type: string },
    /** Project emoji or icon */
    emoji: { type: string },
    /** ID of the user who owns this project */
    ownerId: { type: uint },
    /** Whether the project is currently active */
    isActive: { type: bool },
    /** Whether the project is public or private */
    isPublic: { type: bool },
    /** Timestamp when the project was created */
    createdAt: {
      type: timestampSeconds,
      fromMetadata: "createdAtTime",
    },
    /** Timestamp when the project was last updated */
    updatedAt: {
      type: timestampSeconds,
      fromMetadata: "lastModifiedAtTime",
    },
    /** Total number of tasks in this project */
    taskCount: { type: uint, required: false },
    /** Number of completed tasks in this project */
    completedTaskCount: { type: uint, required: false },
  },
});

const Theme = enumType("Theme", {
  LIGHT: 1,
  DARK: 2,
  SYSTEM: 3,
});

/**
 * User item type definition for user management.
 * Represents a user in the task management system.
 */
itemType("User", {
  keyPath: "/user-:id",
  fields: {
    /** Unique identifier for the user */
    id: { type: uint, initialValue: "rand53" },
    /** User's email address */
    email: { type: string },
    /** User's display name */
    name: { type: string },
    /** User's avatar URL or emoji */
    avatar: { type: string },
    /** Whether the user account is active */
    isActive: { type: bool, required: false },
    /** User's timezone */
    timezone: { type: string },
    /** User's preferred theme */
    theme: { type: Theme },
    /** Timestamp when the user was created */
    createdAt: {
      type: timestampSeconds,
      required: false,
      fromMetadata: "createdAtTime",
    },
    /** Timestamp when the user was last active */
    lastActiveAt: { type: timestampSeconds, required: false },
  },
});

/**
 * Comment item type definition for task discussions.
 * Represents a comment on a task for collaboration.
 */
itemType("Comment", {
  keyPath: "/project-:projectId/task-:taskId/comment-:id",
  fields: {
    /** Unique identifier for the comment (auto-generated sequence) */
    id: { type: uint, required: false, initialValue: "sequence" },
    /** ID of the project this comment belongs to */
    projectId: { type: uint },
    /** ID of the task this comment is on */
    taskId: { type: uint },
    /** ID of the user who wrote this comment */
    authorId: { type: uint },
    /** Content of the comment */
    content: { type: string },
    /** Whether the comment is active/visible */
    isActive: { type: bool, required: false },
    /** Timestamp when the comment was created */
    createdAt: {
      type: timestampSeconds,
      required: false,
      fromMetadata: "createdAtTime",
    },
    /** Timestamp when the comment was last updated */
    updatedAt: {
      type: timestampSeconds,
      required: false,
      fromMetadata: "lastModifiedAtTime",
    },
  },
});

const Role = enumType("Role", {
  OWNER: 1,
  ADMIN: 2,
  MEMBER: 3,
  VIEWER: 4,
});

/**
 * ProjectMember item type definition for project access control.
 * Represents a user's membership and role in a project.
 */
itemType("ProjectMember", {
  keyPath: "/project-:projectId/member-:userId",
  fields: {
    /** ID of the project */
    projectId: { type: uint },
    /** ID of the user */
    userId: { type: uint },
    /** Role of the user in this project */
    role: { type: Role },
    /** Whether the membership is active */
    isActive: { type: bool, required: false },
    /** Timestamp when the user joined the project */
    joinedAt: {
      type: timestampSeconds,
      required: false,
      fromMetadata: "createdAtTime",
    },
  },
});