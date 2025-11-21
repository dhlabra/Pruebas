import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react"
import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/context/ToastContext"


type Appointment = {
  id: string;
  pacienteNombre: string;
  doctor: {
    nombre: string;
    especialidad: string;
  };
  date: string; // "2025-01-20"
  time: string; // "10:00"
  duration: number; // minutos
  status: "confirmada" | "pendiente" | "cancelada";
  motivo?: string;
}

export default function Citas() {
  const { showError } = useToast()
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = semana actual
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar citas desde Firebase
  useEffect(() => {
    const cargarCitas = async () => {
      try {
        const q = query(collection(db, "citas"), orderBy("fecha", "asc"))
        const querySnapshot = await getDocs(q)
        const citasData = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            pacienteNombre: data.pacienteNombre,
            doctor: data.doctor,
            date: data.fecha,
            time: data.hora,
            duration: 30, // duración por defecto
            status: data.estado,
            motivo: data.motivo
          }
        }) as Appointment[]
        setAppointments(citasData)
      } catch (error) {
        console.error("Error al cargar citas:", error)
        showError("Error al cargar las citas. Por favor, intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    cargarCitas()
  }, [showError])

  // Generar días de la semana actual
  const getWeekDays = (weekOffset: number = 0) => {
    const today = new Date();
    const currentDay = today.getDay(); 
    const diff = currentDay === 0 ? -6 : 1 - currentDay; 
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + (weekOffset * 7));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeek);
  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];


  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };


  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case "confirmada": return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800";
      case "pendiente": return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800";
      case "cancelada": return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800";
      default: return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case "confirmada": return "Confirmada";
      case "pendiente": return "Pendiente";
      case "cancelada": return "Cancelada";
      default: return status;
    }
  };


  const totalAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= weekDays[0] && aptDate <= weekDays[6];
  }).length;

  const confirmedCount = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return apt.status === "confirmada" && aptDate >= weekDays[0] && aptDate <= weekDays[6];
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-500">Cargando citas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Citas Programadas</h1>
          <p className="text-sm text-neutral-400">Gestión de agenda médica</p>
        </div>
        
        {/* Stats compactos */}
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-neutral-500">Total: </span>
            <span className="font-semibold">{totalAppointments}</span>
          </div>
          <div>
            <span className="text-neutral-500">Confirmadas: </span>
            <span className="font-semibold text-emerald-600">{confirmedCount}</span>
          </div>
        </div>
      </div>

      {/* Calendario */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Calendario Semanal</CardTitle>
            
            {/* Navegación de semanas */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentWeek(currentWeek - 1)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-sm font-medium px-3">
                {weekDays[0].toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              
              <button
                onClick={() => setCurrentWeek(currentWeek + 1)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {currentWeek !== 0 && (
                <button
                  onClick={() => setCurrentWeek(0)}
                  className="ml-2 text-xs px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900 transition"
                >
                  Hoy
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Headers de días */}
            {weekDays.map((day, idx) => {
              const isToday = day.toDateString() === new Date().toDateString();
              const appointmentsCount = getAppointmentsForDate(day).length;
              
              return (
                <div
                  key={idx}
                  className={`text-center pb-2 border-b-2 ${
                    isToday 
                      ? 'border-blue-500' 
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="text-xs text-neutral-500 mb-1">{dayNames[idx]}</div>
                  <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                    {day.getDate()}
                  </div>
                  {appointmentsCount > 0 && (
                    <div className="text-xs text-neutral-400 mt-1">
                      {appointmentsCount} cita{appointmentsCount > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Contenido de cada día */}
            {weekDays.map((day, idx) => {
              const dayAppointments = getAppointmentsForDate(day);
              const isWeekend = idx >= 5; // Sábado y Domingo
              
              return (
                <div
                  key={`content-${idx}`}
                  className={`min-h-[400px] p-2 rounded-lg ${
                    isWeekend 
                      ? 'bg-neutral-50 dark:bg-neutral-900/50' 
                      : 'bg-white dark:bg-neutral-950'
                  }`}
                >
                  <div className="space-y-2">
                    {dayAppointments.length === 0 ? (
                      <div className="text-center py-8 text-xs text-neutral-400">
                        Sin citas
                      </div>
                    ) : (
                      dayAppointments
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map(apt => (
                          <div
                            key={apt.id}
                            className={`p-3 rounded-lg border text-xs space-y-2 hover:shadow-md transition-shadow cursor-pointer ${getStatusColor(apt.status)}`}
                          >
                            {/* Hora */}
                            <div className="flex items-center gap-1 font-semibold">
                              <Clock className="w-3 h-3" />
                              <span>{apt.time}</span>
                            </div>

                            {/* Paciente */}
                            <div className="flex items-start gap-1">
                              <User className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span className="font-medium leading-tight">{apt.pacienteNombre}</span>
                            </div>

                            {/* Doctor */}
                            <div className="text-xs opacity-90">
                              {apt.doctor.nombre}
                            </div>

                            {/* Especialidad */}
                            <div className="text-xs opacity-75">
                              {apt.doctor.especialidad}
                            </div>

                            {/* Estado */}
                            <div className="pt-1 border-t border-current/20">
                              <span className="text-xs font-medium">
                                {getStatusText(apt.status)}
                              </span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista detallada de citas de la semana */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments
              .filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate >= weekDays[0] && aptDate <= weekDays[6];
              })
              .sort((a, b) => {
                const dateCompare = a.date.localeCompare(b.date);
                if (dateCompare !== 0) return dateCompare;
                return a.time.localeCompare(b.time);
              })
              .map(apt => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Fecha y hora */}
                  <div className="text-center min-w-[80px]">
                    <div className="text-xs text-neutral-500">
                      {new Date(apt.date).toLocaleDateString('es-MX', { weekday: 'short' })}
                    </div>
                    <div className="text-lg font-bold">
                      {new Date(apt.date).getDate()}
                    </div>
                    <div className="text-sm font-semibold text-blue-600">
                      {apt.time}
                    </div>
                  </div>

                  {/* Separador */}
                  <div className="h-16 w-px bg-neutral-200 dark:bg-neutral-800"></div>

                  {/* Info del paciente */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{apt.pacienteNombre}</div>
                    <div className="text-xs text-neutral-500">{apt.doctor.nombre}</div>
                    <div className="text-xs text-neutral-400">{apt.doctor.especialidad}</div>
                    {apt.motivo && (
                      <div className="text-xs text-neutral-400 mt-1 italic">{apt.motivo}</div>
                    )}
                  </div>

                  {/* Duración */}
                  <div className="text-xs text-neutral-500 text-center min-w-[60px]">
                    <Clock className="w-4 h-4 mx-auto mb-1" />
                    {apt.duration} min
                  </div>

                  {/* Estado */}
                  <Badge className={getStatusColor(apt.status)}>
                    {getStatusText(apt.status)}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Leyenda de colores */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-neutral-500 font-medium">Estados:</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500"></div>
              <span>Confirmada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500"></div>
              <span>Pendiente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>Cancelada</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}