'use client';

import { useState, useEffect } from 'react';

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function generateFingerprint() {
      // Crear fingerprint basado en características del navegador
      const userAgent = navigator.userAgent;
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const language = navigator.language;
      
      // Combinar todas las características
      const rawFingerprint = `${userAgent}-${screenWidth}x${screenHeight}-${timezone}-${language}`;
      
      // Crear un hash simple
      const hash = await hashString(rawFingerprint);
      
      setFingerprint(hash);
      setIsLoading(false);
    }

    generateFingerprint();
  }, []);

  return { fingerprint, isLoading };
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
