import { useMemo, useState, type FormEvent } from 'react'
import { Clock3, MessageCircle, Plus, Search, Send, ShieldCheck } from 'lucide-react'
import type { WhatsAppConversation } from '../data/mockData'
import { formatDate } from '../lib/utils'

const templates = [
  { id: 'event-update', label: 'Event update · example', body: 'Hello! Here is the event update you asked to receive. Reply if you have any questions.' },
  { id: 'appointment-reminder', label: 'Appointment reminder · example', body: 'A friendly reminder about your upcoming appointment. Reply if you need help.' },
  { id: 'order-status', label: 'Order status · example', body: 'Your order status is ready. Reply if you need assistance.' },
]

interface WhatsAppInboxProps {
  conversations: WhatsAppConversation[]
  onAddContact: (contact: { name: string; phone: string; optedIn: boolean }) => void
  onSaveMessage: (conversationId: string, body: string, kind: 'freeform' | 'template') => void
  onRecordOptIn: (conversationId: string) => void
  onRecordOptOut: (conversationId: string) => void
}

export function WhatsAppInbox({ conversations, onAddContact, onSaveMessage, onRecordOptIn, onRecordOptOut }: WhatsAppInboxProps) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [replyText, setReplyText] = useState('')
  const [templateId, setTemplateId] = useState(templates[0].id)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [hasConsent, setHasConsent] = useState(false)
  const [showOptInForm, setShowOptInForm] = useState(false)
  const [confirmOptIn, setConfirmOptIn] = useState(false)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return conversations.filter(item => !needle || `${item.name} ${item.phone} ${item.messages.at(-1)?.body ?? ''}`.toLowerCase().includes(needle))
  }, [conversations, query])
  const selected = filtered.find(item => item.id === selectedId) ?? filtered[0]
  const withinWindow = isWithinServiceWindow(selected?.lastInboundAt)
  const canMessage = Boolean(selected?.optedIn && !selected.optedOut)

  const addContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!contactName.trim() || !contactPhone.trim()) return
    onAddContact({ name: contactName.trim(), phone: contactPhone.trim(), optedIn: hasConsent })
    setContactName('')
    setContactPhone('')
    setHasConsent(false)
    setIsAddOpen(false)
  }

  const saveMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selected || !canMessage) return
    const kind = withinWindow ? 'freeform' : 'template'
    const body = withinWindow ? replyText.trim() : templates.find(template => template.id === templateId)?.body ?? ''
    if (!body) return
    onSaveMessage(selected.id, body, kind)
    setReplyText('')
  }

  const confirmNewConsent = () => {
    if (!selected || !confirmOptIn) return
    onRecordOptIn(selected.id)
    setConfirmOptIn(false)
  }

  return <div className="whatsapp-page">
    <header className="page-heading"><div className="page-heading-copy"><p className="eyebrow">Business messaging</p><h1>WhatsApp inbox</h1><p>Practice consent-safe customer support locally. These sample threads never contact a phone number.</p></div><button className="button button-primary" type="button" onClick={() => setIsAddOpen(current => !current)}><Plus size={16} aria-hidden="true" />Add contact</button></header>

    <div className="whatsapp-policy-banner"><ShieldCheck size={18} aria-hidden="true" /><div><strong>Consent and timing rules are active</strong><p>Only opted-in contacts can receive a saved reply. Freeform replies require a recent inbound message; outside that 24-hour window, this demo uses example templates. Real WhatsApp delivery also requires approved templates and a Business Platform account.</p></div></div>

    {isAddOpen && <form className="panel add-contact-form" onSubmit={addContact}><div><strong>Add a local contact</strong><span>Record consent status accurately. No message will be sent.</span></div><label><span className="field-label">Name</span><input className="field-control" value={contactName} onChange={event => setContactName(event.target.value)} required placeholder="Contact name" /></label><label><span className="field-label">Phone number</span><input className="field-control" value={contactPhone} onChange={event => setContactPhone(event.target.value)} required placeholder="+1 202 555 0100" type="tel" /></label><label className="consent-checkbox"><input type="checkbox" checked={hasConsent} onChange={event => setHasConsent(event.target.checked)} /><span>This person explicitly opted in to receive WhatsApp messages from this business.</span></label><button className="button button-primary" type="submit">Save contact</button></form>}

    <section className="whatsapp-workspace panel" aria-label="WhatsApp local inbox">
      <aside className="whatsapp-contact-list">
        <div className="whatsapp-list-header"><h2>Conversations</h2><span>{conversations.length}</span></div>
        <label className="search-field"><Search size={16} aria-hidden="true" /><span className="sr-only">Search contacts</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search contacts" /></label>
        <div className="whatsapp-contact-items">{filtered.length ? filtered.map(contact => {
          const last = contact.messages.at(-1)
          const allowed = contact.optedIn && !contact.optedOut
          const open = allowed && isWithinServiceWindow(contact.lastInboundAt)
          return <button className={`whatsapp-contact-item ${selected?.id === contact.id ? 'is-selected' : ''}`} type="button" key={contact.id} onClick={() => { setSelectedId(contact.id); setReplyText(''); setConfirmOptIn(false); setShowOptInForm(false) }}><span className="contact-avatar">{contact.name.slice(0, 1)}</span><span className="whatsapp-contact-copy"><span><strong>{contact.name}</strong><small>{last ? formatDate(last.sentAt) : 'No messages'}</small></span><span className="whatsapp-last-message">{last?.body ?? contact.phone}</span><span className={`status-pill ${open ? 'connected' : allowed ? 'pending' : 'disconnected'}`}>{open ? 'Window open' : allowed ? 'Template only' : 'Opted out'}</span></span></button>
        }) : <div className="empty-state compact-empty"><p>No local contacts found.</p></div>}</div>
      </aside>

      {selected ? <section className="whatsapp-conversation"><header className="whatsapp-conversation-header"><span className="contact-avatar">{selected.name.slice(0, 1)}</span><div><strong>{selected.name}</strong><small>{selected.phone}{selected.sample ? ' · sample data' : ''}</small></div><div className="whatsapp-window-status">{canMessage ? withinWindow ? <><span className="window-indicator open" /><span>Customer service window open</span></> : <><span className="window-indicator closed" /><span>Template required</span></> : <><span className="window-indicator blocked" /><span>Messaging blocked</span></>}</div>{canMessage && <button className="button button-secondary button-small" type="button" onClick={() => onRecordOptOut(selected.id)}>Record opt-out</button>}</header>
        <div className="whatsapp-sample-label">Local transcript only · outbound items shown here are saved drafts, not sent messages.</div>
        <div className="whatsapp-messages" aria-live="polite">{[...selected.messages].sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime()).map(message => <article className={`whatsapp-message ${message.direction}`} key={message.id}><p>{message.body}</p><span>{message.direction === 'outbound' ? 'Saved locally' : 'Inbound sample'} · {formatDate(message.sentAt)}{message.kind === 'template' ? ' · template example' : ''}</span></article>)}</div>

        {!canMessage ? <div className="whatsapp-blocked-panel"><p>{selected.optedOut ? 'This contact opted out. Do not message unless they explicitly opt in again.' : 'This contact has not opted in. Record explicit consent before preparing a reply.'}</p>{(!selected.optedIn || selected.optedOut) && !showOptInForm && <button className="button button-secondary button-small" type="button" onClick={() => setShowOptInForm(true)}>{selected.optedOut ? 'Record new opt-in' : 'Record opt-in'}</button>}{selected.optedOut && <span>Opt-out is honored. A new explicit opt-in is required to resume.</span>}{showOptInForm && <div className="opt-in-confirm"><label><input type="checkbox" checked={confirmOptIn} onChange={event => setConfirmOptIn(event.target.checked)} /> I have recorded a new, explicit opt-in from this person.</label><button type="button" className="button button-primary button-small" disabled={!confirmOptIn} onClick={confirmNewConsent}>Confirm new opt-in</button></div>}</div> : <form className="whatsapp-reply-box" onSubmit={saveMessage}>
          {withinWindow ? <><label className="field-label" htmlFor="whatsapp-reply">Freeform reply · 24-hour service window</label><textarea id="whatsapp-reply" className="field-control" rows={3} value={replyText} onChange={event => setReplyText(event.target.value)} placeholder="Write a local reply draft..." /><div className="whatsapp-send-row"><span>Window expires {selected.lastInboundAt ? formatDate(new Date(selected.lastInboundAt.getTime() + 24 * 60 * 60 * 1000)) : ''}</span><button className="button button-primary" type="submit" disabled={!replyText.trim()}><Send size={14} aria-hidden="true" />Save draft</button></div></> : <><label className="field-label" htmlFor="whatsapp-template">Template examples · outside 24 hours</label><select id="whatsapp-template" className="field-control" value={templateId} onChange={event => setTemplateId(event.target.value)}>{templates.map(template => <option key={template.id} value={template.id}>{template.label}</option>)}</select><p className="template-preview">{templates.find(template => template.id === templateId)?.body}</p><div className="whatsapp-send-row"><span>Example text only · live templates need Meta approval.</span><button className="button button-primary" type="submit"><Send size={14} aria-hidden="true" />Save template draft</button></div></>}
        </form>}
      </section> : <div className="empty-state whatsapp-empty"><MessageCircle size={23} aria-hidden="true" /><h2>Your inbox is empty</h2><p>Add a contact to practice the consent and reply-window workflow.</p></div>}
    </section>
    <p className="whatsapp-footnote"><Clock3 size={14} aria-hidden="true" /> WhatsApp's customer-service window is calculated from the latest inbound message. An outbound reply never resets that timer.</p>
  </div>
}

function isWithinServiceWindow(lastInboundAt?: Date) {
  return Boolean(lastInboundAt && Date.now() - lastInboundAt.getTime() >= 0 && Date.now() - lastInboundAt.getTime() < 24 * 60 * 60 * 1000)
}
