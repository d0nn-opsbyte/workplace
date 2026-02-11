import { useAuth } from '../hooks/useAuth';
import { useJobs } from '../hooks/useJobs';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function PostJobPage() {
  const { user } = useAuth();
  const { createJob } = useJobs();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    job_type: '',
    location: '',
    salary_min: '',
    salary_max: '',
    required_certifications: ''
  });

  if (!user || user.user_type !== 'employer') {
    navigate('/');
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createJob({
        title: formData.title,
        description: formData.description,
        job_type: formData.job_type,
        location: formData.location,
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        required_certifications: formData.required_certifications || null
      });
      alert('Job posted successfully!');
      navigate('/employer-jobs');
    } catch (err) {
      alert('Failed to post job');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => navigate('/')} variant="outline" className="mb-6">Back Home</Button>
      
      <Card className="p-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Post a New Job</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Job Description *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={6}
              className="mt-1 w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
          
          <div>
            <Label htmlFor="job_type">Job Type *</Label>
            <Input
              id="job_type"
              placeholder="e.g., Full-time, Part-time, Contract"
              value={formData.job_type}
              onChange={(e) => setFormData({...formData, job_type: e.target.value})}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salary_min">Minimum Salary</Label>
              <Input
                id="salary_min"
                type="number"
                value={formData.salary_min}
                onChange={(e) => setFormData({...formData, salary_min: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="salary_max">Maximum Salary</Label>
              <Input
                id="salary_max"
                type="number"
                value={formData.salary_max}
                onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="certifications">Required Certifications</Label>
            <textarea
              id="certifications"
              value={formData.required_certifications}
              onChange={(e) => setFormData({...formData, required_certifications: e.target.value})}
              rows={3}
              placeholder="List any required certifications or licenses"
              className="mt-1 w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Posting...' : 'Post Job'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
