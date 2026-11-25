import { useSyncExternalStore } from 'react'

/** Façon d'envoyer les messages aux clients : WhatsApp ou SMS. Le choix est gardé sur cet appareil. */
export type Mode = 'whatsapp' | 'sms'
const CLE = 'messagerie'
const abonnes = new Set<() => void>()

export function getMode(): Mode {
  try { return localStorage.getItem(CLE) === 'sms' ? 'sms' : 'whatsapp' } catch { return 'whatsapp' }
}
export function setMode(m: Mode) {
  try { localStorage.setItem(CLE, m) } catch { /* stockage indisponible */ }
  abonnes.forEach((f) => f())
}
export function useMode(): Mode {
  return useSyncExternalStore((f) => { abonnes.add(f); return () => { abonnes.delete(f) } }, getMode, () => 'whatsapp' as Mode)
}
