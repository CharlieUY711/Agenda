import { supabase } from './supabase';
import { Slot, PastelColor, Label } from '@/types';
import { startOfWeek, endOfWeek, format } from 'date-fns';

// Obtener el fingerprint del dueño desde la tabla settings
export async function getOwnerFingerprint(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('owner_fingerprint')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error al obtener owner fingerprint:', error);
      return null;
    }

    return data?.owner_fingerprint || null;
  } catch (error) {
    console.error('Error en getOwnerFingerprint:', error);
    return null;
  }
}

// Establecer el fingerprint del dueño
export async function setOwnerFingerprint(fingerprint: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 1, owner_fingerprint: fingerprint });

    if (error) {
      console.error('Error al establecer owner fingerprint:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error en setOwnerFingerprint:', error);
    return false;
  }
}

// Obtener los slots de una semana específica
export async function getWeeklySlots(date: Date): Promise<Slot[]> {
  try {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Lunes
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 }); // Domingo

    const startStr = format(weekStart, 'yyyy-MM-dd');
    const endStr = format(weekEnd, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .gte('day', startStr)
      .lte('day', endStr);

    if (error) {
      console.error('Error al obtener slots:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en getWeeklySlots:', error);
    return [];
  }
}

// Crear o actualizar un slot
export async function toggleSlot(
  day: string,
  hour: string,
  fingerprint: string,
  color: PastelColor,
  label: Label
): Promise<Slot | null> {
  try {
    // Verificar si ya existe un slot para este día y hora
    const { data: existing } = await supabase
      .from('slots')
      .select('*')
      .eq('day', day)
      .eq('hour', hour)
      .single();

    if (existing) {
      // Si existe, eliminarlo (toggle off)
      const { error: deleteError } = await supabase
        .from('slots')
        .delete()
        .eq('day', day)
        .eq('hour', hour);

      if (deleteError) {
        console.error('Error al eliminar slot:', deleteError);
        return null;
      }

      return null; // Retornar null indica que se eliminó
    } else {
      // Si no existe, crearlo
      const newSlot = {
        day,
        hour,
        color,
        label,
        updated_by: fingerprint,
      };

      const { data, error } = await supabase
        .from('slots')
        .insert(newSlot)
        .select()
        .single();

      if (error) {
        console.error('Error al crear slot:', error);
        return null;
      }

      return data;
    }
  } catch (error) {
    console.error('Error en toggleSlot:', error);
    return null;
  }
}

// Eliminar todos los slots (útil para limpiar la agenda)
export async function clearAllSlots(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('slots')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todos

    if (error) {
      console.error('Error al limpiar slots:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error en clearAllSlots:', error);
    return false;
  }
}