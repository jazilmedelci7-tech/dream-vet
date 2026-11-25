import { smsLink, waLink } from '../whatsapp'
import { useMode } from '../messagerie'

/** Ouvre WhatsApp ou l'application SMS (au choix du cabinet, voir le sélecteur du menu) avec le message prêt : il reste à appuyer sur « Envoyer ». */
export function WhatsAppButton({ tel, text, label = 'WhatsApp', className = '' }: { tel: string; text: string; label?: string; className?: string }) {
  const mode = useMode()
  const sms = mode === 'sms'
  const href = text ? (sms ? smsLink(tel, text) : waLink(tel, text)) : null
  const nom = sms ? label.replace('WhatsApp', 'SMS') : label
  const base = sms ? 'btn btn-sm border border-brand bg-white text-brand hover:bg-brand-light' : 'btn btn-sm border border-green-600 bg-white text-green-700 hover:bg-green-50'
  if (!href) return <span title={text ? 'Numéro de téléphone manquant ou invalide' : 'Rien à envoyer'} className={`${base} cursor-not-allowed opacity-50 ${className}`} aria-disabled="true">{nom}</span>
  return <a href={href} target={sms ? undefined : '_blank'} rel="noopener noreferrer" className={`${base} ${className}`}>{nom}</a>
}
