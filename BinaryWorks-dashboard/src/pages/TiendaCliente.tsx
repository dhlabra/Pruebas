import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Search, LogOut, User, Plus, MessageSquare, Calendar } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/context/ToastContext"
import { CATEGORIAS } from "@/data/productos"

export default function TiendaCliente() {
  const navigate = useNavigate()
  const { addToCart, getCartCount } = useCart()
  const { showSuccess, showError } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoria, setCategoria] = useState("Todas")
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Obtener info del usuario
  const userStr = localStorage.getItem("user")
  const user = userStr ? JSON.parse(userStr) : null

  // Cargar productos desde Firestore
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"))
        const productosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setProductos(productosData)
      } catch (error) {
        console.error("Error al cargar productos:", error)
        showError("Error al cargar los productos. Por favor, intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    cargarProductos()
  }, [showError])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("user")
      showSuccess("Sesión cerrada exitosamente")
      navigate("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      showError("Error al cerrar sesión. Por favor, intenta de nuevo.")
    }
  }

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const matchQuery = producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategoria = categoria === "Todas" || producto.categoria === categoria
    return matchQuery && matchCategoria
  })

  const handleAddToCart = (producto) => {
    addToCart(producto)
    showSuccess(`${producto.nombre} agregado al carrito`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-500">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-950 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo y Nombre */}
            <div className="flex items-center gap-3">
              <img src="/Logo.png" alt="MediLink" className="h-10 w-10 rounded-lg" />
              <div>
                <h1 className="text-xl font-bold">MediLink</h1>
                <p className="text-xs text-neutral-500">Tu farmacia en línea</p>
              </div>
            </div>

            {/* Búsqueda */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Buscar medicamentos..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Usuario y acciones */}
            <div className="flex items-center gap-2">
              <Button 
                className="gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate("/citas-cliente")}
              >
                <Calendar className="h-4 w-4" />
                Agendar Cita
              </Button>

              <Button 
                variant="outline" 
                className="gap-2 px-3 py-2 text-sm"
                onClick={() => navigate("/asistente-ia-cliente")}
              >
                <MessageSquare className="h-4 w-4" />
                Asistente IA
              </Button>

              <Button 
                variant="outline" 
                className="gap-2 px-3 py-2 text-sm relative"
                onClick={() => navigate("/carrito")}
              >
                <ShoppingCart className="h-4 w-4" />
                Carrito
                {getCartCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getCartCount()}
                  </Badge>
                )}
              </Button>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition" onClick={() => navigate("/mis-citas")}>
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.nombre || "Usuario"}</span>
              </div>

              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="gap-2 px-3 py-2 text-sm"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categorías</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={categoria} onChange={e => setCategoria(e.target.value)}>
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Header de resultados */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {categoria === "Todas" ? "Todos los productos" : categoria}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""} encontrado{productosFiltrados.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Grid de productos */}
        {productosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-neutral-500">No se encontraron productos</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productosFiltrados.map(producto => (
              <Card key={producto.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg mb-3 overflow-hidden">
                    {(producto.imagenURL || producto.imagen) ? (
                      <img
                        src={producto.imagenURL || producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement.classList.add('flex', 'items-center', 'justify-center');
                          const icon = document.createElement('div');
                          icon.className = 'text-blue-600 dark:text-blue-400';
                          icon.innerHTML = '<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>';
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.appendChild(icon);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-blue-600 dark:text-blue-400">
                          <ShoppingCart className="h-12 w-12" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <Badge className="mb-2 text-xs">{producto.categoria}</Badge>
                    <CardTitle className="text-lg leading-tight">{producto.nombre}</CardTitle>
                    <p className="text-sm text-neutral-500 mt-2 line-clamp-2">
                      {producto.descripcion}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-emerald-600">
                      ${producto.precio.toFixed(2)}
                    </span>
                    <span className="text-xs text-neutral-500">
                      Stock: {producto.stock}
                    </span>
                  </div>
                  <Button 
                    className="w-full gap-2" 
                    onClick={() => handleAddToCart(producto)}
                    disabled={producto.stock === 0}
                  >
                    <Plus className="h-4 w-4" />
                    Agregar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}