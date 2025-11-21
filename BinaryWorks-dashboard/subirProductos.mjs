// Script para subir productos iniciales a Firestore
// Ejecutar con: node subirProductos.mjs

import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAm-ulBmMieDvuPX0MmkPG86VTYhEbQKq0",
  authDomain: "medilink-dc322.firebaseapp.com",
  projectId: "medilink-dc322",
  storageBucket: "medilink-dc322.firebasestorage.app",
  messagingSenderId: "569141932091",
  appId: "1:569141932091:web:651bfe468e729291e06c1e"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const PRODUCTOS = [
  {
    nombre: "Paracetamol 500mg",
    descripcion: "Analgésico y antipirético para dolor leve a moderado",
    precio: 45.00,
    categoria: "Analgésicos",
    stock: 150
  },
  {
    nombre: "Ibuprofeno 400mg",
    descripcion: "Antiinflamatorio no esteroideo para dolor e inflamación",
    precio: 65.00,
    categoria: "Antiinflamatorios",
    stock: 120
  },
  {
    nombre: "Amoxicilina 500mg",
    descripcion: "Antibiótico de amplio espectro",
    precio: 180.00,
    categoria: "Antibióticos",
    stock: 80
  },
  {
    nombre: "Omeprazol 20mg",
    descripcion: "Inhibidor de la bomba de protones para acidez estomacal",
    precio: 95.00,
    categoria: "Gastroenterología",
    stock: 100
  },
  {
    nombre: "Loratadina 10mg",
    descripcion: "Antihistamínico para alergias",
    precio: 55.00,
    categoria: "Antialérgicos",
    stock: 90
  },
  {
    nombre: "Metformina 850mg",
    descripcion: "Antidiabético para control de glucosa",
    precio: 120.00,
    categoria: "Diabetes",
    stock: 70
  },
  {
    nombre: "Vitamina C 1000mg",
    descripcion: "Suplemento de ácido ascórbico, refuerza sistema inmune",
    precio: 145.00,
    categoria: "Vitaminas",
    stock: 200
  },
  {
    nombre: "Complejo B",
    descripcion: "Vitaminas del complejo B para energía y metabolismo",
    precio: 165.00,
    categoria: "Vitaminas",
    stock: 150
  },
  {
    nombre: "Omega 3",
    descripcion: "Ácidos grasos esenciales para salud cardiovascular",
    precio: 280.00,
    categoria: "Suplementos",
    stock: 85
  },
  {
    nombre: "Multivitamínico Adulto",
    descripcion: "Fórmula completa con vitaminas y minerales",
    precio: 220.00,
    categoria: "Vitaminas",
    stock: 130
  },
  {
    nombre: "Termómetro Digital",
    descripcion: "Termómetro digital de lectura rápida",
    precio: 185.00,
    categoria: "Equipos Médicos",
    stock: 45
  },
  {
    nombre: "Alcohol Gel 500ml",
    descripcion: "Gel antibacterial con 70% de alcohol",
    precio: 65.00,
    categoria: "Higiene",
    stock: 250
  },
  {
    nombre: "Cubrebocas N95",
    descripcion: "Mascarilla de protección respiratoria (caja con 20)",
    precio: 340.00,
    categoria: "Protección",
    stock: 100
  },
  {
    nombre: "Gasas Estériles",
    descripcion: "Paquete de 10 gasas estériles para curación",
    precio: 45.00,
    categoria: "Primeros Auxilios",
    stock: 180
  },
  {
    nombre: "Tensiómetro Digital",
    descripcion: "Monitor de presión arterial automático",
    precio: 580.00,
    categoria: "Equipos Médicos",
    stock: 30
  },
  {
    nombre: "Oxímetro de Pulso",
    descripcion: "Medidor de oxígeno en sangre y frecuencia cardíaca",
    precio: 420.00,
    categoria: "Equipos Médicos",
    stock: 40
  }
]

async function subirProductos() {
  console.log("🔥 Subiendo productos a Firestore...")
  console.log("-----------------------------------\n")
  
  try {
    for (const producto of PRODUCTOS) {
      const docRef = await addDoc(collection(db, "productos"), producto)
      console.log(`✓ ${producto.nombre} - ID: ${docRef.id}`)
    }
    
    console.log("\n-----------------------------------")
    console.log("✅ ¡Todos los productos se subieron exitosamente!")
    console.log("📊 Total: " + PRODUCTOS.length + " productos")
    console.log("\n👉 Verifica en: Firebase Console > Firestore Database > productos")
    process.exit(0)
  } catch (error) {
    console.error("\n❌ Error al subir productos:", error)
    process.exit(1)
  }
}

subirProductos()