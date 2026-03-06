import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { LoginPage } from './features/auth/LoginPage'
import { SignupPage } from './features/auth/SignupPage'
import { FeedPage } from './features/feed/FeedPage'
import { FriendsPage } from './features/friends/FriendsPage'
import { ProfilePage } from './features/profile/ProfilePage'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<FeedPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
