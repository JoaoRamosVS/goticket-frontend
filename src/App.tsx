import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'

// import SessionWatcher from '@/components/shared/SessionWatcher';
import SmoothScroll from '@/components/shared/SmoothScroll';
import MainLayout from '@/layouts/MainLayout';

import { useAuthStore } from '@/stores/authStore';

import Login from '@/pages/auth/Login'
import Home from '@/pages/public/Home'
import SignUp from '@/pages/auth/SignUp';
import QuemSomos from '@/pages/public/QuemSomos';

import EventPage from '@/pages/public/EventPage';
import EventDateTicketsPage from '@/pages/public/EventDateTicketsPage';

import AdminLayout from '@/layouts/AdminLayout';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminEventos from '@/pages/admin/eventos/EventosList';
import AdminEditarEvento from '@/pages/admin/eventos/EditarEvento';
import AdminConfigurarEvento from '@/pages/admin/eventos/ConfigurarEvento';
import AdminClientes from '@/pages/admin/clientes/ClientesList';
import AdminEditarCliente from '@/pages/admin/clientes/EditarCliente';
import AdminOrganizadores from '@/pages/admin/organizadores/OrganizadoresList';
import AdminEditarOrganizador from '@/pages/admin/organizadores/EditarOrganizador';
import AdminConfiguracoes from '@/pages/admin/Configuracoes';
import AdminEspacos from '@/pages/admin/espacos/EspacosList';
import AdminEditarEspaco from '@/pages/admin/espacos/EditarEspaco';
import AdminNewVenue from '@/pages/admin/espacos/NewVenue';
import AdminCategorias from '@/pages/admin/categorias/CategoriasList';
import AdminEditarCategoria from '@/pages/admin/categorias/EditarCategoria';
import AdminPedidos from '@/pages/admin/pedidos/PedidosList';
import AdminPedidoDetalhe from '@/pages/admin/pedidos/PedidoDetalhe';

import OrganizerLayout from '@/layouts/OrganizerLayout';
import OrganizerDashboard from '@/pages/organizer/Dashboard';
import OrganizerEventosList from '@/pages/organizer/eventos/EventosList';
import OrganizerEditarEvento from '@/pages/organizer/eventos/EditarEvento';
import OrganizerNovoEvento from '@/pages/organizer/eventos/NovoEvento'
import OrganizerConfigurarEvento from '@/pages/organizer/eventos/ConfigurarEvento';

import { ToastProvider, useToast } from '@/components/ui/toast';
import BuscaPage from '@/pages/public/BuscaPage';
import CategoriaPage from '@/pages/public/CategoriaPage';
import CategoriasIndexPage from '@/pages/public/CategoriasIndexPage';
import CheckoutPage from '@/pages/public/CheckoutPage';
import WaitingRoomPage from '@/pages/public/WaitingRoomPage';
import OrderTrackingPage from '@/pages/public/OrderTrackingPage';

import MyAccountLayout from '@/layouts/MyAccountLayout';
import MyAccountProfilePage from '@/pages/client/MyAccountProfilePage';
import MyAccountAddressPage from '@/pages/client/MyAccountAddressPage';
import MyAccountSecurityPage from '@/pages/client/MyAccountSecurityPage';
import MyAccountOrdersPage from '@/pages/client/MyAccountOrdersPage';

