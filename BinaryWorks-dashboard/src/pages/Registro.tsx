import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/context/ToastContext"
import { ArrowLeft } from "lucide-react"

export default function Registro() {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    telefono: ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      showError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      showError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      showError("Nombre y apellido son obligatorios")
      setLoading(false)
      return
    }

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      const user = userCredential.user

      // Crear documento en Firestore con el UID como ID del documento
      await setDoc(doc(db, "usuarios", user.uid), {
        email: formData.email,
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        telefono: formData.telefono.trim() || "",
        rol: "cliente",
        activo: true,
        fechaCreacion: serverTimestamp()
      })

      // Guardar info en localStorage
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: formData.email,
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        rol: "cliente"
      }))

      // Mostrar mensaje de éxito
      showSuccess(`¡Cuenta creada exitosamente! Bienvenido ${formData.nombre}`)

      // Redirigir a la tienda
      navigate("/tienda-cliente")

    } catch (error: any) {
      console.error("Error al registrar:", error)

      // Mensajes de error amigables
      switch (error.code) {
        case "auth/email-already-in-use":
          showError("Este correo ya está registrado")
          break
        case "auth/invalid-email":
          showError("Correo electrónico inválido")
          break
        case "auth/weak-password":
          showError("La contraseña es muy débil")
          break
        default:
          showError("Error al crear cuenta. Intenta de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-900 dark:to-neutral-800 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/Logo.png" alt="MediLink" className="h-16 w-16 rounded-xl" />
          </div>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <p className="text-sm text-neutral-500 mt-2">
            Regístrate para acceder a MediLink
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Nombre
                </label>
                <Input
                  type="text"
                  name="nombre"
                  placeholder="Juan"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Apellido
                </label>
                <Input
                  type="text"
                  name="apellido"
                  placeholder="Pérez"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Teléfono (opcional)
              </label>
              <Input
                type="tel"
                name="telefono"
                placeholder="8112345678"
                value={formData.telefono}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Correo electrónico
              </label>
              <Input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Confirmar contraseña
              </label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio de sesión
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}