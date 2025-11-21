import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, X } from "lucide-react"
import { useToast } from "@/context/ToastContext"

export default function Tienda() {
  const { showSuccess, showError } = useToast()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(null) // ID del producto en edición
  const [stockTemp, setStockTemp] = useState("")
  const [precioTemp, setPrecioTemp] = useState("")
  const [guardando, setGuardando] = useState(false)

  // Cargar productos desde Firestore
  useEffect(() => {
    cargarProductos()
  }, [])

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

  const iniciarEdicion = (producto) => {
    setEditando(producto.id)
    setStockTemp(producto.stock.toString())
    setPrecioTemp(producto.precio.toString())
  }

  const cancelarEdicion = () => {
    setEditando(null)
    setStockTemp("")
    setPrecioTemp("")
  }

  const guardarCambios = async (productoId) => {
    setGuardando(true)
    try {
      const productoRef = doc(db, "productos", productoId)
      await updateDoc(productoRef, {
        stock: parseInt(stockTemp),
        precio: parseFloat(precioTemp)
      })

      // Actualizar estado local
      const productoActualizado = productos.find(p => p.id === productoId)
      setProductos(productos.map(p =>
        p.id === productoId
          ? { ...p, stock: parseInt(stockTemp), precio: parseFloat(precioTemp) }
          : p
      ))

      setEditando(null)
      setStockTemp("")
      setPrecioTemp("")

      showSuccess(`Producto "${productoActualizado?.nombre}" actualizado correctamente`)
    } catch (error) {
      console.error("Error al actualizar producto:", error)
      showError("Error al actualizar producto. Por favor, intenta de nuevo.")
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-500">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de Productos</h1>
          <p className="text-sm text-neutral-400">
            Administra stock y precios de los productos
          </p>
        </div>
        <Badge className="text-sm px-3 py-1">
          {productos.length} productos en catálogo
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-center">Precio</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map(producto => (
                <TableRow key={producto.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{producto.nombre}</div>
                      <div className="text-xs text-neutral-500 line-clamp-1">
                        {producto.descripcion}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="text-xs">{producto.categoria}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {editando === producto.id ? (
                      <Input
                        type="number"
                        value={precioTemp}
                        onChange={e => setPrecioTemp(e.target.value)}
                        className="w-24 text-center"
                        step="0.01"
                      />
                    ) : (
                      <span className="font-semibold text-emerald-600">
                        ${producto.precio.toFixed(2)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editando === producto.id ? (
                      <Input
                        type="number"
                        value={stockTemp}
                        onChange={e => setStockTemp(e.target.value)}
                        className="w-20 text-center"
                      />
                    ) : (
                      <span className="font-medium">{producto.stock}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {producto.stock === 0 ? (
                      <Badge className="bg-red-600">Agotado</Badge>
                    ) : producto.stock < 50 ? (
                      <Badge className="bg-yellow-600">Bajo</Badge>
                    ) : (
                      <Badge className="bg-emerald-600">Disponible</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editando === producto.id ? (
                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={() => guardarCambios(producto.id)}
                          disabled={guardando}
                          className="gap-1 px-3 py-1 h-8 text-xs"
                        >
                          <Save className="h-3 w-3" />
                          Guardar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={cancelarEdicion}
                          disabled={guardando}
                          className="gap-1 px-3 py-1 h-8 text-xs"
                        >
                          <X className="h-3 w-3" />
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => iniciarEdicion(producto)}
                        className="gap-1 px-3 py-1 h-8 text-xs"
                      >
                        <Pencil className="h-3 w-3" />
                        Editar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">💡 Información</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
          <p>• Los cambios se reflejan automáticamente en la tienda del cliente</p>
          <p>• Stock bajo: menos de 50 unidades</p>
          <p>• Los productos agotados (stock = 0) no se pueden agregar al carrito</p>
        </CardContent>
      </Card>
    </div>
  )
}