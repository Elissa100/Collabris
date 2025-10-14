import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskRequest } from '../../types';
import * as taskService from '../../services/taskService';
import { RootState } from '../store';

interface TaskState {
  tasksByProjectId: Record<string, Task[]>;
  loadingStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TaskState = {
  tasksByProjectId: {},
  loadingStatus: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---

export const fetchTasksForProject = createAsyncThunk(
  'tasks/fetchForProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getTasksForProject(projectId);
      return { projectId, tasks };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewTask = createAsyncThunk(
  'tasks/create',
  async ({ projectId, taskData }: { projectId: string; taskData: TaskRequest }, { rejectWithValue }) => {
    try {
      const newTask = await taskService.createTask(projectId, taskData);
      return { projectId, task: newTask };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateExistingTask = createAsyncThunk(
  'tasks/update',
  async ({ taskId, taskData, projectId }: { taskId: number; taskData: Partial<TaskRequest>, projectId: string }, { rejectWithValue }) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      return { projectId, task: updatedTask };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetching tasks
      .addCase(fetchTasksForProject.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(fetchTasksForProject.fulfilled, (state, action) => {
        state.loadingStatus = 'succeeded';
        state.tasksByProjectId[action.payload.projectId] = action.payload.tasks;
      })
      .addCase(fetchTasksForProject.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.payload as string;
      })
      // Creating a task
      .addCase(createNewTask.fulfilled, (state, action) => {
        const { projectId, task } = action.payload;
        if (!state.tasksByProjectId[projectId]) {
          state.tasksByProjectId[projectId] = [];
        }
        state.tasksByProjectId[projectId].push(task);
      })
      // Updating a task
      .addCase(updateExistingTask.fulfilled, (state, action) => {
        const { projectId, task } = action.payload;
        const tasks = state.tasksByProjectId[projectId];
        if (tasks) {
          const index = tasks.findIndex(t => t.id === task.id);
          if (index !== -1) {
            tasks[index] = task;
          }
        }
      });
  },
});

// --- SELECTORS ---
export const selectTasksForProject = (projectId: string) => (state: RootState) =>
  state.tasks.tasksByProjectId[projectId] || [];

export const selectTasksLoadingStatus = (state: RootState) => state.tasks.loadingStatus;

export default taskSlice.reducer;