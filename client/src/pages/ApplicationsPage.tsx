import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: number;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_at: string;
  title: string;
  location: string;
}

export function ApplicationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.user_type !== 'job_seeker') {
      navigate('/');
      return;
    }
    
    async function fetchApplications() {
      try {
        const response = await fetch('/api/applications/seeker');
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [user, navigate]);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  const statusColors = {
    pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
    reviewed: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
    accepted: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
    rejected: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Applications</h1>
        <Button onClick={() => navigate('/')}>Back Home</Button>
      </div>

      {applications.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No applications yet.</p>
          <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <Card key={app.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{app.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{app.location}</p>
                  <p className="text-sm text-gray-500 mt-2">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[app.status]}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
