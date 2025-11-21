# BinaryWorks - MediLink
# Agente Conversacional Multicanal + Analítica Predictiva
Plataforma para farmacias que implementa agentes conversacionales de voz y texto con soporte multicanal y analítica predictiva. Permite a las empresas mejorar la experiencia de sus clientes a la hora de comprar medicamentos o agendar una cita médica, integrando datos y métricas de satisfacción.

---

## Canales soportados
- Web → Chat embebido en navegador.
- WhatsApp y llamadas → Integración vía Twilio.
- Correo electrónico → IMAP/SMTP, SendGrid o similar.
- Voz en navegador → Google Speech-to-Text/ElevenLabs.

---

## Arquitectura y módulos clave
- **Orquestador conversacional**  
  Motor de flujos en JSON/YAML editable por administradores.  
  Controla las interacciones y define qué canal y respuesta utilizar.

- **MCP agent hub**  
  Conecta agentes a herramientas externas e internas:  
  - CRM (Salesforce, HubSpot)  
  - Bases de datos  
  - APIs internas

- **Dashboard analítico**  
  Métricas en tiempo real de satisfacción, retención y conversión.  
  Exportación a PDF/Excel para reportes.

- **Predicción de churn**  
  El sistema analiza interacciones pasadas para anticipar pérdida de clientes y sugerir estrategias de retención.

- **Análisis de sentimiento**  
  Ajuste del tono de respuesta en tiempo real.

- **FAQ inteligente con autoaprendizaje**  
  Actualiza la base de conocimiento a partir de conversaciones exitosas.

- **Multi-tenant**  
  Un solo despliegue para múltiples empresas, con roles y permisos por organización.

---

## Tecnologías y componentes
### Frontend
- React + Vite
- WebRTC para comunicación de voz en navegador  

### Backend
- Firebase → Autenticación, hosting estático, funciones serverless   
- PostgreSQL → Datos históricos, métricas, configuraciones  
- MCP Server → Conexión con CRM, bases de datos y APIs internas  

### Integraciones
- Twilio → WhatsApp & llamadas  
- SendGrid → Correo electrónico  
- Google Speech-to-Text / ElevenLabs → Reconocimiento y generación de voz  

---

## Autores
María José Vital Castillo A01424084@tec.mx

Rodolfo Vega Dominguez A01566896@tec.mx

Alejandro Ramos Chávez A01284006@tec.mx

David H. Labra Méndez A01611973@tec.mx
