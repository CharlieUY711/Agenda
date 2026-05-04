import { supabase } from './supabase';
import { Slot } from '@/types';
import { startOfWeek, endOfWeek, format } from 'date-fns';

export async function getWeeklySlots(date: Date): Promise<Slot[]> {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // lunes
  const end = endOfWeek(date, { weekStartsOn: 1 });

  const { data, error } = await supabase
    .from('slots')
    .select('*')
    .gte('day', format(start, 'yyyy-MM-dd'))
    .lte('day', format(end, 'yyyy-MM-dd'));

  if (error) {
    console.error('Error fetching slots:', error);
    return [];
  }

  return data || [];
}

export async function toggleSlot(
  day: string,
  hour: string,
  fingerprint: string,
  color: string,
  label: string
): Promise<Slot | null> {
  // Primero verificar si existe un slot
  const { data: existing } = await supabase
    .from('slots')
    .select('*')
    .eq('day', day)
    .eq('hour', hour)
    .single();

  if (existing) {
    // Si existe, actualizar
    const { data, error } = await supabase
      .from('slots')
      .update({
        color,
        label,
        updated_by: fingerprint,
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating slot:', error);
      return null;
    }

    return data;
  } else {
    // Si no existe, crear
    const { data, error } = await supabase
      .from('slots')
      .insert({
        day,
        hour,
        color,
        label,
        updated_by: fingerprint,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating slot:', error);
      return null;
    }

    return data;
  }
}

export async function deleteSlot(day: string, hour: string): Promise<boolean> {
  const { error } = await supabase
    .from('slots')
    .delete()
    .eq('day', day)
    .eq('hour', hour);

  if (error) {
    console.error('Error deleting slot:', error);
    return false;
  }

  return true;
}

export async function getOwnerFingerprint(): Promise<string | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('owner_fingerprint')
    .single();

  if (error) {
    console.error('Error fetching owner:', error);
    return null;
  }

  return data?.owner_fingerprint || null;
}

export async function setOwnerFingerprint(fingerprint: string): Promise<boolean> {
  const { error } = await supabase
    .from('settings')
    .upsert({ id: 1, owner_fingerprint: fingerprint });

  if (error) {
    console.error('Error setting owner:', error);
    return false;
  }

  return true;
}
