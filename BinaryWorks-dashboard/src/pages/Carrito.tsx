import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/context/ToastContext"
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react"

export default function Carrito() {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const { showSuccess, showInfo, showWarning } = useToast()

  const handleCheckout = () => {
    showSuccess("¡Compra realizada con éxito! Gracias por tu preferencia")
    clearCart()
    setTimeout(() => navigate("/tienda-cliente"), 1500)
  }

  const handleRemoveItem = (item: any) => {
    removeFromCart(item.id)
    showInfo(`${item.nombre} eliminado del carrito`)
  }

  const handleClearCart = () => {
    clearCart()
    showWarning("Carrito vaciado")
  }

  const handleUpdateQuantity = (id: string, newQuantity: number, stock: number) => {
    if (newQuantity > stock) {
      showWarning("No hay suficiente stock disponible")
      return
    }
    updateQuantity(id, newQuantity)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
            <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
            <p className="text-neutral-500 mb-6">
              Agrega productos desde la tienda para comenzar
            </p>
            <Button onClick={() => navigate("/tienda-cliente")}>
              Ir a la tienda
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header simple */}
      <header className="bg-white dark:bg-neutral-950 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/tienda-cliente")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Button>
          <h1 className="text-xl font-bold">Mi Carrito</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Productos ({cart.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Imagen del producto */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg overflow-hidden flex-shrink-0">
                      {(item.imagenURL || item.imagen) ? (
                        <img
                          src={item.imagenURL || item.imagen}
                          alt={item.nombre}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.parentElement) {
                              e.currentTarget.parentElement.classList.add('flex', 'items-center', 'justify-center');
                              const icon = document.createElement('div');
                              icon.innerHTML = '<svg class="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>';
                              e.currentTarget.parentElement.appendChild(icon);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                    </div>

                    {/* Info del producto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.nombre}</h3>
                      <p className="text-sm text-neutral-500 line-clamp-2 mt-1">
                        {item.descripcion}
                      </p>
                      <p className="text-lg font-bold text-emerald-600 mt-2">
                        ${item.precio.toFixed(2)}
                      </p>
                    </div>

                    {/* Controles */}
                    <div className="flex flex-col items-end justify-between">
                      {/* Cantidad */}
                      <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1, item.stock)}
                          className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-l-lg transition"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 font-medium">{item.cantidad}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1, item.stock)}
                          className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-r-lg transition"
                          disabled={item.cantidad >= item.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Subtotal y eliminar */}
                      <div className="text-right">
                        <p className="text-sm text-neutral-500 mb-2">
                          Subtotal: ${(item.precio * item.cantidad).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen de compra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Desglose */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Subtotal:</span>
                    <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Envío:</span>
                    <span className="font-medium text-emerald-600">Gratis</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-emerald-600">
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón de compra */}
                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                >
                  Finalizar compra
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearCart}
                >
                  Vaciar carrito
                </Button>

                {/* Info adicional */}
                <div className="text-xs text-neutral-500 space-y-1 pt-4 border-t">
                  <p>✓ Envío gratis en compras mayores a $500</p>
                  <p>✓ Garantía de satisfacción</p>
                  <p>✓ Pago seguro</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}