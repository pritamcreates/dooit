import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import DashboardLayout from './layouts/DashboardLayout';
import MyTasksView from './views/MyTasksView';
import InboxView from './views/InboxView';
import KanbanView from './views/KanbanView';
import ReportingView from './views/ReportingView';
import PortfoliosView from './views/PortfoliosView';
import GoalsView from './views/GoalsView';
import TeamView from './views/TeamView';
import DocsView from './views/DocsView';
import CalendarView from './views/CalendarView';
import PeopleView from './views/PeopleView';
import AnalyticsView from './views/AnalyticsView';
// SupportView import removed
import DashboardView from './views/DashboardView';
import SettingsView from './views/SettingsView';

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          
          {/* Dashboard Routes */}
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<DashboardView />} />
            <Route path="tasks" element={<MyTasksView />} />
            <Route path="inbox" element={<InboxView />} />
            <Route path="projects" element={<KanbanView />} />
            <Route path="reporting" element={<ReportingView />} />
            <Route path="portfolios" element={<PortfoliosView />} />
            <Route path="goals" element={<GoalsView />} />
            <Route path="team" element={<TeamView />} />
            <Route path="docs" element={<DocsView />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="people" element={<PeopleView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            // Support route removed
            <Route path="settings" element={<SettingsView />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
