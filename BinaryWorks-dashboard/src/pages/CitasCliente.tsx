import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Star, TrendingUp } from "lucide-react"
import { DOCTORES_MOCK, ESPECIALIDADES } from "@/data/doctores"
import { useCitas } from "@/context/CitasContext"
import { useToast } from "@/context/ToastContext"

type Doctor = {
  id: string
  nombre: string
  especialidad: string
  descripcion: string
  experiencia: number
  rating: number
  precio: number
  disponibilidad: { dia: string; horarios: string[] }[]
}

export default function CitasCliente() {
  const navigate = useNavigate()
  const { agregarCita } = useCitas()
  const { showSuccess, showError } = useToast()
  const [busqueda, setBusqueda] = useState("")
  const [especialidadFiltro, setEspecialidadFiltro] = useState("Todas")
  const [doctorSeleccionado, setDoctorSeleccionado] = useState<Doctor | null>(null)
  const [paso, setPaso] = useState<"seleccionar" | "agendar">("seleccionar")
  const [doctores, setDoctores] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar doctores desde Firebase
  useEffect(() => {
    const cargarDoctores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "doctores"))
        const doctoresData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Doctor[]
        setDoctores(doctoresData)
      } catch (error) {
        console.error("Error al cargar doctores:", error)
        showError("Error al cargar los doctores. Por favor, intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    cargarDoctores()
  }, [showError])

  // Filtrar doctores
  const doctoresFiltrados = doctores.filter(doctor => {
    const matchBusqueda = doctor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          doctor.especialidad.toLowerCase().includes(busqueda.toLowerCase())
    const matchEspecialidad = especialidadFiltro === "Todas" || doctor.especialidad === especialidadFiltro
    return matchBusqueda && matchEspecialidad
  })

  const seleccionarDoctor = (doctor: typeof DOCTORES_MOCK[0]) => {
    setDoctorSeleccionado(doctor)
    setPaso("agendar")
  }

  const volverASeleccion = () => {
    setDoctorSeleccionado(null)
    setPaso("seleccionar")
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-950 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/tienda-cliente")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h1 className="text-xl font-bold">Agendar Cita Médica</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-neutral-500">Cargando doctores...</p>
            </div>
          </div>
        ) : paso === "seleccionar" ? (
          <>
            {/* Filtros */}
            <div className="mb-6 grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar doctor</label>
                <Input
                  placeholder="Nombre o especialidad..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Especialidad</label>
                <Select value={especialidadFiltro} onChange={e => setEspecialidadFiltro(e.target.value)}>
                  {ESPECIALIDADES.map(esp => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Lista de doctores */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Doctores disponibles ({doctoresFiltrados.length})
              </h2>
            </div>

            {doctoresFiltrados.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-neutral-500">
                  No se encontraron doctores
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctoresFiltrados.map(doctor => (
                  <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {doctor.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <Badge className="bg-emerald-600">{doctor.especialidad}</Badge>
                      </div>
                      
                      <CardTitle className="text-lg">{doctor.nombre}</CardTitle>
                      <p className="text-sm text-neutral-500 mt-2">
                        {doctor.descripcion}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span>{doctor.experiencia} años</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span>{doctor.rating}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-neutral-500">Consulta</span>
                          <span className="text-xl font-bold text-emerald-600">
                            ${doctor.precio}
                          </span>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => seleccionarDoctor(doctor)}
                        >
                          Agendar cita
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <AgendarCitaForm
            doctor={doctorSeleccionado!}
            onVolver={volverASeleccion}
            onAgendar={(fecha, hora, motivo) => {
              agregarCita({
                doctor: doctorSeleccionado!,
                fecha,
                hora,
                motivo
              })
              showSuccess(`¡Cita agendada con éxito con ${doctorSeleccionado!.nombre}!`)
              setTimeout(() => navigate("/mis-citas"), 1500)
            }}
          />
        )}
      </main>
    </div>
  )
}

// Componente para agendar la cita
function AgendarCitaForm({
  doctor,
  onVolver,
  onAgendar
}: {
  doctor: Doctor
  onVolver: () => void
  onAgendar: (fecha: string, hora: string, motivo: string) => void
}) {
  const { showWarning } = useToast()
  const [diaSeleccionado, setDiaSeleccionado] = useState("")
  const [horaSeleccionada, setHoraSeleccionada] = useState("")
  const [motivo, setMotivo] = useState("")

  const horariosDisponibles = diaSeleccionado
    ? doctor.disponibilidad.find(d => d.dia === diaSeleccionado)?.horarios || []
    : []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!diaSeleccionado || !horaSeleccionada || !motivo.trim()) {
      showWarning("Por favor completa todos los campos")
      return
    }

    // Calcular fecha (próximo día de la semana seleccionado)
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const hoy = new Date()
    const diaActual = hoy.getDay()
    const diaObjetivo = diasSemana.indexOf(diaSeleccionado)
    let diasHasta = diaObjetivo - diaActual
    if (diasHasta <= 0) diasHasta += 7
    
    const fechaCita = new Date(hoy)
    fechaCita.setDate(hoy.getDate() + diasHasta)
    const fechaStr = fechaCita.toISOString().split('T')[0]

    onAgendar(fechaStr, horaSeleccionada, motivo)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={onVolver}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Agendar cita</CardTitle>
              <p className="text-sm text-neutral-500 mt-1">
                Selecciona día, hora y motivo de consulta
              </p>
            </div>
          </div>

          {/* Info del doctor */}
          <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {doctor.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{doctor.nombre}</div>
              <div className="text-sm text-neutral-500">{doctor.especialidad}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">${doctor.precio}</div>
              <div className="text-xs text-neutral-500">por consulta</div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seleccionar día */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Selecciona un día
              </label>
              <div className="grid grid-cols-5 gap-2">
                {doctor.disponibilidad.map(({ dia }) => (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => {
                      setDiaSeleccionado(dia)
                      setHoraSeleccionada("")
                    }}
                    className={`p-3 rounded-lg border-2 transition text-sm font-medium
                      ${diaSeleccionado === dia 
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600" 
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                      }`}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </div>

            {/* Seleccionar hora */}
            {diaSeleccionado && (
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Selecciona una hora
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {horariosDisponibles.map(hora => (
                    <button
                      key={hora}
                      type="button"
                      onClick={() => setHoraSeleccionada(hora)}
                      className={`p-3 rounded-lg border-2 transition text-sm font-medium
                        ${horaSeleccionada === hora
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                          : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                        }`}
                    >
                      <Clock className="h-4 w-4 mx-auto mb-1" />
                      {hora}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Motivo */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Motivo de consulta
              </label>
              <textarea
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                placeholder="Describe brevemente el motivo de tu consulta..."
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Resumen */}
            {diaSeleccionado && horaSeleccionada && motivo && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium mb-2">Resumen de tu cita:</p>
                <div className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
                  <p>📅 {diaSeleccionado} a las {horaSeleccionada}</p>
                  <p>👨‍⚕️ {doctor.nombre}</p>
                  <p>💰 ${doctor.precio}</p>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={!diaSeleccionado || !horaSeleccionada || !motivo.trim()}
            >
              Confirmar cita
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}