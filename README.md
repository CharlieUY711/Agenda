# 🌸 Agenda Semanal - Diseño Femenino y Alegre

Una agenda semanal interactiva con diseño femenino, colores pasteles y fondo blanco. Perfecta para organizar tu semana de manera visual y alegre.

## ✨ Características

- 📅 Vista semanal completa (Lunes a Domingo, 08:00 - 20:00)
- 🎨 Paleta de colores pasteles (rosa, lila, celeste, menta, amarillo, durazno)
- 🏷️ Etiquetas personalizables para cada celda
- 🔒 Detección automática de dispositivo (dueño vs visitante)
- 💾 Persistencia en Supabase
- 📱 Diseño responsive y mobile-friendly
- ✨ Animaciones suaves con Framer Motion

## 🚀 Instalación Local

### Prerrequisitos

- Node.js 18+ instalado
- Una cuenta en [Supabase](https://supabase.com)

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/CharlieUY711/Agenda.git
cd Agenda
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar Supabase

1. Ve a [Supabase](https://supabase.com) y crea un nuevo proyecto
2. Ve a **SQL Editor** y ejecuta el siguiente script para crear las tablas:

```sql
-- Tabla de slots (celdas de la agenda)
CREATE TABLE slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day DATE NOT NULL,
  hour TEXT NOT NULL,
  color TEXT NOT NULL,
  label TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day, hour)
);

-- Tabla de configuración (para guardar el fingerprint del dueño)
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  owner_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_slots_day_hour ON slots(day, hour);
CREATE INDEX idx_slots_day ON slots(day);
```

3. Ve a **Settings → API** y copia:
   - `Project URL`
   - `anon/public` API key

### Paso 4: Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y pega tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### Paso 5: Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🌐 Deploy en Vercel

### Opción 1: Deploy automático desde GitHub

1. Ve a [Vercel](https://vercel.com)
2. Click en **Import Project**
3. Importa tu repositorio de GitHub
4. En **Environment Variables**, agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click en **Deploy**

### Opción 2: Deploy desde la terminal

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno en el dashboard de Vercel
```

## 🎨 Cómo usar la aplicación

### Si eres el dueño (primer dispositivo):
1. Al abrir la app por primera vez, tu dispositivo se registra como "dueño"
2. Toca cualquier celda vacía
3. Selecciona un color de la paleta pastel
4. Elige una etiqueta (Gol, Entrega, Retiro, OK, Listo, ✓, ★, ♥)
5. La celda se pintará con el color y mostrará la etiqueta

### Si eres visitante:
- Solo puedes ver las celdas configuradas
- No puedes editar ni agregar nuevas

## 🏗️ Estructura del Proyecto

```
agenda-semanal/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página home
│   └── globals.css         # Estilos globales
├── components/
│   ├── WeeklyGrid.tsx      # Componente principal de la agenda
│   ├── SlotButton.tsx      # Cada celda de la agenda
│   ├── ColorPickerModal.tsx # Modal para elegir color
│   └── LabelPicker.tsx     # Modal para elegir etiqueta
├── hooks/
│   ├── useFingerprint.ts   # Hook para generar fingerprint del dispositivo
│   └── useOwner.ts         # Hook para verificar si es dueño
├── lib/
│   ├── supabase.ts         # Cliente de Supabase
│   └── database.ts         # Funciones de base de datos
├── types/
│   └── index.ts            # Tipos TypeScript
└── package.json
```

## 🎨 Paleta de Colores

- **Rosa** (#FFD1DC)
- **Lavanda** (#E6E6FA)
- **Celeste** (#B0E0E6)
- **Menta** (#C1FFC1)
- **Amarillo** (#FFFACD)
- **Durazno** (#FFE5B4)
- **Rosa Fuerte** (#FFB6C1)
- **Lila** (#DDA0DD)

## 📝 Etiquetas Disponibles

- Gol
- Entrega
- Retiro
- OK
- Listo
- ✓
- ★
- ♥

## 🔧 Tecnologías Utilizadas

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animaciones)
- **Supabase** (base de datos)
- **date-fns** (manejo de fechas)

## 📱 Detección de Dispositivo

El sistema genera un "fingerprint" único para cada dispositivo basado en:
- User agent del navegador
- Resolución de pantalla
- Zona horaria
- Idioma del navegador

El primer dispositivo que accede se convierte automáticamente en "dueño" y puede editar. Los demás dispositivos solo pueden ver.

## 🐛 Solución de Problemas

### No se guardan los cambios
- Verifica que las variables de entorno estén correctamente configuradas
- Revisa la consola del navegador para errores
- Asegúrate de que las tablas en Supabase estén creadas

### Error al conectar con Supabase
- Verifica que la URL y la API key sean correctas
- Asegúrate de que el proyecto de Supabase esté activo

### Las animaciones no funcionan
- Verifica que Framer Motion esté instalado: `npm install framer-motion`

## 📄 Licencia

MIT

## 💖 Hecho con amor y colores pasteles

Disfruta organizando tu semana con estilo! ✨
