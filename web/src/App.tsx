import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AppLayout } from './layout/AppLayout'
import { ComposePage } from './pages/ComposePage'
import { EntryDetailPage } from './pages/EntryDetailPage'
import { GrowthPage } from './pages/GrowthPage'
import { MePage } from './pages/MePage'
import { NewToyPage } from './pages/NewToyPage'
import { TimelinePage } from './pages/TimelinePage'
import { ToysPage } from './pages/ToysPage'

export default function App() {
  return (
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
            <Route path="*" element={<Navigate to="/timeline" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
