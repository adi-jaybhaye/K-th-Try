import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { TopicDetailPage } from './pages/TopicDetailPage';
import { TimelinePage } from './pages/TimelinePage';
import { PracticePage } from './pages/PracticePage';
import { RevisionPage } from './pages/RevisionPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { PlacementPage } from './pages/PlacementPage';
import { MockInterviewPage } from './pages/MockInterviewPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';

import { LanguageProvider } from './services/LanguageContext';

export function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
      <Routes>
        {/* Public Landing & Onboarding */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />

        {/* Authenticated / Guest Workspace Shell */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/roadmap/:topicSlug" element={<TopicDetailPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/revision" element={<RevisionPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/placement" element={<PlacementPage />} />
          <Route path="/mock-interview" element={<MockInterviewPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </LanguageProvider>
  );
}

export default App;
