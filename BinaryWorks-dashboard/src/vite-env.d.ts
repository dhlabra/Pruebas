/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FRIDA_WS_URL: string
  readonly VITE_FRIDA_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
