-- ============================================
-- SCRIPT DE BASE DE DATOS PARA SUPABASE
-- Agenda Semanal
-- ============================================

-- Tabla de slots (celdas de la agenda)
CREATE TABLE slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day DATE NOT NULL,
  hour TEXT NOT NULL,
  color TEXT NOT NULL,
  label TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day, hour)
);

-- Tabla de configuración (para guardar el fingerprint del dueño)
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  owner_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_slots_day_hour ON slots(day, hour);
CREATE INDEX idx_slots_day ON slots(day);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_slots_updated_at
    BEFORE UPDATE ON slots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (permitir lectura/escritura a todos)
CREATE POLICY "Allow public read access on slots"
  ON slots FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access on slots"
  ON slots FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access on slots"
  ON slots FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access on slots"
  ON slots FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access on settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access on settings"
  ON settings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access on settings"
  ON settings FOR UPDATE
  USING (true);

-- Comentarios descriptivos
COMMENT ON TABLE slots IS 'Almacena las celdas configuradas de la agenda semanal';
COMMENT ON TABLE settings IS 'Configuración global de la aplicación, incluyendo el fingerprint del dueño';
COMMENT ON COLUMN slots.day IS 'Fecha de la celda (formato: YYYY-MM-DD)';
COMMENT ON COLUMN slots.hour IS 'Hora de la celda (formato: HH:MM)';
COMMENT ON COLUMN slots.color IS 'Color pastel seleccionado para la celda';
COMMENT ON COLUMN slots.label IS 'Etiqueta de texto mostrada en la celda';
COMMENT ON COLUMN slots.updated_by IS 'Fingerprint del dispositivo que actualizó la celda';
COMMENT ON COLUMN settings.owner_fingerprint IS 'Fingerprint del dispositivo dueño (primer acceso)';
