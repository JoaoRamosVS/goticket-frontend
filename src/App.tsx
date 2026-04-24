import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

// import SessionWatcher from '@/components/global/SessionWatcher';
import Navbar from '@/components/global/Navbar';
import SmoothScroll from '@/components/global/SmoothScroll';
import Footer from '@/components/global/Footer';

import { useAuthStore } from '@/stores/authStore';

import Login from '@/pages/Login'
import Home from '@/pages/Home'
import SignUp from '@/pages/SignUp';
import QuemSomos from '@/pages/QuemSomos';
import EventPage from '@/pages/EventPage';
import Admin from '@/pages/Admin';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminEventos from '@/pages/admin/Eventos';
import AdminEditarEvento from '@/pages/admin/EditarEvento';
import AdminClientes from '@/pages/admin/Clientes';
import AdminEditarCliente from '@/pages/admin/EditarCliente';
import AdminOrganizadores from '@/pages/admin/Organizadores';
import AdminEditarOrganizador from '@/pages/admin/EditarOrganizador';
import AdminVendas from '@/pages/admin/Vendas';
import AdminConfiguracoes from '@/pages/admin/Configuracoes';
import AdminEspacos from '@/pages/admin/Espacos';
import AdminEditarEspaco from '@/pages/admin/EditarEspaco';

function AppContent() {
  const isAuth = useAuthStore((state) => state.isAuth)
  const location = useLocation()

  const isAdminRoute = location.pathname.includes('/admin')

  return (
    <SmoothScroll>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuth ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/cadastro" element={isAuth ? <Navigate to="/home" replace /> : <SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/evento" element={<EventPage />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="eventos" element={<AdminEventos />} />
          <Route path="eventos/:eventId" element={<AdminEditarEvento />} />
          <Route path="espacos" element={<AdminEspacos />} />
          <Route path="espacos/:venueId" element={<AdminEditarEspaco />} />
          <Route path="clientes" element={<AdminClientes />} />
          <Route path="clientes/:clientId" element={<AdminEditarCliente />} />
          <Route path="organizadores" element={<AdminOrganizadores />} />
          <Route path="organizadores/:organizerId" element={<AdminEditarOrganizador />} />
          <Route path="vendas" element={<AdminVendas />} />
          <Route path="configuracoes" element={<AdminConfiguracoes />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </SmoothScroll>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
