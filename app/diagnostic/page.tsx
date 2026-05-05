'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useFingerprint } from '@/hooks/useFingerprint';
import { useOwner } from '@/hooks/useOwner';
import { getOwnerFingerprint, setOwnerFingerprint } from '@/lib/database';

export default function DiagnosticPage() {
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Verificando...');
  const [tablesStatus, setTablesStatus] = useState<string>('Verificando...');
  const [envVars, setEnvVars] = useState<any>({});
  const { fingerprint, isLoading: fpLoading } = useFingerprint();
  const { isOwner, isLoading: ownerLoading } = useOwner();
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    // Verificar variables de entorno
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      keyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
    });

    // Verificar conexión a Supabase
    async function checkSupabase() {
      try {
        const { data, error } = await supabase.from('slots').select('count', { count: 'exact', head: true });
        if (error) {
          setSupabaseStatus('❌ Error: ' + error.message);
        } else {
          setSupabaseStatus('✅ Conectado');
        }
      } catch (err: any) {
        setSupabaseStatus('❌ Error: ' + err.message);
      }

      // Verificar tablas
      try {
        const { data: slotsData, error: slotsError } = await supabase.from('slots').select('*').limit(1);
        const { data: settingsData, error: settingsError } = await supabase.from('settings').select('*').limit(1);
        
        if (slotsError || settingsError) {
          setTablesStatus('❌ Tablas no existen o no son accesibles');
        } else {
          setTablesStatus('✅ Tablas slots y settings existen');
        }
      } catch (err: any) {
        setTablesStatus('❌ Error: ' + err.message);
      }
    }

    checkSupabase();
  }, []);

  const handleTestInsert = async () => {
    setTestResult('Intentando insertar...');
    try {
      const { data, error } = await supabase
        .from('slots')
        .insert({
          day: '2026-05-05',
          hour: '10:00',
          color: 'pink',
          label: 'TEST',
          updated_by: fingerprint || 'test-fp'
        })
        .select()
        .single();

      if (error) {
        setTestResult('❌ Error al insertar: ' + error.message);
      } else {
        setTestResult('✅ Insertado exitosamente: ' + JSON.stringify(data));
      }
    } catch (err: any) {
      setTestResult('❌ Excepción: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Diagnóstico de Conexión</h1>

        {/* Variables de entorno */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Variables de Entorno</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <strong>SUPABASE_URL:</strong> {envVars.url || '❌ NO CONFIGURADA'}
            </div>
            <div>
              <strong>SUPABASE_ANON_KEY:</strong> {envVars.keyPrefix || '❌ NO CONFIGURADA'}
            </div>
          </div>
        </div>

        {/* Estado de Supabase */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Estado de Supabase</h2>
          <div className="space-y-2">
            <div><strong>Conexión:</strong> {supabaseStatus}</div>
            <div><strong>Tablas:</strong> {tablesStatus}</div>
          </div>
        </div>

        {/* Fingerprint */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Fingerprint y Ownership</h2>
          <div className="space-y-2">
            <div><strong>Loading:</strong> {fpLoading ? 'Sí' : 'No'}</div>
            <div><strong>Fingerprint:</strong> {fingerprint || 'Generando...'}</div>
            <div><strong>Es dueño:</strong> {ownerLoading ? 'Verificando...' : (isOwner ? '✅ SÍ' : '❌ NO')}</div>
          </div>
        </div>

        {/* Test de inserción */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Test de Inserción</h2>
          <button
            onClick={handleTestInsert}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mb-4"
          >
            Probar Insertar Slot
          </button>
          <div className="mt-4 p-4 bg-white border border-gray-300 rounded font-mono text-sm whitespace-pre-wrap">
            {testResult || 'Haz click en el botón para probar'}
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">📋 Qué hacer con esta información</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Si las variables de entorno no están configuradas → Crea .env.local</li>
            <li>Si la conexión falla → Verifica las credenciales de Supabase</li>
            <li>Si las tablas no existen → Ejecuta el script SQL en Supabase</li>
            <li>Si el test de inserción falla → Copia el mensaje de error completo</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
