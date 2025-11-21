import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"

type Usuario = { id: string; nombre: string; email: string; rol: "Admin" | "Operador" | "Cliente"; estado: "Activo" | "Suspendido" }
const DATA: Usuario[] = [
  { id: "U-1001", nombre: "Ana Torres",   email: "ana@clinic.mx",   rol: "Admin",    estado: "Activo" },
  { id: "U-1002", nombre: "Luis García",  email: "luis@clinic.mx",  rol: "Operador", estado: "Activo" },
  { id: "U-1003", nombre: "María Pérez",  email: "maria@mail.com",  rol: "Cliente",  estado: "Activo" },
  { id: "U-1004", nombre: "Carlos Ruiz",  email: "carlos@mail.com", rol: "Cliente",  estado: "Suspendido" },
]

export default function Usuarios() {
  const [q, setQ] = useState("")
  const [rol, setRol] = useState("Todos")
  const [estado, setEstado] = useState("Todos")

  const rows = useMemo(() => {
    let r = [...DATA]
    const s = q.trim().toLowerCase()
    if (s) r = r.filter(x => [x.nombre, x.email, x.id].join(" ").toLowerCase().includes(s))
    if (rol !== "Todos") r = r.filter(x => x.rol === (rol as any))
    if (estado !== "Todos") r = r.filter(x => x.estado === (estado as any))
    return r
  }, [q, rol, estado])

  const rolBadge = (r: Usuario["rol"]) => r === "Admin" ? <Badge>Admin</Badge> : r === "Operador" ? <Badge className="bg-muted">Operador</Badge> : <Badge className="bg-transparent border">Cliente</Badge>
  const estadoBadge = (e: Usuario["estado"]) => e === "Activo" ? <Badge className="bg-emerald-600">Activo</Badge> : <Badge className="bg-red-600">Suspendido</Badge>

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Usuarios</h1>
          <p className="text-sm text-neutral-400">Administra cuentas, roles y estado.</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} className="w-56"/>
          <Button>Nuevo usuario</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <div className="mb-1 text-xs text-neutral-400">Rol</div>
            <Select value={rol} onChange={e=>setRol(e.target.value)}>
              <option>Todos</option><option>Admin</option><option>Operador</option><option>Cliente</option>
            </Select>
          </div>
          <div>
            <div className="mb-1 text-xs text-neutral-400">Estado</div>
            <Select value={estado} onChange={e=>setEstado(e.target.value)}>
              <option>Todos</option><option>Activo</option><option>Suspendido</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">ID</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead className="hidden md:table-cell">Rol</TableHead>
                <TableHead className="hidden md:table-cell">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(u=>(
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={u.nombre}/>
                      <div className="min-w-0">
                        <div className="truncate font-medium">{u.nombre}</div>
                        <div className="truncate text-xs text-neutral-400">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{rolBadge(u.rol)}</TableCell>
                  <TableCell className="hidden md:table-cell">{estadoBadge(u.estado)}</TableCell>
                </TableRow>
              ))}
              {rows.length===0 && <TableRow><TableCell colSpan={4} className="py-10 text-center text-sm text-neutral-400">Sin resultados</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
