import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AppLayout } from './layout/AppLayout'
import { ComposePage } from './pages/ComposePage'
import { EntryDetailPage } from './pages/EntryDetailPage'
import { GrowthPage } from './pages/GrowthPage'
import { MePage } from './pages/MePage'
import { NewToyPage } from './pages/NewToyPage'
import { SettingsPage } from './pages/SettingsPage'
import { TimelinePage } from './pages/TimelinePage'
import { ToysPage } from './pages/ToysPage'
import { ThemeProvider } from './theme/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/timeline" replace />} />
              <Route path="timeline" element={<TimelinePage />} />
              <Route path="growth" element={<GrowthPage />} />
              <Route path="compose" element={<ComposePage />} />
              <Route path="toys" element={<ToysPage />} />
              <Route path="toys/new" element={<NewToyPage />} />
              <Route path="entries/:id" element={<EntryDetailPage />} />
              <Route path="me" element={<MePage />} />
              <Route path="me/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/timeline" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}
