# 🏗️ Arquitectura del Proyecto

## Flujo de Datos

```
Usuario → WeeklyGrid → Hooks (useFingerprint, useOwner) → Database Functions → Supabase
```

## Componentes Principales

### 1. WeeklyGrid (Componente Principal)
- **Responsabilidad**: Renderizar la grilla semanal completa
- **Estado**: Maneja slots, modales, selección de celdas
- **Lógica**: 
  - Carga slots de la semana actual
  - Maneja clicks en celdas
  - Coordina modales de color y etiqueta
  - Actualiza UI cuando cambian los datos

### 2. SlotButton (Celda Individual)
- **Responsabilidad**: Renderizar cada celda de la agenda
- **Props**: día, hora, color, etiqueta, isOwner
- **Interacción**: Click solo si es dueño

### 3. ColorPickerModal
- **Responsabilidad**: Selector de color pastel
- **Animación**: Framer Motion para entrada/salida
- **Colores**: 8 opciones pastel predefinidas

### 4. LabelPicker
- **Responsabilidad**: Selector de etiqueta
- **Opciones**: Gol, Entrega, Retiro, OK, Listo, ✓, ★, ♥

## Hooks Personalizados

### useFingerprint
```typescript
// Genera un hash único del dispositivo
const { fingerprint, isLoading } = useFingerprint();
```

**Componentes del fingerprint**:
- User agent
- Resolución de pantalla
- Zona horaria
- Idioma

### useOwner
```typescript
// Determina si el usuario actual es el dueño
const { isOwner, isLoading } = useOwner();
```

**Lógica**:
1. Obtiene fingerprint actual
2. Consulta fingerprint del dueño en DB
3. Si no hay dueño registrado → este se convierte en dueño
4. Si hay dueño → compara fingerprints

## Base de Datos (Supabase)

### Tabla: slots
```sql
{
  id: uuid,
  day: date,        -- YYYY-MM-DD
  hour: text,       -- HH:MM
  color: text,      -- Nombre del color pastel
  label: text,      -- Texto de la etiqueta
  updated_by: text  -- Fingerprint del dispositivo
}
```

### Tabla: settings
```sql
{
  id: integer,              -- Siempre 1 (singleton)
  owner_fingerprint: text   -- Hash del primer dispositivo
}
```

## Funciones de Base de Datos

### getWeeklySlots(date)
- Obtiene todos los slots de la semana actual
- Usa startOfWeek y endOfWeek de date-fns
- Filtra por rango de fechas

### toggleSlot(day, hour, fingerprint, color, label)
- Busca si existe un slot para ese día/hora
- Si existe → actualiza
- Si no existe → crea nuevo
- Retorna el slot actualizado/creado

### getOwnerFingerprint()
- Obtiene el fingerprint del dueño desde settings
- Si no existe → retorna null

### setOwnerFingerprint(fingerprint)
- Establece el fingerprint como dueño
- Usa upsert para crear/actualizar

## Flujo de Interacción del Usuario

### Usuario es Dueño
```
1. Click en celda
   ↓
2. Se abre ColorPickerModal
   ↓
3. Usuario selecciona color
   ↓
4. Se cierra ColorPickerModal
   ↓
5. Se abre LabelPicker
   ↓
6. Usuario selecciona etiqueta
   ↓
7. Se guarda en Supabase
   ↓
8. Se actualiza UI con color y etiqueta
```

### Usuario es Visitante
```
1. Click en celda → No pasa nada (disabled)
2. Solo puede ver celdas configuradas
```

## Diseño y Estética

### Paleta de Colores Pastel
```javascript
{
  pink: '#FFD1DC',
  lavender: '#E6E6FA',
  blue: '#B0E0E6',
  mint: '#C1FFC1',
  yellow: '#FFFACD',
  peach: '#FFE5B4',
  rose: '#FFB6C1',
  lilac: '#DDA0DD'
}
```

### Tipografía
- **Display**: Quicksand (títulos, etiquetas)
- **Body**: DM Sans (textos, descripciones)

### Animaciones (Framer Motion)
- **Modales**: fade-in + scale
- **Botones**: hover scale 1.05, tap scale 0.95
- **Grid**: stagger animation en carga

### Sombras
```css
shadow-soft: '0 4px 20px rgba(255, 192, 203, 0.15)'
shadow-soft-hover: '0 8px 30px rgba(255, 192, 203, 0.25)'
```

## Seguridad

### Row Level Security (RLS)
- Habilitado en ambas tablas
- Políticas permiten lectura/escritura pública
- Validación de dueño en cliente

### Variables de Entorno
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Nota**: Usar anon key (pública), no service role key

## Performance

### Optimizaciones
- Single query para semana completa
- Unique constraint en (day, hour)
- Índices en columnas de búsqueda
- Client-side caching con useState

### Tamaño del Bundle
- Next.js con tree-shaking automático
- Framer Motion: ~30KB gzipped
- Supabase client: ~50KB gzipped
- Total estimado: ~150KB inicial

## Testing Recomendado

### Tests Unitarios
- `useFingerprint`: Generar hash consistente
- `useOwner`: Lógica de dueño/visitante
- Funciones de database: CRUD operations

### Tests de Integración
- Flujo completo de crear slot
- Cambio de color/etiqueta
- Sincronización con Supabase

### Tests E2E
- Primer usuario se convierte en dueño
- Segundo usuario es visitante
- Persistencia entre sesiones

## Posibles Mejoras Futuras

1. **Modo oscuro**: Toggle entre light/dark
2. **Múltiples semanas**: Navegación entre semanas
3. **Exportar calendario**: Download como PDF/ICS
4. **Notificaciones**: Recordatorios de eventos
5. **Compartir**: Link para compartir agenda
6. **Temas personalizados**: Crear paletas propias
7. **Drag & drop**: Mover eventos entre celdas
8. **Categorías**: Agrupar por tipo de actividad

---

Mantenido con ♥ y café
