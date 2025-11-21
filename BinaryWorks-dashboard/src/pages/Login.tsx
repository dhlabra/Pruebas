import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/context/ToastContext"

export default function Login() {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Obtener datos del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "usuarios", user.uid))

      if (!userDoc.exists()) {
        showError("Usuario no encontrado en la base de datos")
        setLoading(false)
        return
      }

      const userData = userDoc.data()

      // Guardar info del usuario en localStorage
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: userData.email,
        nombre: userData.nombre,
        rol: userData.rol
      }))

      // Mostrar mensaje de éxito
      showSuccess(`¡Bienvenido ${userData.nombre}!`)

      // Redirigir según el rol
      if (userData.rol === "admin") {
        navigate("/dashboard")
      } else if (userData.rol === "cliente") {
        navigate("/tienda-cliente")
      } else {
        showError("Rol de usuario no reconocido")
        setLoading(false)
        return
      }

    } catch (error: any) {
      console.error("Error al iniciar sesión:", error)

      // Mensajes de error amigables
      switch (error.code) {
        case "auth/invalid-email":
          showError("Email inválido")
          break
        case "auth/user-not-found":
          showError("Usuario no encontrado")
          break
        case "auth/wrong-password":
          showError("Contraseña incorrecta")
          break
        case "auth/invalid-credential":
          showError("Credenciales inválidas")
          break
        default:
          showError("Error al iniciar sesión. Intenta de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-900 dark:to-neutral-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/Logo.png" alt="MediLink" className="h-16 w-16 rounded-xl" />
          </div>
          <CardTitle className="text-2xl">Bienvenido a MediLink</CardTitle>
          <p className="text-sm text-neutral-500 mt-2">
            Ingresa tus credenciales para continuar
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          {/* Info de prueba */}
          <div className="mt-6 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-md">
            <p className="text-xs font-semibold mb-2">Credenciales de prueba:</p>
            <div className="space-y-2 text-xs">
              <div>
                <p className="font-medium">Admin:</p>
                <p className="text-neutral-600 dark:text-neutral-400">admin@medilink.com</p>
                <p className="text-neutral-600 dark:text-neutral-400">admin123</p>
              </div>
              <div>
                <p className="font-medium">Cliente:</p>
                <p className="text-neutral-600 dark:text-neutral-400">usuario@mail.com</p>
                <p className="text-neutral-600 dark:text-neutral-400">user123</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => navigate("/registro")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}