import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Blue Collar Jobs</h1>
            <Button onClick={() => navigate('/logout')}>Logout</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-2">Welcome, {user.full_name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Account Type: {user.user_type === 'job_seeker' ? 'Job Seeker' : 'Employer'}</p>
              
              {user.user_type === 'job_seeker' ? (
                <div className="space-y-3">
                  <Button onClick={() => navigate('/jobs')} className="w-full">Browse Jobs</Button>
                  <Button onClick={() => navigate('/profile')} variant="outline" className="w-full">My Profile</Button>
                  <Button onClick={() => navigate('/applications')} variant="outline" className="w-full">My Applications</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button onClick={() => navigate('/post-job')} className="w-full">Post a Job</Button>
                  <Button onClick={() => navigate('/employer-jobs')} variant="outline" className="w-full">My Jobs</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Blue Collar Jobs Marketplace</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Connect skilled workers with employers in the trades industry
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">For Job Seekers</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Find opportunities in construction, plumbing, electrical work, and more. Showcase your skills and certifications.
              </p>
              <Button onClick={() => navigate('/register')} className="w-full">Get Started</Button>
            </div>
            
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">For Employers</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Post job openings and find qualified workers for your projects. Review applications and manage hiring.
              </p>
              <Button onClick={() => navigate('/register')} className="w-full">Hire Now</Button>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/login')} variant="outline">Already have an account? Login</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
