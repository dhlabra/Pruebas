import { useCallback, useEffect, useRef, useState } from "react";
import AIOrb from "@/components/AIOrb";
import useRealtime from "@/hooks/useRealtime";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import useAudioRecorder from "@/hooks/useAudioRecorder";

const WS_URL = import.meta.env.VITE_FRIDA_WS_URL || "wss://frida-realtime.rosassebastian.com/realtime";
const TOKEN = import.meta.env.VITE_FRIDA_TOKEN as string | undefined;

const DEFAULT_PROMPT = `Eres un asistente virtual de una farmacia en línea. Ayudas a los clientes a:

1. Buscar y agregar productos al carrito
2. Programar citas médicas
3. Responder preguntas sobre productos y servicios

Sé amigable, profesional y confirma cada acción que realices.
Cuando agregues productos, pregunta si desean algo más.
Cuando programes citas, confirma fecha, hora y tipo de consulta.`;

export default function AsistenteIA() {
  const [active, setActive] = useState(false);
  const [aiState, setAiState] = useState<"listening" | "talking">("listening");
  
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  
  const [transcript, setTranscript] = useState<{role: "user" | "assistant", text: string, timestamp: string}[]>([]);
  
  const [stats, setStats] = useState({
    messages: 0,
    tokensUsed: 0,
    duration: 0,
  });
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout>();

  const { reset, play, stop: stopAudioPlayer } = useAudioPlayer();

  const onAudioRecorded = useCallback((b64: string) => {
    if (!b64 || b64.length < 5) return;
    addUserAudio(b64);
  }, []);

  const { start: startRecording, stop: stopRecording } = useAudioRecorder({
    onAudioRecorded,
  });

  const { startSession, addUserAudio, inputAudioBufferClear } = useRealtime({
    url: WS_URL,
    token: TOKEN,
    enableInputAudioTranscription: true,

    onWebSocketOpen: () => {
      console.log("WebSocket conectado");
      startTimeRef.current = Date.now();
      startSession({
        voiceChoice: "alloy",
        systemMessage: systemPrompt,
        kbId: "default",
      });
    },

    onWebSocketClose: () => {
      console.log("WebSocket desconectado");
    },

    onWebSocketError: (event) => {
      console.error("Error WebSocket:", event);
    },

    onWebSocketMessage: (event) => {
      try {
        const msg = JSON.parse(event.data);
        
        if (msg.type === "error") {
          console.error("Error:", msg);
          if (msg.error?.message?.includes("token") || msg.message?.includes("token")) {
            alert("Límite de tokens alcanzado. Reinicia la conversación.");
            if (active) {
              stopRecording();
              stopAudioPlayer();
              setActive(false);
            }
          }
        }
        
        if (msg.type === "response.done" && msg.response?.usage) {
          const usage = msg.response.usage;
          setStats(prev => ({
            ...prev,
            tokensUsed: prev.tokensUsed + (usage.total_tokens || 0)
          }));
        }
      } catch (e) {}
    },

    onReceivedInputAudioBufferSpeechStarted: () => {
      console.log("Usuario empezó a hablar");
      stopAudioPlayer();
      setAiState("listening");
    },

    onReceivedInputAudioTranscriptionCompleted: (msg) => {
      console.log("Usuario dijo:", msg.transcript);
      setTranscript(prev => [...prev, {
        role: "user",
        text: msg.transcript,
        timestamp: new Date().toLocaleTimeString()
      }]);
    },

    onReceivedResponseAudioDelta: (msg) => {
      if (msg.delta) {
        play(msg.delta);
        setAiState("talking");
      }
    },

    onReceivedResponseAudioTranscriptDelta: (msg) => {
      if (msg.delta) {
        setTranscript(prev => {
          const last = prev[prev.length - 1];
          if (last && last.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              { ...last, text: last.text + msg.delta }
            ];
          }
          return [...prev, {
            role: "assistant",
            text: msg.delta,
            timestamp: new Date().toLocaleTimeString()
          }];
        });
      }
    },

    onReceivedResponseDone: (msg) => {
      console.log("Respuesta completada");
      setAiState("listening");
      setStats(prev => ({ 
        ...prev, 
        messages: prev.messages + 1 
      }));
    },

    onReceivedError: (msg) => {
      console.error("Error del servidor:", msg);
    },

    onReceivedExtensionMiddleTierToolResponse: (msg) => {
      console.log("Tool response:", msg);
      setTranscript(prev => [...prev, {
        role: "assistant",
        text: `[Acción ejecutada: ${msg.tool_name}]`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    },
  });

  const toggle = useCallback(async () => {
    if (active) {
      console.log("Deteniendo conversación");
      await stopRecording();
      stopAudioPlayer();
      inputAudioBufferClear();
      setActive(false);
      setAiState("listening");
      
      if (startTimeRef.current) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setStats(prev => ({ ...prev, duration }));
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else {
      console.log("Iniciando conversación");
      inputAudioBufferClear();
      reset();
      
      setStats({ messages: 0, tokensUsed: 0, duration: 0 });
      startTimeRef.current = Date.now();
      
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setStats(prev => ({ ...prev, duration }));
        }
      }, 1000);
      
      await startRecording();
      setActive(true);
    }
  }, [active, startRecording, stopRecording, inputAudioBufferClear, reset, stopAudioPlayer]);

  const resetConversation = () => {
    setTranscript([]);
    setStats({ messages: 0, tokensUsed: 0, duration: 0 });
    console.log("Conversación reiniciada");
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Asistente IA</h1>
          <p className="text-sm text-neutral-400">Pruebas de conversación por texto y voz.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Control de Voz</h2>
            
            <div className="flex flex-col items-center gap-6">
              <div 
                onClick={toggle}
                className="cursor-pointer transition-transform hover:scale-105"
                title={active ? "Click para detener" : "Click para iniciar"}
              >
                <AIOrb isActive={active} isTalking={aiState === "talking"} />
              </div>

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
            <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{stats.messages}</div>
                <div className="text-xs text-neutral-500 mt-1">Mensajes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.duration}s</div>
                <div className="text-xs text-neutral-500 mt-1">Duración</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{stats.tokensUsed}</div>
                <div className="text-xs text-neutral-500 mt-1">Tokens</div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-500">Uso de tokens</span>
                <span className="font-medium">{stats.tokensUsed} / ~6,000</span>
              </div>
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    stats.tokensUsed < 4000 ? 'bg-emerald-500' :
                    stats.tokensUsed < 5500 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((stats.tokensUsed / 6000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">System Prompt</h3>
              <button
                onClick={() => setShowPromptEditor(!showPromptEditor)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showPromptEditor ? "Ocultar" : "Editar"}
              </button>
            </div>
            
            {showPromptEditor && (
              <div className="space-y-3">
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full h-40 p-3 text-sm border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 bg-background"
                  placeholder="Escribe las instrucciones para la IA..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setSystemPrompt(DEFAULT_PROMPT)}
                    className="px-3 py-1 text-sm border rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Restaurar default
                  </button>
                  <div className="text-xs text-neutral-500 flex items-center">
                    Reinicia la conversación para aplicar cambios
                  </div>
                </div>
              </div>
            )}
            
            {!showPromptEditor && (
              <p className="text-sm text-neutral-500 line-clamp-3">{systemPrompt}</p>
            )}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Transcripción en Tiempo Real</h3>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {transcript.length === 0 ? (
              <div className="text-center text-neutral-400 py-12">
                Las conversaciones aparecerán aquí...
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
                      {msg.role === "user" ? "Usuario" : "Asistente"}
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
    </div>
  );
}