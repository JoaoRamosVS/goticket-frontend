import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import SessionWatcher from './components/SessionWatcher';
import Navbar from './components/Navbar';
import { useAuthStore } from './stores/authStore';
import SignUp from './pages/SignUp';

function App() {

  const isAuth = useAuthStore((state) => state.isAuth)

  return (
    <BrowserRouter>
      <SessionWatcher />
      {isAuth && <Navbar />}
      <Routes>
				<Route path="/"
					element={
						isAuth ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
					}
				/>
        <Route path="/login" element={isAuth ? <Navigate to="/home" replace /> : <Login />}/>
        <Route path="/cadastro" element={isAuth ? <Navigate to="/home" replace /> : <SignUp />} />
        <Route path="/home" element={isAuth ? <Home /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