/** Rotas exclusivas para clientes. Admin/Organizer são redirecionados para sua área. */
function ProtectedClientRoute() {
  const isAuth = useAuthStore((state) => state.isAuth)
  const userScope = useAuthStore((state) => state.userScope)
  const { showToast } = useToast()

  useEffect(() => {
    if (!isAuth) {
      showToast({ type: 'warning', title: 'Acesso restrito', message: 'Você precisa estar logado para acessar esta seção.' })
    } else if (userScope === 'ADMIN' || userScope === 'ORGANIZER') {
      showToast({ type: 'warning', title: 'Área incorreta', message: 'Para acessar esta área, você precisa estar logado como um cliente.' })
    }
  }, [isAuth, userScope, showToast])

  if (!isAuth) return <Navigate to="/login" replace />
  if (userScope === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
  if (userScope === 'ORGANIZER') return <Navigate to="/organizer/dashboard" replace />

  return <Outlet />
}

/** Rotas exclusivas para organizadores. */
function OrganizerRoute() {
  const isAuth = useAuthStore((state) => state.isAuth)
  const userScope = useAuthStore((state) => state.userScope)
  const { showToast } = useToast()

  useEffect(() => {
    if (!isAuth) {
      showToast({ type: 'warning', title: 'Acesso restrito', message: 'Você precisa estar logado para acessar esta seção.' })
    } else if (userScope !== 'ORGANIZER') {
      showToast({ type: 'error', title: 'Acesso negado', message: 'Você não tem permissão para acessar esta seção.' })
    }
  }, [isAuth, userScope, showToast])

  if (!isAuth) return <Navigate to="/login" replace />
  if (userScope === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
  if (userScope !== 'ORGANIZER') return <Navigate to="/" replace />

  return <OrganizerLayout><Outlet /></OrganizerLayout>
}

/** Rotas exclusivas para administradores. */
function AdminRoute() {
  const isAuth = useAuthStore((state) => state.isAuth)
  const userScope = useAuthStore((state) => state.userScope)
  const { showToast } = useToast()

  useEffect(() => {
    if (!isAuth) {
      showToast({ type: 'warning', title: 'Acesso restrito', message: 'Você precisa estar logado para acessar esta seção.' })
    } else if (userScope !== 'ADMIN') {
      showToast({ type: 'error', title: 'Acesso negado', message: 'Você não tem permissão para acessar esta seção.' })
    }
  }, [isAuth, userScope, showToast])

  if (!isAuth) return <Navigate to="/login" replace />
  if (userScope === 'ORGANIZER') return <Navigate to="/organizer/dashboard" replace />
  if (userScope !== 'ADMIN') return <Navigate to="/" replace />

  return <AdminLayout><Outlet /></AdminLayout>
}

function AppContent() {
  const isAuth = useAuthStore((state) => state.isAuth)
  const userScope = useAuthStore((state) => state.userScope)

  const loginRedirect = !isAuth ? null :
    userScope === 'ADMIN' ? <Navigate to="/admin/dashboard" replace /> :
    userScope === 'ORGANIZER' ? <Navigate to="/organizer/dashboard" replace /> :
    <Navigate to="/home" replace />

  return (
    <SmoothScroll>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={loginRedirect ?? <Login />} />
        <Route path="/cadastro" element={loginRedirect ?? <SignUp />} />

        <Route path="/home" element={<Home />} />
        <Route path="/busca/:searchTerm" element={<MainLayout><BuscaPage /></MainLayout>} />
        <Route path="/categorias" element={<MainLayout><CategoriasIndexPage /></MainLayout>} />
        <Route path="/categoria/:slug" element={<MainLayout><CategoriaPage /></MainLayout>} />
        <Route path="/evento/:eventId" element={<MainLayout><EventPage /></MainLayout>} />
        <Route path="/quem-somos" element={<QuemSomos />} />

        <Route element={<ProtectedClientRoute />}>
          <Route path="/evento/:eventId/data/:eventDateId/ingressos" element={<MainLayout><EventDateTicketsPage /></MainLayout>} />
          <Route path="/evento/:eventId/fila" element={<MainLayout><WaitingRoomPage /></MainLayout>} />
          <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
          <Route path="/pedidos/:orderId" element={<MainLayout><OrderTrackingPage /></MainLayout>} />

          <Route path="/minha-conta" element={<MyAccountLayout><Outlet /></MyAccountLayout>}>
            <Route index element={<Navigate to="perfil" replace />} />
            <Route path="perfil" element={<MyAccountProfilePage />} />
            <Route path="endereco" element={<MyAccountAddressPage />} />
            <Route path="seguranca" element={<MyAccountSecurityPage />} />
            <Route path="pedidos" element={<MyAccountOrdersPage />} />
          </Route>
        </Route>

        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="eventos" element={<AdminEventos />} />
          <Route path="eventos/:eventId" element={<AdminEditarEvento />} />
          <Route path="eventos/:eventId/configurar" element={<AdminConfigurarEvento />} />

          <Route path="espacos" element={<AdminEspacos />} />
          <Route path="espacos/:venueId" element={<AdminEditarEspaco />} />
          <Route path="new-venue" element={<AdminNewVenue />} />

          <Route path="clientes" element={<AdminClientes />} />
          <Route path="clientes/:clientId" element={<AdminEditarCliente />} />

          <Route path="organizadores" element={<AdminOrganizadores />} />
          <Route path="organizadores/:organizerId" element={<AdminEditarOrganizador />} />

          <Route path="categorias" element={<AdminCategorias />} />
          <Route path="categorias/:categoryId" element={<AdminEditarCategoria />} />

          <Route path="pedidos" element={<AdminPedidos />} />
          <Route path="pedidos/:orderId" element={<AdminPedidoDetalhe />} />
          <Route path="configuracoes" element={<AdminConfiguracoes />} />
        </Route>

        <Route path="/organizer" element={<OrganizerRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<OrganizerDashboard />} />

          <Route path="eventos" element={<OrganizerEventosList />} />
          <Route path="eventos/:eventId" element={<OrganizerEditarEvento />} />
          <Route path="eventos/:eventId/configurar" element={<OrganizerConfigurarEvento />} />

          <Route path="novo-evento" element={<OrganizerNovoEvento />} />
        </Route>
      </Routes>
    </SmoothScroll>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
