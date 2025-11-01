// --- USER & AUTH TYPES ---
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  roles: string[];
  profilePicture?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string[];
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

// --- PROJECT & TEAM TYPES ---

export interface Project {
  id: number;
  name: string;
  description: string;
  owner: User;
  members: User[];
  createdAt: string;
}

export interface ProjectRequest {
  name: string;
  description?: string;
}

export interface Team {
    id: number;
    name: string;
    description: string;
    owner: User;
    members: User[];
    createdAt: string;
}

export interface TeamRequest {
  name: string;
  description?: string;
}

// --- NOTIFICATION TYPES (NEW) ---
export enum NotificationType {
    TASK_ASSIGNED = "TASK_ASSIGNED",
    USER_MENTION = "USER_MENTION",
    PROJECT_UPDATE = "PROJECT_UPDATE",
    TEAM_INVITE = "TEAM_INVITE"
}

export interface Notification {
    id: number;
    type: NotificationType;
    message: string;
    isRead: boolean;
    entityType?: string;
    entityId?: number;
    sourceUser?: User;
    createdAt: string; // ISO datetime string
}


// --- ALL OTHER TYPES BELOW THIS LINE ARE FOR FUTURE USE ---

// Chat types
export interface ChatRoom {
  id: number;
  name: string;
  description?: string;
  type: 'DIRECT' | 'GROUP' | 'TEAM' | 'PROJECT';
  createdAt: string;
  updatedAt: string;
  members: User[];
  lastMessage?: ChatMessage;
}

export interface ChatMessage {
  id: number;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
  timestamp: string;
  sender: User;
  chatRoom: ChatRoom;
  edited?: boolean;
  editedAt?: string;
}


export interface ChatMessageRequest {
  content: string;
  messageType: ChatMessage['messageType'];
  chatRoomId: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
  dueDate?: string; // Will be an ISO date string like "2025-12-31"
  projectId: number;
  assignee?: User; // Assignee can be null
  creator: User;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

export interface TaskRequest {
  title: string;
  description?: string;
  status?: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
  dueDate?: string;
  assigneeId?: number | null;
}

export interface ChatRoomRequest {
  name: string;
  description?: string;
  type: ChatRoom['type'];
  memberIds: number[];
}

// UI State types
export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

// Dashboard types
export interface DashboardStats {
  totalUsers?: number;
  totalTeams?: number;
  totalProjects?: number;
  activeProjects?: number;
  completedProjects?: number;
  totalMessages?: number;
  userGrowth?: number;
  projectProgress?: {
    completed: number;
    inProgress: number;
    planning: number;
    onHold: number;
  };
  recentActivities?: Activity[];
}

export interface Activity {
  id: number;
  type: 'USER_JOINED' | 'PROJECT_CREATED' | 'TEAM_CREATED' | 'MESSAGE_SENT' | 'PROJECT_COMPLETED';
  description: string;
  user?: User;
  entity?: string;
  entityId?: number;
  timestamp: string;
}

// Form types
export interface FormErrors {
  [key: string]: string | undefined;
}

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
}

// Notification types
// --- NOTE: This is a duplicate and can be removed ---
// The Notification interface is already defined above.

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'text' | 'outlined' | 'contained';
}

// WebSocket types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}