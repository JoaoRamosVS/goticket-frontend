import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import DashboardPage from './components/Dashboardpage'

function App() {

  const loginAcessToken = localStorage.getItem('accessToken');


  return (
    <BrowserRouter>
      <Routes>
				<Route
					path="/"
					element={
						loginAcessToken ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
					}
				/>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
