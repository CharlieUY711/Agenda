import { supabase } from './supabase';
import { Slot } from '@/types';
import { startOfWeek, endOfWeek, format } from 'date-fns';

export async function getWeeklySlots(date: Date): Promise<Slot[]> {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // lunes
  const end = endOfWeek(date, { weekStartsOn: 1 });

  console.log('Fetching slots from', format(start, 'yyyy-MM-dd'), 'to', format(end, 'yyyy-MM-dd'));

  const { data, error } = await supabase
    .from('slots')
    .select('*')
    .gte('day', format(start, 'yyyy-MM-dd'))
    .lte('day', format(end, 'yyyy-MM-dd'));

  if (error) {
    console.error('Error fetching slots:', error);
    return [];
  }

  console.log('Fetched slots:', data?.length || 0);
  return data || [];
}

export async function toggleSlot(
  day: string,
  hour: string,
  fingerprint: string,
  color: string,
  label: string
): Promise<Slot | null> {
  console.log('toggleSlot called with:', { day, hour, fingerprint, color, label });

  // Primero verificar si existe un slot
  const { data: existing, error: fetchError } = await supabase
    .from('slots')
    .select('*')
    .eq('day', day)
    .eq('hour', hour)
    .maybeSingle();

  if (fetchError) {
    console.error('Error checking existing slot:', fetchError);
    return null;
  }

  console.log('Existing slot:', existing);

  if (existing) {
    // Si existe, actualizar
    console.log('Updating existing slot with id:', existing.id);
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

    console.log('Slot updated successfully:', data);
    return data;
  } else {
    // Si no existe, crear
    console.log('Creating new slot');
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

    console.log('Slot created successfully:', data);
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
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching owner:', error);
    return null;
  }

  console.log('Owner fingerprint from DB:', data?.owner_fingerprint);
  return data?.owner_fingerprint || null;
}

export async function setOwnerFingerprint(fingerprint: string): Promise<boolean> {
  console.log('Setting owner fingerprint:', fingerprint);
  
  const { error } = await supabase
    .from('settings')
    .upsert({ id: 1, owner_fingerprint: fingerprint }, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('Error setting owner:', error);
    return false;
  }

  console.log('Owner fingerprint set successfully');
  return true;
}
