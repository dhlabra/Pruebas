import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { collection, addDoc, getDocs, doc, updateDoc, query, where, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

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

type Cita = {
  id: string
  doctor: Doctor
  fecha: string
  hora: string
  motivo: string
  estado: "confirmada" | "pendiente" | "cancelada" | "completada"
  pacienteId: string
  pacienteNombre: string
  fechaCreacion: any
}

type CitasContextType = {
  citas: Cita[]
  loading: boolean
  agregarCita: (data: { doctor: Doctor; fecha: string; hora: string; motivo: string }) => Promise<void>
  cancelarCita: (citaId: string) => Promise<void>
  getCitasActivas: () => Cita[]
  getCitasPasadas: () => Cita[]
}

const CitasContext = createContext<CitasContextType | undefined>(undefined)

export function CitasProvider({ children }: { children: ReactNode }) {
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)

  // Obtener info del usuario actual
  const getUserInfo = () => {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }

  // Cargar citas del usuario actual desde Firebase
  useEffect(() => {
    const cargarCitas = async () => {
      const user = getUserInfo()
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const q = query(
          collection(db, "citas"),
          where("pacienteId", "==", user.uid)
        )
        const querySnapshot = await getDocs(q)
        const citasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Cita[]
        
        setCitas(citasData)
      } catch (error) {
        console.error("Error al cargar citas:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarCitas()
  }, [])

  // Agregar nueva cita
  const agregarCita = async (data: { doctor: Doctor; fecha: string; hora: string; motivo: string }) => {
    const user = getUserInfo()
    if (!user) {
      alert("Debes iniciar sesión para agendar una cita")
      return
    }

    try {
      const nuevaCita = {
        doctor: data.doctor,
        fecha: data.fecha,
        hora: data.hora,
        motivo: data.motivo,
        estado: "confirmada" as const,
        pacienteId: user.uid,
        pacienteNombre: user.nombre,
        fechaCreacion: serverTimestamp()
      }

      const docRef = await addDoc(collection(db, "citas"), nuevaCita)
      
      // Actualizar estado local
      setCitas(prev => [...prev, {
        id: docRef.id,
        ...nuevaCita,
        fechaCreacion: new Date()
      }])
      
      console.log("Cita agendada con ID:", docRef.id)
    } catch (error) {
      console.error("Error al agregar cita:", error)
      throw error
    }
  }

  // Cancelar cita
  const cancelarCita = async (citaId: string) => {
    try {
      const citaRef = doc(db, "citas", citaId)
      await updateDoc(citaRef, {
        estado: "cancelada"
      })

      // Actualizar estado local
      setCitas(prev =>
        prev.map(cita =>
          cita.id === citaId ? { ...cita, estado: "cancelada" as const } : cita
        )
      )
      
      console.log("Cita cancelada:", citaId)
    } catch (error) {
      console.error("Error al cancelar cita:", error)
      throw error
    }
  }

  // Obtener citas activas (futuras y no canceladas)
  const getCitasActivas = () => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    return citas.filter(cita => {
      const fechaCita = new Date(cita.fecha)
      return fechaCita >= hoy && cita.estado !== "cancelada" && cita.estado !== "completada"
    }).sort((a, b) => {
      const dateCompare = a.fecha.localeCompare(b.fecha)
      if (dateCompare !== 0) return dateCompare
      return a.hora.localeCompare(b.hora)
    })
  }

  // Obtener citas pasadas o canceladas
  const getCitasPasadas = () => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    return citas.filter(cita => {
      const fechaCita = new Date(cita.fecha)
      return fechaCita < hoy || cita.estado === "cancelada" || cita.estado === "completada"
    }).sort((a, b) => {
      const dateCompare = b.fecha.localeCompare(a.fecha)
      if (dateCompare !== 0) return dateCompare
      return b.hora.localeCompare(a.hora)
    })
  }

  return (
    <CitasContext.Provider
      value={{
        citas,
        loading,
        agregarCita,
        cancelarCita,
        getCitasActivas,
        getCitasPasadas
      }}
    >
      {children}
    </CitasContext.Provider>
  )
}

export function useCitas() {
  const context = useContext(CitasContext)
  if (context === undefined) {
    throw new Error("useCitas debe usarse dentro de CitasProvider")
  }
  return context
}