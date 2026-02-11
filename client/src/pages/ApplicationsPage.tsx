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

  if (loading) return <div className="loading">Loading...</div>;

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">My Applications</h1>
        <Button onClick={() => navigate('/')}>Back Home</Button>
      </div>

      {applications.length === 0 ? (
        <Card className="empty-card">
          <p>No applications yet.</p>
          <Button onClick={() => navigate('/jobs')}>
            Browse Jobs
          </Button>
        </Card>
      ) : (
        <>
          {applications.map(app => (
            <Card key={app.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h2 className="job-title">{app.title}</h2>
                  <p className="location">{app.location}</p>
                  <p className="applied-date">
                    Applied: {new Date(app.applied_at).toLocaleDateString()}
                  </p>
                </div>

                <div className={`status ${app.status}`}>
                  {capitalize(app.status)}
                </div>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}


