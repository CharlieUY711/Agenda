'use client';

import { useState, useEffect } from 'react';
import { getOwnerFingerprint, setOwnerFingerprint } from '@/lib/database';
import { useFingerprint } from './useFingerprint';

export function useOwner() {
  const { fingerprint, isLoading: fingerprintLoading } = useFingerprint();
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkOwnership() {
      if (!fingerprint || fingerprintLoading) return;

      const ownerFingerprint = await getOwnerFingerprint();

      if (!ownerFingerprint) {
        // Si no hay dueño, este es el primer usuario y se convierte en dueño
        await setOwnerFingerprint(fingerprint);
        setIsOwner(true);
      } else {
        // Verificar si este fingerprint es el dueño
        setIsOwner(ownerFingerprint === fingerprint);
      }

      setIsLoading(false);
    }

    checkOwnership();
  }, [fingerprint, fingerprintLoading]);

  return { isOwner, isLoading };
}
