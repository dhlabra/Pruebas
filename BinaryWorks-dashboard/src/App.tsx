import { Routes, Route, Navigate } from "react-router-dom"
import { CartProvider } from "@/context/CartContext"
import { CitasProvider } from "@/context/CitasContext"
import { ToastProvider } from "@/context/ToastContext"
import Sidebar from "@/components/Sidebar"
import Dashboard from "@/pages/Dashboard"
import Usuarios from "@/pages/Usuarios"
import Citas from "@/pages/Citas"
import Tienda from "@/pages/Tienda"
import AsistenteIA from "@/pages/AsistenteIA"
import Configuracion from "@/pages/Configuracion"
import Login from "@/pages/Login"
import Registro from "@/pages/Registro"
import TiendaCliente from "@/pages/TiendaCliente"
import Carrito from "@/pages/Carrito"
import AsistenteIACliente from "@/pages/AsistenteIACliente"
import CitasCliente from "@/pages/CitasCliente"
import MisCitas from "@/pages/MisCitas"

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <CitasProvider>
          <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas de cliente (sin sidebar) */}
          <Route path="/tienda-cliente" element={<TiendaCliente />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/citas-cliente" element={<CitasCliente />} />
          <Route path="/mis-citas" element={<MisCitas />} />
          <Route path="/asistente-ia-cliente" element={<AsistenteIACliente />} />

          {/* Rutas de admin (con sidebar) */}
          <Route path="/dashboard" element={
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-6">
                <Dashboard />
              </main>
            </div>
          } />
          
          <Route path="/usuarios" element={
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-6">
                <Usuarios />
              </main>
            </div>
          } />
          
          <Route path="/citas" element={
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-6">
                <Citas />
              </main>
            </div>
          } />
          
          <Route path="/tienda" element={
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-6">
                <Tienda />
              </main>
            </div>
          } />
          
          <Route path="/ia" element={
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-6">
                <AsistenteIA />
              </main>
            </div>
          } />
          
          <Route path="/configuracion" element={
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-6">
                <Configuracion />
              </main>
            </div>
          } />
        </Routes>
      </CitasProvider>
    </CartProvider>
    </ToastProvider>
  )
}