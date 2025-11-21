import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Clock, ShoppingCart } from "lucide-react"

export default function Dashboard() {
  const kpis = [
    { label: "Usuarios activos", value: "2,440", icon: TrendingUp, trend: "+12.5%" },
    { label: "Pedidos de hoy", value: "487", icon: ShoppingCart, trend: "+8.2%" },
    { label: "Ventas del día", value: "$14,879", icon: BarChart3, trend: "+23.1%" },
    { label: "Citas de hoy", value: "126", icon: Clock, trend: "+5.4%" },
  ]
  
  const productos = [
    { nombre: "Paracetamol 500 mg (8 tabletas)", precio: "MXN 4,000", ventas: 145 },
    { nombre: "Curitas Kids 20 U", precio: "MXN 700", ventas: 98 },
    { nombre: "Enjuague bucal (500ml)", precio: "MXN 400", ventas: 76 },
    { nombre: "Alcohol etílico (250ml)", precio: "MXN 180", ventas: 54 },
  ]
  
  const citas = [
    { doctor: "Dr. García López", especialidad: "Medicina General", fecha: "15 agosto 2025", hora: "10:00 AM" },
    { doctor: "Dra. Martínez Ruiz", especialidad: "Pediatría", fecha: "15 agosto 2025", hora: "2:30 PM" },
    { doctor: "Dr. Hernández", especialidad: "Cardiología", fecha: "16 agosto 2025", hora: "11:00 AM" },
    { doctor: "Dra. Torres", especialidad: "Dermatología", fecha: "16 agosto 2025", hora: "4:00 PM" },
    { doctor: "Dr. Ramírez", especialidad: "Medicina General", fecha: "17 agosto 2025", hora: "9:00 AM" },
    { doctor: "Dra. Silva", especialidad: "Ginecología", fecha: "17 agosto 2025", hora: "3:00 PM" },
  ]

  // Datos para gráfica de ventas semanales
  const ventasSemana = [
    { dia: "Lun", ventas: 12000, citas: 18 },
    { dia: "Mar", ventas: 15000, citas: 22 },
    { dia: "Mié", ventas: 18000, citas: 25 },
    { dia: "Jue", ventas: 14000, citas: 20 },
    { dia: "Vie", ventas: 22000, citas: 28 },
    { dia: "Sáb", ventas: 25000, citas: 15 },
    { dia: "Dom", ventas: 10000, citas: 8 },
  ]

  const maxVentas = Math.max(...ventasSemana.map(v => v.ventas))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-neutral-400">Resumen general del sistema</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-500">{k.label}</CardTitle>
              <k.icon className="h-4 w-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{k.value}</div>
              <p className="text-xs text-emerald-600 mt-1">
                {k.trend} vs ayer
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Gráfica de Ventas y Citas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ventas y Citas por Semana</CardTitle>
            <p className="text-sm text-neutral-400">Últimos 7 días</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ventasSemana.map((item) => (
                <div key={item.dia} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium w-16">{item.dia}</span>
                    <span className="text-emerald-600 font-semibold text-xs">
                      ${(item.ventas / 1000).toFixed(1)}k ventas
                    </span>
                    <span className="text-blue-600 text-xs">
                      {item.citas} citas
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {/* Barra de ventas */}
                    <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(item.ventas / maxVentas) * 100}%` }}
                      >
                        <span className="text-xs text-white font-medium">
                          {item.ventas >= 15000 ? `$${(item.ventas / 1000).toFixed(0)}k` : ''}
                        </span>
                      </div>
                    </div>
                    {/* Mini barra de citas */}
                    <div className="w-16 bg-blue-100 dark:bg-blue-900/20 rounded-full h-6 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                        {item.citas}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500"></div>
                <span>Ventas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span>Citas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfica de Pastel - Horarios */}
        <Card>
          <CardHeader>
            <CardTitle>Horarios de Citas</CardTitle>
            <p className="text-sm text-neutral-400">Distribución diaria</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {/* Donut Chart simulado */}
            <div className="relative w-48 h-48">
              {/* Centro */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">126</div>
                  <div className="text-xs text-neutral-500">Citas hoy</div>
                </div>
              </div>
              
              {/* Anillo de dona */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Mañana 28% - Amarillo */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="16"
                  strokeDasharray="70.4 251.2"
                  strokeDashoffset="0"
                />
                {/* Tarde 40% - Verde */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeDasharray="100.48 251.2"
                  strokeDashoffset="-70.4"
                />
                {/* Noche 32% - Azul */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="16"
                  strokeDasharray="80.38 251.2"
                  strokeDashoffset="-170.88"
                />
              </svg>
            </div>
            
            {/* Leyenda */}
            <div className="mt-6 space-y-2 w-full">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span>Mañana (9-12pm)</span>
                </div>
                <span className="font-semibold">28%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span>Tarde (12-6pm)</span>
                </div>
                <span className="font-semibold">40%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Noche (6-9pm)</span>
                </div>
                <span className="font-semibold">32%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diagrama de Tipos de Consultas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tipos de Consultas al Asistente IA</CardTitle>
            <p className="text-sm text-neutral-400">Distribución de intenciones detectadas</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Consulta de Productos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="font-medium">Consulta de Productos</span>
                  </div>
                  <span className="text-neutral-500 text-xs">45%</span>
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full h-8 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center px-3 text-xs text-white font-medium" style={{ width: '45%' }}>
                    "¿Tienen paracetamol?"
                  </div>
                </div>
              </div>

              {/* Gestión de Carrito */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="font-medium">Gestión de Carrito</span>
                  </div>
                  <span className="text-neutral-500 text-xs">28%</span>
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full h-8 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full flex items-center px-3 text-xs text-white font-medium" style={{ width: '28%' }}>
                    "Agrega 2 al carrito"
                  </div>
                </div>
              </div>

              {/* Programar Citas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="font-medium">Programar Citas</span>
                  </div>
                  <span className="text-neutral-500 text-xs">18%</span>
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full h-8 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full flex items-center px-3 text-xs text-white font-medium" style={{ width: '18%' }}>
                    "Agenda cita para el lunes"
                  </div>
                </div>
              </div>

              {/* Consultar Estado */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="font-medium">Consultar Estado</span>
                  </div>
                  <span className="text-neutral-500 text-xs">6%</span>
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full h-8 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full flex items-center px-3 text-xs text-white font-medium" style={{ width: '6%' }}>
                    "¿Qué tengo en mi carrito?"
                  </div>
                </div>
              </div>

              {/* Otras Consultas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-neutral-400"></div>
                    <span className="font-medium">Otras Consultas</span>
                  </div>
                  <span className="text-neutral-500 text-xs">3%</span>
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full h-8 overflow-hidden">
                  <div className="bg-gradient-to-r from-neutral-400 to-neutral-500 h-full rounded-full flex items-center px-3 text-xs text-white font-medium" style={{ width: '3%' }}>
                    Generales
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de intenciones */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="font-semibold text-blue-700 dark:text-blue-400">Búsqueda</div>
                <div className="text-neutral-600 dark:text-neutral-400 mt-1">Buscar productos, precios, disponibilidad</div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
                <div className="font-semibold text-emerald-700 dark:text-emerald-400">Acciones</div>
                <div className="text-neutral-600 dark:text-neutral-400 mt-1">Agregar, eliminar, modificar carrito</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                <div className="font-semibold text-purple-700 dark:text-purple-400">Agendar</div>
                <div className="text-neutral-600 dark:text-neutral-400 mt-1">Programar, cancelar, consultar citas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Productos más vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
            <p className="text-sm text-neutral-400">Top 4 del mes</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {productos.map((p, idx) => (
              <div key={p.nombre} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="text-sm leading-tight min-w-0">
                      <div className="font-medium truncate">{p.nombre}</div>
                      <div className="text-xs text-neutral-500">{p.ventas} unidades</div>
                    </div>
                  </div>
                  <Badge className="flex-shrink-0">{p.precio}</Badge>
                </div>
                {/* Barra de progreso */}
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full"
                    style={{ width: `${(p.ventas / productos[0].ventas) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Citas programadas */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Próximas Citas Programadas</CardTitle>
            <p className="text-sm text-neutral-400">Agenda de esta semana</p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {citas.map((c, i) => (
              <div key={i} className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {c.doctor.split(' ')[1]?.[0]}{c.doctor.split(' ')[2]?.[0]}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{c.doctor}</div>
                      <div className="text-xs text-neutral-500">{c.especialidad}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 mt-3">
                  <Clock className="w-3 h-3" />
                  <span>{c.fecha}</span>
                  <span>|</span>
                  <span className="font-medium">{c.hora}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}