import { useState, useEffect } from 'react';

export interface Job {
  id: number;
  employer_id: number;
  title: string;
  description: string;
  job_type: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  required_certifications: string | null;
  posted_at: string;
  created_at: string;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const response = await fetch('/api/jobs');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }

  async function createJob(jobData: Omit<Job, 'id' | 'employer_id' | 'posted_at' | 'created_at'>) {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      if (!response.ok) throw new Error('Failed to create job');
      const data = await response.json();
      setJobs([data, ...jobs]);
      return data;
    } catch (err) {
      console.error('Failed to create job:', err);
      throw err;
    }
  }

  async function getJobById(id: number) {
    try {
      const response = await fetch(`/api/jobs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch job');
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch job:', err);
      throw err;
    }
  }

  return { jobs, loading, error, fetchJobs, createJob, getJobById };
}
