import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ToastProvider from './components/ToastProvider.jsx'
import ExplorePage from './pages/ExplorePage.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import SeriesDetailPage from './pages/SeriesDetailPage.jsx'
import SeriesEditPage from './pages/SeriesEditPage.jsx'
import SeriesNewPage from './pages/SeriesNewPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/series" element={<ExplorePage />} />
            <Route path="/series/new" element={<SeriesNewPage />} />
            <Route path="/series/:id" element={<SeriesDetailPage />} />
            <Route path="/series/:id/edit" element={<SeriesEditPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
