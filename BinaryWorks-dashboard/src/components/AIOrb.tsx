import { useEffect, useRef } from "react"

type OrbProps = {
  isActive: boolean
  isTalking: boolean
}

export default function AIOrb({ isActive, isTalking }: OrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const baseRadius = 80
    let frame = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Estado: Inactivo
      if (!isActive) {
        drawIdleOrb(ctx, centerX, centerY, baseRadius, frame)
      }
      // Estado: Hablando
      else if (isTalking) {
        drawTalkingOrb(ctx, centerX, centerY, baseRadius, frame)
      }
      // Estado: Escuchando
      else {
        drawListeningOrb(ctx, centerX, centerY, baseRadius, frame)
      }

      frame += 0.05
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, isTalking])

  // Orbe inactivo - respiración suave
  const drawIdleOrb = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, frame: number) => {
    const breathe = Math.sin(frame) * 5
    const currentRadius = radius + breathe

    // Glow exterior
    const gradient = ctx.createRadialGradient(x, y, currentRadius * 0.3, x, y, currentRadius * 1.5)
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.4)")
    gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.1)")
    gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, currentRadius * 1.5, 0, Math.PI * 2)
    ctx.fill()

    // Orbe principal
    const mainGradient = ctx.createRadialGradient(x, y, 0, x, y, currentRadius)
    mainGradient.addColorStop(0, "rgba(96, 165, 250, 0.8)")
    mainGradient.addColorStop(0.7, "rgba(59, 130, 246, 0.6)")
    mainGradient.addColorStop(1, "rgba(37, 99, 235, 0.3)")
    
    ctx.fillStyle = mainGradient
    ctx.beginPath()
    ctx.arc(x, y, currentRadius, 0, Math.PI * 2)
    ctx.fill()
  }

  // Orbe escuchando - pulsos hacia adentro
  const drawListeningOrb = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, frame: number) => {
    // Ondas que entran (más lentas)
    for (let i = 0; i < 3; i++) {
      const waveRadius = radius * 1.5 - (frame * 15 + i * 40) % (radius * 2) // Cambié de 30 a 15 (más lento)
      const alpha = 1 - ((frame * 15 + i * 40) % (radius * 2)) / (radius * 2)
      
      if (waveRadius > 0) {
        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 0.5})`
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(x, y, waveRadius, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // Orbe principal con pulso (más lento)
    const pulse = Math.sin(frame * 1.5) * 10 // Cambié de 3 a 1.5 (más lento)
    const currentRadius = radius + pulse

    const mainGradient = ctx.createRadialGradient(x, y, 0, x, y, currentRadius)
    mainGradient.addColorStop(0, "rgba(52, 211, 153, 0.9)")
    mainGradient.addColorStop(0.6, "rgba(16, 185, 129, 0.7)")
    mainGradient.addColorStop(1, "rgba(5, 150, 105, 0.4)")
    
    ctx.fillStyle = mainGradient
    ctx.beginPath()
    ctx.arc(x, y, currentRadius, 0, Math.PI * 2)
    ctx.fill()

    // Glow
    const glowGradient = ctx.createRadialGradient(x, y, currentRadius * 0.5, x, y, currentRadius * 1.8)
    glowGradient.addColorStop(0, "rgba(16, 185, 129, 0.3)")
    glowGradient.addColorStop(1, "rgba(16, 185, 129, 0)")
    
    ctx.fillStyle = glowGradient
    ctx.beginPath()
    ctx.arc(x, y, currentRadius * 1.8, 0, Math.PI * 2)
    ctx.fill()
  }

  // Orbe hablando - ondas expansivas
  const drawTalkingOrb = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, frame: number) => {
    // Ondas que se expanden (más lentas)
    for (let i = 0; i < 4; i++) {
      const waveRadius = (frame * 20 + i * 50) % (radius * 3) // Cambié de 40 a 20 (más lento)
      const alpha = 1 - waveRadius / (radius * 3)
      
      ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 0.6})`
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.arc(x, y, waveRadius, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Orbe principal animado (deformación más lenta)
    const deform = Math.sin(frame * 2.5) * 8 // Cambié de 5 a 2.5 (más lento)
    
    ctx.save()
    ctx.translate(x, y)
    
    // Forma deformada
    const mainGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius + deform)
    mainGradient.addColorStop(0, "rgba(52, 211, 153, 1)")
    mainGradient.addColorStop(0.5, "rgba(16, 185, 129, 0.8)")
    mainGradient.addColorStop(1, "rgba(5, 150, 105, 0.5)")
    
    ctx.fillStyle = mainGradient
    ctx.beginPath()
    
    // Crear forma orgánica con múltiples puntos (variación más lenta)
    const points = 8
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2
      const variation = Math.sin(frame * 1.5 + i) * 10 // Cambié de 3 a 1.5 (más lento)
      const r = radius + deform + variation
      const px = Math.cos(angle) * r
      const py = Math.sin(angle) * r
      
      if (i === 0) {
        ctx.moveTo(px, py)
      } else {
        ctx.lineTo(px, py)
      }
    }
    ctx.closePath()
    ctx.fill()
    
    ctx.restore()

    // Brillo intenso
    const glowGradient = ctx.createRadialGradient(x, y, radius * 0.3, x, y, radius * 2.5)
    glowGradient.addColorStop(0, "rgba(16, 185, 129, 0.5)")
    glowGradient.addColorStop(0.5, "rgba(16, 185, 129, 0.2)")
    glowGradient.addColorStop(1, "rgba(16, 185, 129, 0)")
    
    ctx.fillStyle = glowGradient
    ctx.beginPath()
    ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2)
    ctx.fill()
  }

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="max-w-full"
      />
    </div>
  )
}