import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  setJobs,
  setSelectedJob,
  addJob,
  updateJob,
  deleteJob,
  setLoading,
  setError,
} from '@/lib/slices/jobSlice';

export function useJobs() {
  const dispatch = useDispatch();
  const { jobs, selectedJob, loading, error } = useSelector(
    (state: RootState) => state.jobs
  );

  const fetchJobs = async (filters?: { type?: string; location?: string }) => {
    try {
      dispatch(setLoading(true));
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/jobs?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch jobs');
      }

      dispatch(setJobs(data));
      return data;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch jobs'));
      throw error;
    }
  };

  const createJob = async (jobData: Omit<App.Job, 'id' | 'employerId' | 'createdAt' | 'updatedAt'>) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job');
      }

      dispatch(addJob(data));
      return data;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to create job'));
      throw error;
    }
  };

  const applyToJob = async (jobId: string) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply to job');
      }

      return data;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to apply to job'));
      throw error;
    }
  };

  const selectJob = (job: App.Job) => {
    dispatch(setSelectedJob(job));
  };

  return {
    jobs,
    selectedJob,
    loading,
    error,
    fetchJobs,
    createJob,
    applyToJob,
    selectJob,
  };
} 