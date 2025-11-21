export type Doctor = {
  id: string
  nombre: string
  especialidad: string
  descripcion: string
  experiencia: number // años
  rating: number
  precio: number
  disponibilidad: {
    dia: string // "Lunes", "Martes", etc.
    horarios: string[] // ["09:00", "10:00", etc.]
  }[]
}

export const DOCTORES_MOCK: Doctor[] = [
  {
    id: "doc-001",
    nombre: "Dr. Carlos García López",
    especialidad: "Medicina General",
    descripcion: "Especialista en atención primaria y medicina preventiva",
    experiencia: 15,
    rating: 4.8,
    precio: 450,
    disponibilidad: [
      { dia: "Lunes", horarios: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
      { dia: "Miércoles", horarios: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { dia: "Viernes", horarios: ["09:00", "10:00", "11:00"] }
    ]
  },
  {
    id: "doc-002",
    nombre: "Dra. María Martínez Ruiz",
    especialidad: "Pediatría",
    descripcion: "Experta en salud infantil y adolescente",
    experiencia: 12,
    rating: 4.9,
    precio: 500,
    disponibilidad: [
      { dia: "Lunes", horarios: ["10:00", "11:00", "12:00", "15:00", "16:00"] },
      { dia: "Martes", horarios: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { dia: "Jueves", horarios: ["10:00", "11:00", "15:00", "16:00"] }
    ]
  },
  {
    id: "doc-003",
    nombre: "Dr. Roberto Hernández",
    especialidad: "Cardiología",
    descripcion: "Especialista en enfermedades cardiovasculares",
    experiencia: 20,
    rating: 4.7,
    precio: 750,
    disponibilidad: [
      { dia: "Martes", horarios: ["09:00", "10:00", "11:00"] },
      { dia: "Jueves", horarios: ["14:00", "15:00", "16:00", "17:00"] }
    ]
  },
  {
    id: "doc-004",
    nombre: "Dra. Ana Torres Silva",
    especialidad: "Dermatología",
    descripcion: "Tratamiento de enfermedades de la piel",
    experiencia: 10,
    rating: 4.6,
    precio: 600,
    disponibilidad: [
      { dia: "Lunes", horarios: ["14:00", "15:00", "16:00", "17:00"] },
      { dia: "Miércoles", horarios: ["09:00", "10:00", "11:00", "14:00"] },
      { dia: "Viernes", horarios: ["14:00", "15:00", "16:00"] }
    ]
  },
  {
    id: "doc-005",
    nombre: "Dr. Luis Ramírez Castro",
    especialidad: "Ginecología",
    descripcion: "Salud femenina y reproductiva",
    experiencia: 18,
    rating: 4.8,
    precio: 650,
    disponibilidad: [
      { dia: "Martes", horarios: ["10:00", "11:00", "12:00", "15:00", "16:00"] },
      { dia: "Jueves", horarios: ["09:00", "10:00", "11:00"] },
      { dia: "Viernes", horarios: ["10:00", "11:00", "15:00", "16:00"] }
    ]
  },
  {
    id: "doc-006",
    nombre: "Dra. Patricia Sánchez",
    especialidad: "Oftalmología",
    descripcion: "Cuidado de la salud visual",
    experiencia: 14,
    rating: 4.7,
    precio: 550,
    disponibilidad: [
      { dia: "Lunes", horarios: ["09:00", "10:00", "11:00", "15:00"] },
      { dia: "Miércoles", horarios: ["14:00", "15:00", "16:00", "17:00"] },
      { dia: "Viernes", horarios: ["09:00", "10:00", "11:00"] }
    ]
  }
]

export const ESPECIALIDADES = [
  "Todas",
  "Medicina General",
  "Pediatría",
  "Cardiología",
  "Dermatología",
  "Ginecología",
  "Oftalmología"
]

export const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes"
]