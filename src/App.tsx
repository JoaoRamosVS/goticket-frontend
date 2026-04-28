import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'

// import SessionWatcher from '@/components/global/SessionWatcher';
import SmoothScroll from '@/components/global/SmoothScroll';
import MainLayout from '@/layouts/MainLayout';

import { useAuthStore } from '@/stores/authStore';

import Login from '@/pages/auth/Login'
import Home from '@/pages/public/Home'
import SignUp from '@/pages/auth/SignUp';
import QuemSomos from '@/pages/public/QuemSomos';
import EventPage from '@/pages/EventPage';
import AdminLayout from '@/layouts/AdminLayout';
import AdminDashboard from '@/pages/admin/Dashboard';

import AdminEventos from '@/pages/admin/eventos/EventosList';
import AdminEditarEvento from '@/pages/admin/eventos/EditarEvento';

import AdminClientes from '@/pages/admin/clientes/ClientesList';
import AdminEditarCliente from '@/pages/admin/clientes/EditarCliente';

import AdminOrganizadores from '@/pages/admin/organizadores/OrganizadoresList';
import AdminEditarOrganizador from '@/pages/admin/organizadores/EditarOrganizador';

import AdminVendas from '@/pages/admin/Vendas';
import AdminConfiguracoes from '@/pages/admin/Configuracoes';

import AdminEspacos from '@/pages/admin/espacos/EspacosList';
import AdminEditarEspaco from '@/pages/admin/espacos/EditarEspaco';

import AdminCategorias from '@/pages/admin/categorias/CategoriasList';
import AdminEditarCategoria from '@/pages/admin/categorias/EditarCategoria';

function AppContent() {
  const isAuth = useAuthStore((state) => state.isAuth)

  return (
    <SmoothScroll>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuth ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/cadastro" element={isAuth ? <Navigate to="/home" replace /> : <SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/evento" element={<MainLayout><EventPage /></MainLayout>} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
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
          <Route path="categorias" element={<AdminCategorias />} />
          <Route path="categorias/:categoryId" element={<AdminEditarCategoria />} />
          <Route path="vendas" element={<AdminVendas />} />
          <Route path="configuracoes" element={<AdminConfiguracoes />} />
        </Route>
      </Routes>
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
