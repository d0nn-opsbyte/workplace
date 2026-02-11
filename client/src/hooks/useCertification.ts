import { useState, useEffect } from 'react';

export interface Certification {
  id: number;
  job_seeker_id: number;
  certification_name: string;
  issuing_body: string;
  issue_date: string | null;
  expiry_date: string | null;
  certification_number: string | null;
  created_at: string;
}

export function useCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

  async function fetchCertifications() {
    try {
      const response = await fetch('/api/certifications');
      if (!response.ok) throw new Error('Failed to fetch certifications');
      const data = await response.json();
      setCertifications(data);
    } catch (err) {
      console.error('Failed to fetch certifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch certifications');
    } finally {
      setLoading(false);
    }
  }

  async function addCertification(certData: Omit<Certification, 'id' | 'job_seeker_id' | 'created_at'>) {
    try {
      const response = await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certData)
      });
      if (!response.ok) throw new Error('Failed to add certification');
      const data = await response.json();
      setCertifications([data, ...certifications]);
      return data;
    } catch (err) {
      console.error('Failed to add certification:', err);
      throw err;
    }
  }

  async function deleteCertification(id: number) {
    try {
      const response = await fetch(`/api/certifications/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete certification');
      setCertifications(certifications.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete certification:', err);
      throw err;
    }
  }

  return { certifications, loading, error, fetchCertifications, addCertification, deleteCertification };
}
