import { useJobs } from '../hooks/useJobs';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function JobsPage() {
  const { jobs, loading } = useJobs();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading jobs...</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Available Jobs</h1>
        <p className="text-gray-600 dark:text-gray-400">No jobs available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Available Jobs</h1>
        <Button onClick={() => navigate('/')}>Back Home</Button>
      </div>
      
      <div className="space-y-4">
        {jobs.map(job => (
          <Card key={job.id} className="p-6 cursor-pointer hover:shadow-lg transition" onClick={() => navigate(`/jobs/${job.id}`)}>
            <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-3">{job.location}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{job.description.substring(0, 150)}...</p>
            
            <div className="flex justify-between items-center">
              <div>
                {job.salary_min && job.salary_max && (
                  <p className="text-lg font-semibold">${job.salary_min} - ${job.salary_max}</p>
                )}
                <p className="text-sm text-gray-500">{job.job_type}</p>
              </div>
              <Button onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}`); }}>View Details</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
