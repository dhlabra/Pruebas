import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, User, MapPin, X } from "lucide-react"
import { useCitas } from "@/context/CitasContext"

export default function MisCitas() {
  const navigate = useNavigate()
  const { getCitasActivas, getCitasPasadas, cancelarCita, loading } = useCitas()

  const citasActivas = getCitasActivas()
  const citasPasadas = getCitasPasadas()

  const handleCancelar = async (citaId: string) => {
    if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      try {
        await cancelarCita(citaId)
        alert("Cita cancelada exitosamente")
      } catch (error) {
        alert("Error al cancelar la cita")
      }
    }
  }

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-MX', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-950 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
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
            <h1 className="text-xl font-bold">Mis Citas</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-neutral-500">Cargando citas...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Botón para agendar nueva cita */}
            <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Gestiona tus citas médicas</h2>
            <p className="text-sm text-neutral-500">
              {citasActivas.length} cita{citasActivas.length !== 1 ? 's' : ''} próxima{citasActivas.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => navigate("/citas-cliente")}>
            Agendar nueva cita
          </Button>
        </div>

        {/* Citas próximas */}
        <div className="mb-8">
          <h3 className="text-md font-semibold mb-4">Citas próximas</h3>
          {citasActivas.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
                <p className="text-neutral-500 mb-4">No tienes citas próximas</p>
                <Button onClick={() => navigate("/citas-cliente")}>
                  Agendar una cita
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {citasActivas.map(cita => (
                <Card key={cita.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Fecha destacada */}
                      <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 min-w-[100px]">
                        <div className="text-3xl font-bold text-blue-600">
                          {new Date(cita.fecha).getDate()}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {new Date(cita.fecha).toLocaleDateString('es-MX', { month: 'short' })}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {new Date(cita.fecha).getFullYear()}
                        </div>
                      </div>

                      {/* Info de la cita */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{cita.doctor.nombre}</h4>
                            <Badge className="mt-1">{cita.doctor.especialidad}</Badge>
                          </div>
                          <Badge className="bg-emerald-600">
                            {cita.estado === "confirmada" ? "Confirmada" : "Pendiente"}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatearFecha(cita.fecha)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{cita.hora}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5" />
                            <span>Consultorio en línea / Clínica MediLink</span>
                          </div>
                        </div>

                        {cita.motivo && (
                          <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                            <p className="text-sm">
                              <span className="font-medium">Motivo:</span> {cita.motivo}
                            </p>
                          </div>
                        )}

                        {/* Acciones */}
                        <div className="mt-4 flex gap-2">
                          <Button 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleCancelar(cita.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancelar cita
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Historial de citas */}
        {citasPasadas.length > 0 && (
          <div>
            <h3 className="text-md font-semibold mb-4">Historial</h3>
            <div className="space-y-4">
              {citasPasadas.map(cita => (
                <Card key={cita.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 min-w-[100px]">
                        <div className="text-2xl font-bold text-neutral-500">
                          {new Date(cita.fecha).getDate()}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {new Date(cita.fecha).toLocaleDateString('es-MX', { month: 'short' })}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{cita.doctor.nombre}</h4>
                            <p className="text-sm text-neutral-500">{cita.doctor.especialidad}</p>
                          </div>
                          <Badge className={cita.estado === "cancelada" ? "bg-red-600" : ""}>
                            {cita.estado === "cancelada" ? "Cancelada" : "Completada"}
                          </Badge>
                        </div>

                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{cita.hora}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        </>
        )}
      </main>
    </div>
  )
}