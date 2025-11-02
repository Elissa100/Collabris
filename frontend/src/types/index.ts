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

// --- NOTIFICATION TYPES ---
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

// --- ACTIVITY LOG TYPES ---
export interface ActivityLog {
    id: number;
    actor: User;
    action: string;
    entityType: string;
    entityId: number;
    details: string;
    timestamp: string; // ISO datetime string
}

// --- FILE METADATA TYPE ---
export interface FileMetadata {
    id: number;
    fileName: string;
    fileDownloadUri: string;
    fileType: string;
    size: number;
}

// --- TASK & CHAT TYPES ---

// NEW: TaskPriority Enum
export enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
  priority: TaskPriority; // <-- UPDATED
  dueDate?: string;
  projectId: number;
  assignee?: User;
  creator: User;
  attachments: FileMetadata[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskRequest {
  title: string;
  description?: string;
  status?: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
  priority?: TaskPriority; // <-- ADDED
  dueDate?: string;
  assigneeId?: number | null;
  attachmentIds?: number[];
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

// --- OTHER TYPES ---
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

export interface ChatMessageRequest {
  content: string;
  messageType: ChatMessage['messageType'];
  chatRoomId: number;
}

export interface ChatRoomRequest {
  name: string;
  description?: string;
  type: ChatRoom['type'];
  memberIds: number[];
}

export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

export type ThemeMode = 'light' | 'dark' | 'system';

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

export interface DashboardStats {
  totalUsers?: number;
  totalTeams?: number;
  totalProjects?: number;
}

export interface DashboardActivity {
  id: number;
  type: 'USER_JOINED' | 'PROJECT_CREATED' | 'TEAM_CREATED' | 'MESSAGE_SENT' | 'PROJECT_COMPLETED';
  description: string;
  user?: User;
  entity?: string;
  entityId?: number;
  timestamp: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'text' | 'outlined' | 'contained';
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}