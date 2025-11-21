import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
export default function Configuracion(){
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Configuración</h1>
      <Card><CardHeader><CardTitle>Preferencias</CardTitle></CardHeader><CardContent>
        <div className="h-32 rounded-md border border-dashed"/>
      </CardContent></Card>
    </div>
  )
}
