import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
// import SessionWatcher from '@/components/global/SessionWatcher';
import Navbar from '@/components/global/Navbar';
import SmoothScroll from '@/components/global/SmoothScroll';
import { useAuthStore } from '@/stores/authStore';
import SignUp from '@/pages/SignUp';
import QuemSomos from '@/pages/QuemSomos';
import Footer from '@/components/global/Footer';
import EventPage from './pages/EventPage';

function App() {

  const isAuth = useAuthStore((state) => state.isAuth)

  return (
    <BrowserRouter>
      <SmoothScroll>
        {/* <SessionWatcher /> */}
        <Navbar />
        
        <Routes>
          <Route path="/" element={ <Home /> }/>
          <Route path="/login" element={isAuth ? <Navigate to="/home" replace /> : <Login />}/>
          <Route path="/cadastro" element={isAuth ? <Navigate to="/home" replace /> : <SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/evento" element={<EventPage />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
        </Routes>
        
        <Footer />
      </SmoothScroll>
    </BrowserRouter>
  )
}

export default App
