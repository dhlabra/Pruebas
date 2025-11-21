"use client";

import { useCallback, useRef, useState } from "react";
import useRealtime from "@/hooks/useRealtime";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import useAudioRecorder from "@/hooks/useAudioRecorder";

// Lee del .env
const WS_URL = process.env.NEXT_PUBLIC_FRIDA_WS_URL || "wss://frida-realtime.rosassebastian.com/realtime";
const TOKEN = process.env.NEXT_PUBLIC_FRIDA_TOKEN as string | undefined;

export default function Agent() {
  const [active, setActive] = useState(false);
  const [aiState, setAiState] = useState<"listening" | "talking">("listening");

  const { reset, play, stop: stopAudioPlayer } = useAudioPlayer();

  const onAudioRecorded = useCallback((b64: string) => {
    if (!b64 || b64.length < 5) return;
    addUserAudio(b64);
    console.log("📤 Audio enviado al servidor");
  }, []);

  const { start: startRecording, stop: stopRecording } = useAudioRecorder({
    onAudioRecorded,
  });

  const { startSession, addUserAudio, inputAudioBufferClear } = useRealtime({
    url: WS_URL,
    token: TOKEN,

    onWebSocketOpen: () => {
      console.log("✅ WebSocket conectado");
      // Configuración inicial de la sesión
      startSession({
        voiceChoice: "alloy",
        systemMessage: "Eres un asistente útil y amigable.",
        kbId: "default",
      });
    },

    onWebSocketClose: () => {
      console.log("WebSocket desconectado");
    },

    onWebSocketError: (event) => {
      console.error("Error WebSocket:", event);
    },

    onReceivedInputAudioBufferSpeechStarted: () => {
      console.log("🎤 Usuario empezó a hablar");
      stopAudioPlayer();
      setAiState("listening");
    },

    onReceivedResponseAudioDelta: (msg) => {
      console.log("🎵 Audio delta recibido:", msg.delta?.substring(0, 30));
      if (msg.delta) {
        play(msg.delta);
        setAiState("talking");
      }
    },

    onReceivedResponseDone: () => {
      console.log("Respuesta completada");
      setAiState("listening");
    },

    onReceivedError: (msg) => {
      console.error("Error del servidor:", msg);
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
    } else {
      console.log("Iniciando conversación");
      inputAudioBufferClear();
      reset();
      await startRecording();
      setActive(true);
    }
  }, [active, startRecording, stopRecording, inputAudioBufferClear, reset, stopAudioPlayer]);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h2 className="text-xl font-semibold">Asistente por voz</h2>

      <button
        onClick={toggle}
        className={`rounded-full px-6 py-3 text-white font-medium transition
        ${active ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
      >
        {active ? "Detener" : "Hablar"}
      </button>

      <div className="text-sm text-zinc-500">
        {active ? (
          <>
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
            {aiState === "listening" ? "Escuchando..." : "IA hablando..."}
          </>
        ) : (
          "Listo"
        )}
      </div>
    </div>
  );
}