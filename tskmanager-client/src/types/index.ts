// User data returned by the API after successful authentication
export interface User {
  email: string;
  fullName: string;
}

// Response body from /api/auth/login and /api/auth/register
export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  expiresAt: string;
}

// Task entity as returned by the API
export interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt?: string;
  userId: number;
}

// Payload for creating or updating a task
export interface TaskInput {
  title: string;
  description?: string;
  isCompleted?: boolean;
}