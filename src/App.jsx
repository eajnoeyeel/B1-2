import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider from './components/AuthProvider.jsx'
import Layout from './components/Layout.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import ToastProvider from './components/ToastProvider.jsx'
import ExplorePage from './pages/ExplorePage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import SeriesDetailPage from './pages/SeriesDetailPage.jsx'
import SeriesEditPage from './pages/SeriesEditPage.jsx'
import SeriesNewPage from './pages/SeriesNewPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/series" element={<ExplorePage />} />
              <Route path="/series/:id" element={<SeriesDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              {/* 보호 라우트: 로그인한 사용자만 */}
              <Route element={<RequireAuth />}>
                <Route path="/series/new" element={<SeriesNewPage />} />
                <Route path="/series/:id/edit" element={<SeriesEditPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
