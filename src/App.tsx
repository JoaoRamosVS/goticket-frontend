import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import DashboardPage from './components/DashboardPage'
import SessionWatcher from './components/SessionWatcher';
import { useAuthStore } from './stores/authStore';

function App() {

  const isAuth = useAuthStore((state) => state.isAuth)

  return (
    <BrowserRouter>
      <SessionWatcher />
      
      <Routes>
				<Route path="/"
					element={
						isAuth ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
					}
				/>
        <Route path="/login" element={isAuth ? <Navigate to="/dashboard" replace /> : <LoginPage />}/>
        <Route path="/dashboard" element={isAuth ? <DashboardPage /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
