import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import type { Job } from '../hooks/useJobs';

export function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById } = useJobs();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    async function load() {
      if (id) {
        const data = await getJobById(parseInt(id));
        setJob(data);
      }
      setLoading(false);
    }
    load();
  }, [id, getJobById]);

  async function handleApply() {
    if (!user) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: job?.id })
      });
      
      if (response.ok) {
        alert('Applied successfully!');
        navigate('/applications');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to apply');
      }
    } catch (err) {
      alert('Failed to apply');
    } finally {
      setApplying(false);
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!job) return <div className="container mx-auto px-4 py-8">Job not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => navigate('/jobs')} variant="outline" className="mb-6">Back to Jobs</Button>
      
      <Card className="p-8">
        <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{job.location}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Job Type</p>
            <p className="text-lg font-semibold">{job.job_type}</p>
          </div>
          {job.salary_min && job.salary_max && (
            <div>
              <p className="text-sm text-gray-500">Salary Range</p>
              <p className="text-lg font-semibold">${job.salary_min} - ${job.salary_max}</p>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Description</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{job.description}</p>
        </div>
        
        {job.required_certifications && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Required Certifications</h2>
            <p className="text-gray-700 dark:text-gray-300">{job.required_certifications}</p>
          </div>
        )}
        
        {user && user.user_type === 'job_seeker' && (
          <Button onClick={handleApply} disabled={applying} className="w-full">
            {applying ? 'Applying...' : 'Apply for this Job'}
          </Button>
        )}
        {user && user.user_type !== 'job_seeker' && (
          <p className="text-gray-600 dark:text-gray-400">Only job seekers can apply for jobs.</p>
        )}
        {!user && (
          <Button onClick={() => navigate('/login')} className="w-full">Login to Apply</Button>
        )}
      </Card>
    </div>
  );
}
