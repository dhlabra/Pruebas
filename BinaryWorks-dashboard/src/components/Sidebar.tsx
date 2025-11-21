import { NavLink, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { LayoutDashboard, Users, CalendarDays, ShoppingBag, MessageSquare, Settings, LogOut } from "lucide-react"

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/usuarios", label: "Usuarios", icon: Users },
  { to: "/citas", label: "Citas", icon: CalendarDays },
  { to: "/tienda", label: "Tienda", icon: ShoppingBag },
  { to: "/ia", label: "Asistente IA", icon: MessageSquare },
  { to: "/configuracion", label: "Configuración", icon: Settings },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const userStr = localStorage.getItem("user")
  const user = userStr ? JSON.parse(userStr) : null

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("user")
      navigate("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-card px-3 py-4 flex flex-col">
      <div className="mb-4 flex items-center gap-2 px-2 text-sm font-semibold">
        <img src="/Logo.png" alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
        <span>MediLink</span>
      </div>
      
      <nav className="space-y-1 flex-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted ${isActive ? "bg-muted" : ""}`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Usuario y logout al final */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="px-2 py-2 mb-2">
          <div className="text-xs text-neutral-500">Usuario</div>
          <div className="text-sm font-medium truncate">{user?.nombre || "Admin"}</div>
          <div className="text-xs text-neutral-400 truncate">{user?.email}</div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted w-full text-red-600 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}