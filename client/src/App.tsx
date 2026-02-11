import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { PostJobPage } from './pages/PostJobPage';
import { EmployerJobsPage } from './pages/EmployerJobsPage';
import { JobApplicationsPage } from './pages/JobApplicationsPage';
import { LogoutPage } from './pages/LogoutPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/post-job" element={<PostJobPage />} />
        <Route path="/employer-jobs" element={<EmployerJobsPage />} />
        <Route path="/job-applications/:jobId" element={<JobApplicationsPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
