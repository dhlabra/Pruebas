import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import AIOrb from "@/components/AIOrb"
import useRealtime from "@/hooks/useRealtime"
import useAudioPlayer from "@/hooks/useAudioPlayer"
import useAudioRecorder from "@/hooks/useAudioRecorder"

const WS_URL = import.meta.env.VITE_FRIDA_WS_URL || "wss://frida-realtime.rosassebastian.com/realtime"
const TOKEN = import.meta.env.VITE_FRIDA_TOKEN as string | undefined

const DEFAULT_PROMPT = `Eres un asistente virtual de una farmacia en línea llamada MediLink. Ayudas a los clientes a:

1. Buscar y agregar productos al carrito
2. Programar citas médicas
3. Responder preguntas sobre productos y servicios
4. Dar recomendaciones de salud general

Sé amigable, profesional y confirma cada acción que realices.
Cuando agregues productos, pregunta si desean algo más.
Cuando programes citas, confirma fecha, hora y tipo de consulta.`

export default function AsistenteIACliente() {
  const navigate = useNavigate()
  const [active, setActive] = useState(false)
  const [aiState, setAiState] = useState<"listening" | "talking">("listening")
  
  const [systemPrompt] = useState(DEFAULT_PROMPT)
  
  const [transcript, setTranscript] = useState<{role: "user" | "assistant", text: string, timestamp: string}[]>([])
  
  const [stats, setStats] = useState({
    messages: 0,
    tokensUsed: 0,
    duration: 0,
  })
  const startTimeRef = useRef<number>(0)
  const timerRef = useRef<NodeJS.Timeout>()

  const { reset, play, stop: stopAudioPlayer } = useAudioPlayer()

  const onAudioRecorded = useCallback((b64: string) => {
    if (!b64 || b64.length < 5) return
    addUserAudio(b64)
  }, [])

  const { start: startRecording, stop: stopRecording } = useAudioRecorder({
    onAudioRecorded,
  })

  const { startSession, addUserAudio, inputAudioBufferClear } = useRealtime({
    url: WS_URL,
    token: TOKEN,
    enableInputAudioTranscription: true,

    onWebSocketOpen: () => {
      console.log("WebSocket conectado")
      startTimeRef.current = Date.now()
      startSession({
        voiceChoice: "alloy",
        systemMessage: systemPrompt,
        kbId: "default",
      })
    },

    onWebSocketClose: () => {
      console.log("WebSocket desconectado")
    },

    onWebSocketError: (event) => {
      console.error("Error WebSocket:", event)
    },

    onWebSocketMessage: (event) => {
      try {
        const msg = JSON.parse(event.data)
        
        if (msg.type === "error") {
          console.error("Error:", msg)
          if (msg.error?.message?.includes("token") || msg.message?.includes("token")) {
            alert("⚠️ Límite de tokens alcanzado. Reinicia la conversación.")
            if (active) {
              stopRecording()
              stopAudioPlayer()
              setActive(false)
            }
          }
        }
        
        if (msg.type === "response.done" && msg.response?.usage) {
          const usage = msg.response.usage
          setStats(prev => ({
            ...prev,
            tokensUsed: prev.tokensUsed + (usage.total_tokens || 0)
          }))
        }
      } catch (e) {}
    },

    onReceivedInputAudioBufferSpeechStarted: () => {
      console.log("Usuario empezó a hablar")
      stopAudioPlayer()
      setAiState("listening")
    },

    onReceivedInputAudioTranscriptionCompleted: (msg) => {
      console.log("Usuario dijo:", msg.transcript)
      setTranscript(prev => [...prev, {
        role: "user",
        text: msg.transcript,
        timestamp: new Date().toLocaleTimeString()
      }])
    },

    onReceivedResponseAudioDelta: (msg) => {
      if (msg.delta) {
        play(msg.delta)
        setAiState("talking")
      }
    },

    onReceivedResponseAudioTranscriptDelta: (msg) => {
      if (msg.delta) {
        setTranscript(prev => {
          const last = prev[prev.length - 1]
          if (last && last.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              { ...last, text: last.text + msg.delta }
            ]
          }
          return [...prev, {
            role: "assistant",
            text: msg.delta,
            timestamp: new Date().toLocaleTimeString()
          }]
        })
      }
    },

    onReceivedResponseDone: (msg) => {
      console.log("Respuesta completada")
      setAiState("listening")
      setStats(prev => ({ 
        ...prev, 
        messages: prev.messages + 1 
      }))
    },

    onReceivedError: (msg) => {
      console.error("Error del servidor:", msg)
    },

    onReceivedExtensionMiddleTierToolResponse: (msg) => {
      console.log("Tool response:", msg)
      setTranscript(prev => [...prev, {
        role: "assistant",
        text: `[Acción ejecutada: ${msg.tool_name}]`,
        timestamp: new Date().toLocaleTimeString()
      }])
    },
  })

  const toggle = useCallback(async () => {
    if (active) {
      console.log("Deteniendo conversación")
      await stopRecording()
      stopAudioPlayer()
      inputAudioBufferClear()
      setActive(false)
      setAiState("listening")
      
      if (startTimeRef.current) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setStats(prev => ({ ...prev, duration }))
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    } else {
      console.log("Iniciando conversación")
      inputAudioBufferClear()
      reset()
      
      setStats({ messages: 0, tokensUsed: 0, duration: 0 })
      startTimeRef.current = Date.now()
      
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setStats(prev => ({ ...prev, duration }))
        }
      }, 1000)
      
      await startRecording()
      setActive(true)
    }
  }, [active, startRecording, stopRecording, inputAudioBufferClear, reset, stopAudioPlayer])

  const resetConversation = () => {
    setTranscript([])
    setStats({ messages: 0, tokensUsed: 0, duration: 0 })
    console.log("Conversación reiniciada")
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

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
            Volver a la tienda
          </Button>
          <h1 className="text-xl font-bold">Asistente Virtual IA</h1>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel izquierdo - Controles */}
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-center">Asistente Virtual</h2>
              
              <div className="flex flex-col items-center gap-6">
                {/* Orbe animado */}
                <div 
                  onClick={toggle}
                  className="cursor-pointer transition-transform hover:scale-105"
                  title={active ? "Click para detener" : "Click para iniciar"}
                >
                  <AIOrb isActive={active} isTalking={aiState === "talking"} />
                </div>

                {/* Estado */}
                <div className="text-center">
                  {active ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-medium text-emerald-600">
                          {aiState === "listening" ? "Escuchando..." : "Respondiendo..."}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">Habla con naturalidad</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-neutral-600">Click en el orbe para comenzar</p>
                      <p className="text-xs text-neutral-400">Presiona cuando estés listo</p>
                    </div>
                  )}
                </div>

                {/* Botón detener (opcional cuando está activo) */}
                {active && (
                  <button
                    onClick={toggle}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-full transition"
                  >
                    Detener conversación
                  </button>
                )}

                {!active && transcript.length > 0 && (
                  <button
                    onClick={resetConversation}
                    className="text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    Reiniciar conversación
                  </button>
                )}
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">¿Qué puedo hacer?</h3>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                <p>• Buscar información sobre medicamentos</p>
                <p>• Ayudarte a agendar citas médicas</p>
                <p>• Responder preguntas sobre productos</p>
              </div>
            </div>
          </div>

          {/* Panel derecho - Transcripción */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Transcripción en Tiempo Real</h3>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {transcript.length === 0 ? (
                <div className="text-center text-neutral-400 py-12">
                  Las conversaciones aparecerán aquí...
                  <p className="text-sm mt-2">Presiona el botón para comenzar</p>
                </div>
              ) : (
                transcript.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-50 dark:bg-blue-900/20 ml-8"
                        : "bg-emerald-50 dark:bg-emerald-900/20 mr-8"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold">
                        {msg.role === "user" ? "Tú" : "Asistente"}
                      </span>
                      <span className="text-xs text-neutral-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}