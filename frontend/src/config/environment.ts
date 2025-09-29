export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  wsBaseUrl: import.meta.env.VITE_WS_BASE_URL || 'http://localhost:8080',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export const endpoints = {
  // Auth endpoints
  auth: {
    signup: '/api/auth/signup',
    signin: '/api/auth/signin',
  },
  // User endpoints
  users: {
    getAll: '/api/users',
    getById: (id: string | number) => `/api/users/${id}`,
    update: (id: string | number) => `/api/users/${id}`,
    delete: (id: string | number) => `/api/users/${id}`,
    uploadAvatar: (id: string | number) => `/api/users/${id}/avatar`,
  },
  // Team endpoints
  teams: {
    getAll: '/api/teams',
    create: '/api/teams',
    getById: (id: string | number) => `/api/teams/${id}`,
    update: (id: string | number) => `/api/teams/${id}`,
    delete: (id: string | number) => `/api/teams/${id}`,
    addMember: (teamId: string | number, userId: string | number) => `/api/teams/${teamId}/members/${userId}`,
    removeMember: (teamId: string | number, userId: string | number) => `/api/teams/${teamId}/members/${userId}`,
  },
  // Project endpoints
  projects: {
    getAll: '/api/projects',
    create: '/api/projects',
    getById: (id: string | number) => `/api/projects/${id}`,
    update: (id: string | number) => `/api/projects/${id}`,
    delete: (id: string | number) => `/api/projects/${id}`,
    addMember: (projectId: string | number, userId: string | number) => `/api/projects/${projectId}/members/${userId}`,
    removeMember: (projectId: string | number, userId: string | number) => `/api/projects/${projectId}/members/${userId}`,
  },
  // Chat endpoints
  chat: {
    getRooms: '/api/chat/rooms',
    createRoom: '/api/chat/rooms',
    getMessages: (roomId: string | number) => `/api/chat/rooms/${roomId}/messages`,
    sendMessage: '/api/chat/messages',
  },
  // WebSocket endpoints
  websocket: {
    connect: '/ws',
    sendMessage: '/app/chat.sendMessage',
    subscribe: (roomId: string | number) => `/topic/chat/${roomId}`,
  },
} as const;
