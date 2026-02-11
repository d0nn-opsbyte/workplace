import { useAuth } from '../hooks/useAuth';
import { useCertifications } from '../hooks/useCertification';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const { user } = useAuth();
  const { certifications, addCertification, deleteCertification } = useCertifications();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    certification_name: '',
    issuing_body: '',
    issue_date: '',
    expiry_date: '',
    certification_number: ''
  });
  const [adding, setAdding] = useState(false);

  if (!user || user.user_type !== 'job_seeker') {
    navigate('/');
    return null;
  }

  async function handleAddCertification(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    try {
      await addCertification({
        certification_name: formData.certification_name,
        issuing_body: formData.issuing_body,
        issue_date: formData.issue_date || null,
        expiry_date: formData.expiry_date || null,
        certification_number: formData.certification_number || null
      });
      setFormData({
        certification_name: '',
        issuing_body: '',
        issue_date: '',
        expiry_date: '',
        certification_number: ''
      });
      setShowForm(false);
    } catch (err) {
      alert('Failed to add certification');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this certification?')) {
      try {
        await deleteCertification(id);
      } catch (err) {
        alert('Failed to delete certification');
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => navigate('/')} variant="outline" className="mb-6">Back Home</Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-8 mb-8">
            <h1 className="text-4xl font-bold mb-2">{user.full_name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>
          </Card>
          
          <Card className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Certifications & Qualifications</h2>
              <Button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Add Certification'}
              </Button>
            </div>
            
            {showForm && (
              <form onSubmit={handleAddCertification} className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <h3 className="text-lg font-bold mb-4">Add New Certification</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cert_name">Certification Name *</Label>
                    <Input
                      id="cert_name"
                      value={formData.certification_name}
                      onChange={(e) => setFormData({...formData, certification_name: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="issuer">Issuing Body *</Label>
                    <Input
                      id="issuer"
                      value={formData.issuing_body}
                      onChange={(e) => setFormData({...formData, issuing_body: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cert_number">Certification Number</Label>
                    <Input
                      id="cert_number"
                      value={formData.certification_number}
                      onChange={(e) => setFormData({...formData, certification_number: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="issue_date">Issue Date</Label>
                      <Input
                        id="issue_date"
                        type="date"
                        value={formData.issue_date}
                        onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="expiry_date">Expiry Date</Label>
                      <Input
                        id="expiry_date"
                        type="date"
                        value={formData.expiry_date}
                        onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={adding} className="w-full">
                    {adding ? 'Adding...' : 'Add Certification'}
                  </Button>
                </div>
              </form>
            )}
            
            {certifications.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No certifications added yet.</p>
            ) : (
              <div className="space-y-4">
                {certifications.map((cert: any) => (
                  <Card key={cert.id} className="p-4 border-l-4 border-l-blue-500">
                    <h3 className="text-lg font-bold">{cert.certification_name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Issued by: {cert.issuing_body}</p>
                    {cert.certification_number && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Cert #: {cert.certification_number}</p>
                    )}
                    {cert.issue_date && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Issued: {cert.issue_date}</p>
                    )}
                    {cert.expiry_date && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expires: {cert.expiry_date}</p>
                    )}
                    <Button onClick={() => handleDelete(cert.id)} variant="destructive" className="mt-3 h-8 px-3 text-xs">Delete</Button>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
