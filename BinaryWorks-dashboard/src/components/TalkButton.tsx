// src/components/TalkButton.tsx
import { useCallback, useRef, useState } from "react";
import useRealtime from "@/hooks/useRealtime";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { Mic, Square } from "lucide-react";

const WS_URL = import.meta.env.VITE_FRIDA_WS_URL as string;
const TOKEN = import.meta.env.VITE_FRIDA_TOKEN as string | undefined;

export default function TalkButton() {
  const [active, setActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false); 
  const sentChunksRef = useRef(0);

  const { reset, play, stop: stopAudioPlayer } = useAudioPlayer();

  // callback cuando se graba audio
  const onAudioRecorded = useCallback((b64: string) => {
    if (!b64 || b64.length < 50) return;
    addUserAudio(b64);
    sentChunksRef.current += 1;
    console.log("Audio enviado, chunks:", sentChunksRef.current);
  }, []);

  // Hook de grabacion
  const { start, stop } = useAudioRecorder({
    onAudioRecorded,
  });

  // Hook de realtime
  const { startSession, addUserAudio, inputAudioBufferClear } = useRealtime({
    url: WS_URL,
    token: TOKEN,
    
    onWebSocketOpen: () => {
      console.log("WebSocket conectado");
      startSession({
        voiceChoice: "echo",
        systemMessage: "Asistente por voz.",
        kbId: "default",
      });
    },

    onReceivedInputAudioBufferSpeechStarted: () => {
      console.log("Usuario empezó a hablar");
      stopAudioPlayer();
    },

    onReceivedResponseAudioDelta: (msg) => {
      console.log("🎵 Audio delta recibido:", msg.delta?.substring(0, 30));
      if (msg.delta) {
        play(msg.delta);
      }
    },

    onReceivedResponseDone: () => {
      console.log("Respuesta completada");
    },

    onReceivedError: (msg) => {
      console.error("Error:", msg);
    },
  });

  const handleToggle = useCallback(async () => {
    if (!active) {
      console.log("▶Iniciando conversación");
      inputAudioBufferClear();
      sentChunksRef.current = 0;
      reset();
      await start();
      setActive(true);
      setIsRecording(true); 
    } else {
      console.log("Deteniendo conversación");
      await stop();
      stopAudioPlayer();
      setActive(false);
      setIsRecording(false); 
    }
  }, [active, inputAudioBufferClear, start, stop, reset, stopAudioPlayer]);

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition
        ${active ? "bg-red-600 hover:bg-red-500 text-white" : "bg-primary hover:opacity-90 text-white"}`}
      title={active ? "Detener" : "Iniciar conversación"}
    >
      {active ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      {active ? "Detener" : "Hablar"}
      {isRecording && (
        <span className="ml-2 text-xs opacity-80">
          <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-1"></span>
          grabando...
        </span>
      )}
    </button>
  );
}