import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import DashboardPage from './components/DashboardPage'
import SessionWatcher from './components/SessionWatcher';

function App() {

  const isAuthenticated = () => Boolean(localStorage.getItem('accessToken'))

  return (
    <BrowserRouter>
      <SessionWatcher />

      <Routes>
				<Route
					path="/"
					element={
						isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
					}
				/>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          isAuthenticated() ? <DashboardPage /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
