import { useEffect, useRef, useState, type FormEvent } from 'react'
import './ChatWidget.css'

type Msg = { role: 'user' | 'bot'; text: string }
export type ChatTrigger = { id: number; prompt?: string } | null

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const suggestions = [
  'What does Ashish do at Deloitte?',
  'What are his key skills?',
  'Tell me about his projects',
]

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function ChatWidget({ trigger }: { trigger?: ChatTrigger }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [nudge, setNudge] = useState(false)      // speech bubble visible
  const [unread, setUnread] = useState(false)    // badge + pulse on the button
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', text: "Hi! I'm Ashish's AI assistant. Ask me anything about his experience, skills, projects or education." },
  ])
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastTrigger = useRef(0)
  const nudged = useRef(false)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: loading ? 'auto' : 'smooth' })
  }, [messages, loading, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // ---- Attention nudge: after 4s, or on first click / meaningful scroll ----
  useEffect(() => {
    const show = () => {
      if (nudged.current) return
      nudged.current = true
      setNudge(true)
      setUnread(true)
      cleanup()
    }
    const onScroll = () => { if (window.scrollY > 300) show() }
    const timer = window.setTimeout(show, 4000)
    const cleanup = () => {
      window.clearTimeout(timer)
      window.removeEventListener('click', show)
      window.removeEventListener('scroll', onScroll)
    }
    window.addEventListener('click', show, { once: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return cleanup
  }, [])

  // Hide bubble automatically after 15s (the badge and pulse stay)
  useEffect(() => {
    if (!nudge) return
    const t = window.setTimeout(() => setNudge(false), 15000)
    return () => window.clearTimeout(t)
  }, [nudge])

  const openChat = () => {
    setOpen(true)
    setNudge(false)
    setUnread(false)
  }

  const typeOut = async (full: string) => {
    setMessages((m) => [...m, { role: 'bot', text: '' }])
    const parts = full.split(/(\s+)/)
    let shown = ''
    for (const part of parts) {
      shown += part
      const snapshot = shown
      setMessages((m) => {
        const copy = [...m]
        copy[copy.length - 1] = { role: 'bot', text: snapshot }
        return copy
      })
      if (part.trim()) await sleep(35)
    }
  }

  const send = async (text: string) => {
    const question = text.trim()
    if (!question || loading) return

    setMessages((m) => [...m, { role: 'user', text: question }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data = await res.json()
      await typeOut(data.answer)
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'Sorry, I could not reach the assistant right now. Please try again in a moment.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Opened from outside (the "Ask AI" buttons): open the panel and ask
  useEffect(() => {
    if (!trigger || trigger.id === lastTrigger.current) return
    lastTrigger.current = trigger.id
    nudged.current = true
    openChat()
    if (trigger.prompt) send(trigger.prompt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  const askFromNudge = (q: string) => {
    openChat()
    send(q)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      {/* Speech bubble that introduces the bot */}
      {nudge && !open && (
        <div className="cw-nudge" role="dialog" aria-label="Chat assistant">
          <button className="cw-nudge-x" onClick={() => setNudge(false)} aria-label="Dismiss">✕</button>
          <p><span className="cw-wave">👋</span> <strong>Hi! I'm Ashish's AI assistant.</strong><br />
            Ask me anything about his work, skills or projects. No need to dig through the page.</p>
          <div className="cw-nudge-chips">
            {suggestions.map((s) => (
              <button key={s} onClick={() => askFromNudge(s)}>{s}</button>
            ))}
          </div>
        </div>
      )}

      <button
        className={`cw-fab ${unread && !open ? 'pulse' : ''}`}
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
      >
        {open ? '✕' : '💬'}
        {unread && !open && <span className="cw-badge">1</span>}
      </button>

      <section className={`cw-panel ${open ? 'open' : ''}`} aria-hidden={!open}>
        <header className="cw-head">
          <span className="cw-dot" />
          <div>
            <strong>Ask about Ashish</strong>
            <small>AI assistant</small>
          </div>
        </header>

        <div className="cw-body">
          {messages.map((m, i) => (
            <div key={i} className={`cw-msg ${m.role}`}>{m.text}</div>
          ))}

          {loading && messages[messages.length - 1]?.role === 'user' && (
            <div className="cw-msg bot cw-typing"><i /><i /><i /></div>
          )}

          {messages.length === 1 && !loading && (
            <div className="cw-sugg">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form className="cw-form" onSubmit={onSubmit}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question…"
            maxLength={1000}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()} aria-label="Send">↑</button>
        </form>
      </section>
    </>
  )
}