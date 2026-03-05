import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import LoginPage from './features/auth/LoginPage'
import SignupPage from './features/auth/SignupPage'
import FeedPage from './features/feed/FeedPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
