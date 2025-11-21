import { Product } from "@/context/CartContext"

export const PRODUCTOS_MOCK: Product[] = [
  // Medicamentos comunes
  {
    id: "med-001",
    nombre: "Paracetamol 500mg",
    descripcion: "Analgésico y antipirético para dolor leve a moderado",
    precio: 45.00,
    categoria: "Analgésicos",
    stock: 150
  },
  {
    id: "med-002",
    nombre: "Ibuprofeno 400mg",
    descripcion: "Antiinflamatorio no esteroideo para dolor e inflamación",
    precio: 65.00,
    categoria: "Antiinflamatorios",
    stock: 120
  },
  {
    id: "med-003",
    nombre: "Amoxicilina 500mg",
    descripcion: "Antibiótico de amplio espectro",
    precio: 180.00,
    categoria: "Antibióticos",
    stock: 80
  },
  {
    id: "med-004",
    nombre: "Omeprazol 20mg",
    descripcion: "Inhibidor de la bomba de protones para acidez estomacal",
    precio: 95.00,
    categoria: "Gastroenterología",
    stock: 100
  },
  {
    id: "med-005",
    nombre: "Loratadina 10mg",
    descripcion: "Antihistamínico para alergias",
    precio: 55.00,
    categoria: "Antialérgicos",
    stock: 90
  },
  {
    id: "med-006",
    nombre: "Metformina 850mg",
    descripcion: "Antidiabético para control de glucosa",
    precio: 120.00,
    categoria: "Diabetes",
    stock: 70
  },
  
  // Vitaminas y suplementos
  {
    id: "vit-001",
    nombre: "Vitamina C 1000mg",
    descripcion: "Suplemento de ácido ascórbico, refuerza sistema inmune",
    precio: 145.00,
    categoria: "Vitaminas",
    stock: 200
  },
  {
    id: "vit-002",
    nombre: "Complejo B",
    descripcion: "Vitaminas del complejo B para energía y metabolismo",
    precio: 165.00,
    categoria: "Vitaminas",
    stock: 150
  },
  {
    id: "vit-003",
    nombre: "Omega 3",
    descripcion: "Ácidos grasos esenciales para salud cardiovascular",
    precio: 280.00,
    categoria: "Suplementos",
    stock: 85
  },
  {
    id: "vit-004",
    nombre: "Multivitamínico Adulto",
    descripcion: "Fórmula completa con vitaminas y minerales",
    precio: 220.00,
    categoria: "Vitaminas",
    stock: 130
  },

  // Cuidado personal
  {
    id: "per-001",
    nombre: "Termómetro Digital",
    descripcion: "Termómetro digital de lectura rápida",
    precio: 185.00,
    categoria: "Equipos Médicos",
    stock: 45
  },
  {
    id: "per-002",
    nombre: "Alcohol Gel 500ml",
    descripcion: "Gel antibacterial con 70% de alcohol",
    precio: 65.00,
    categoria: "Higiene",
    stock: 250
  },
  {
    id: "per-003",
    nombre: "Cubrebocas N95",
    descripcion: "Mascarilla de protección respiratoria (caja con 20)",
    precio: 340.00,
    categoria: "Protección",
    stock: 100
  },
  {
    id: "per-004",
    nombre: "Gasas Estériles",
    descripcion: "Paquete de 10 gasas estériles para curación",
    precio: 45.00,
    categoria: "Primeros Auxilios",
    stock: 180
  },
  {
    id: "per-005",
    nombre: "Tensiómetro Digital",
    descripcion: "Monitor de presión arterial automático",
    precio: 580.00,
    categoria: "Equipos Médicos",
    stock: 30
  },
  {
    id: "per-006",
    nombre: "Oxímetro de Pulso",
    descripcion: "Medidor de oxígeno en sangre y frecuencia cardíaca",
    precio: 420.00,
    categoria: "Equipos Médicos",
    stock: 40
  }
]

export const CATEGORIAS = [
  "Todas",
  "Analgésicos",
  "Antiinflamatorios",
  "Antibióticos",
  "Vitaminas",
  "Suplementos",
  "Equipos Médicos",
  "Higiene",
  "Primeros Auxilios"
]