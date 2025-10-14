import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage } from '../../types';
import { getProjectMessages } from '../../services/chatService';
import { RootState } from '../store';

interface ChatState {
  messagesByProjectId: Record<string, ChatMessage[]>; // e.g., { "1": [msg1, msg2], "2": [msg3] }
  loadingStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ChatState = {
  messagesByProjectId: {},
  loadingStatus: 'idle',
  error: null,
};

// Async thunk to fetch messages for a project
export const fetchMessagesForProject = createAsyncThunk(
  'chat/fetchMessagesForProject',
  async (projectId: string, { getState, rejectWithValue }) => {
    // Optimization: Don't re-fetch if messages for this project are already loaded
    const state = getState() as RootState;
    if (state.chat.messagesByProjectId[projectId]) {
      return { projectId, messages: state.chat.messagesByProjectId[projectId] };
    }

    try {
      const messages = await getProjectMessages(projectId);
      return { projectId, messages };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Reducer to add a new message (from WebSocket or optimistic update)
    addMessage: (state, action: PayloadAction<{ projectId: string; message: ChatMessage }>) => {
      const { projectId, message } = action.payload;
      const projectMessages = state.messagesByProjectId[projectId] || [];
      
      // Avoid adding duplicate messages
      if (!projectMessages.some(m => m.id === message.id)) {
        projectMessages.push(message);
        state.messagesByProjectId[projectId] = projectMessages;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesForProject.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(fetchMessagesForProject.fulfilled, (state, action) => {
        state.loadingStatus = 'succeeded';
        state.messagesByProjectId[action.payload.projectId] = action.payload.messages;
      })
      .addCase(fetchMessagesForProject.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { addMessage } = chatSlice.actions;

// Selector to get messages for a specific project
export const selectMessagesForProject = (projectId: string) => (state: RootState) => 
  state.chat.messagesByProjectId[projectId] || [];

export const selectChatLoadingStatus = (state: RootState) => state.chat.loadingStatus;

export default chatSlice.reducer;