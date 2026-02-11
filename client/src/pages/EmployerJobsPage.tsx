import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useJobs } from '../hooks/useJobs';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

interface JobWithApplicants {
  id: number;
  title: string;
  location: string;
  description: string;
  applicant_count?: number;
}

export function EmployerJobsPage() {
  const { user } = useAuth();
  const { jobs } = useJobs();
  const navigate = useNavigate();
  const [employerJobs, setEmployerJobs] = useState<JobWithApplicants[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.user_type !== 'employer') {
      navigate('/');
      return;
    }

    // Filter jobs posted by this employer
    // In a real app, we'd have a dedicated endpoint for employer jobs
    setEmployerJobs(jobs);
    setLoading(false);
  }, [jobs, user, navigate]);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Jobs</h1>
        <div className="space-x-2">
          <Button onClick={() => navigate('/post-job')}>Post New Job</Button>
          <Button onClick={() => navigate('/')} variant="outline">Back Home</Button>
        </div>
      </div>

      {employerJobs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't posted any jobs yet.</p>
          <Button onClick={() => navigate('/post-job')}>Post Your First Job</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {employerJobs.map(job => (
            <Card key={job.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{job.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{job.location}</p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">{job.description.substring(0, 100)}...</p>
                </div>
                <Button onClick={() => navigate(`/job-applications/${job.id}`)}>
                  View Applications
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
