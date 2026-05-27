import { useEffect, useRef } from 'react'
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
import AdminVendas from '@/pages/admin/Vendas';
import AdminConfiguracoes from '@/pages/admin/Configuracoes';
import AdminEspacos from '@/pages/admin/espacos/EspacosList';
import AdminEditarEspaco from '@/pages/admin/espacos/EditarEspaco';
import AdminNewVenue from '@/pages/admin/espacos/NewVenue';
import AdminCategorias from '@/pages/admin/categorias/CategoriasList';
import AdminEditarCategoria from '@/pages/admin/categorias/EditarCategoria';

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
import OrderTrackingPage from '@/pages/public/OrderTrackingPage';

import MyAccountLayout from '@/layouts/MyAccountLayout';
import MyAccountProfilePage from '@/pages/client/MyAccountProfilePage';
import MyAccountAddressPage from '@/pages/client/MyAccountAddressPage';
import MyAccountSecurityPage from '@/pages/client/MyAccountSecurityPage';
import MyAccountOrdersPage from '@/pages/client/MyAccountOrdersPage';

function ProtectedRoute() {
    const isAuth = useAuthStore((state) => state.isAuth)
    const { showToast } = useToast()

    const hasShownToast = useRef(false)

    useEffect(() => {
        if (!isAuth && !hasShownToast.current) {
            hasShownToast.current = true

            showToast({
                type: 'warning',
                title: 'Acesso restrito',
                message: 'Você precisa estar logado para acessar esta seção.',
            })
        }
    }, [isAuth, showToast])

    if (!isAuth) return <Navigate to="/login" replace />

    return <Outlet />
}

function AppContent() {
  const isAuth = useAuthStore((state) => state.isAuth)

  return (
    <SmoothScroll>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={isAuth ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/cadastro" element={isAuth ? <Navigate to="/home" replace /> : <SignUp />} />

        <Route path="/home" element={<Home />} />
        <Route path="/busca/:searchTerm" element={<MainLayout><BuscaPage /></MainLayout>} />
        <Route path="/categorias" element={<MainLayout><CategoriasIndexPage /></MainLayout>} />
        <Route path="/categoria/:slug" element={<MainLayout><CategoriaPage /></MainLayout>} />
        <Route path="/evento/:eventId" element={<MainLayout><EventPage /></MainLayout>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/evento/:eventId/data/:eventDateId/ingressos" element={<MainLayout><EventDateTicketsPage /></MainLayout>} />
          <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
          <Route path="/pedidos/:orderId" element={<MainLayout><OrderTrackingPage /></MainLayout>} />
        </Route>
        <Route path="/quem-somos" element={<QuemSomos />} />

        <Route path="/minha-conta" element={<MyAccountLayout><Outlet /></MyAccountLayout>}>
          <Route index element={<Navigate to="perfil" replace />} />
          <Route path="perfil" element={<MyAccountProfilePage />} />
          <Route path="endereco" element={<MyAccountAddressPage />} />
          <Route path="seguranca" element={<MyAccountSecurityPage />} />
          <Route path="pedidos" element={<MyAccountOrdersPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          
          <Route path="dashboard" element={<AdminDashboard />} />
          
          <Route path="eventos" element={<AdminEventos />} />
          <Route path="eventos/:eventId" element={<AdminEditarEvento />} />
          <Route path="eventos/:eventId/configurar" element={<AdminConfigurarEvento />} />
          
          <Route path="espacos" element={<AdminEspacos />} />
          <Route path="new-venue" element={<AdminNewVenue />} />
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

        <Route path="/organizer" element={<OrganizerLayout><Outlet /></OrganizerLayout>}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<OrganizerDashboard />} />

          <Route path="eventos" element={<OrganizerEventosList />} />
          <Route path="eventos/:eventId" element={<OrganizerEditarEvento />} />

          <Route path="novo-evento" element={<OrganizerNovoEvento />} />
          <Route path="eventos/:eventId/configurar" element={<OrganizerConfigurarEvento />} />
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

