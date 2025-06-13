import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface JobState {
  jobs: App.Job[];
  selectedJob: App.Job | null;
  applications: App.JobApplication[];
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  selectedJob: null,
  applications: [],
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<App.Job[]>) => {
      state.jobs = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedJob: (state, action: PayloadAction<App.Job>) => {
      state.selectedJob = action.payload;
    },
    setApplications: (state, action: PayloadAction<App.JobApplication[]>) => {
      state.applications = action.payload;
    },
    addJob: (state, action: PayloadAction<App.Job>) => {
      state.jobs.push(action.payload);
    },
    updateJob: (state, action: PayloadAction<App.Job>) => {
      const index = state.jobs.findIndex(job => job.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter(job => job.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setJobs,
  setSelectedJob,
  setApplications,
  addJob,
  updateJob,
  deleteJob,
  setLoading,
  setError,
} = jobSlice.actions;

export default jobSlice.reducer; 