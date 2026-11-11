import { useEffect, useRef, useState, type FormEvent } from 'react'
import './ChatWidget.css'

type Msg = { role: 'user' | 'bot'; text: string }

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const suggestions = [
  'What does Ashish do at Deloitte?',
  'What are his key skills?',
  'Tell me about his projects',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', text: "Hi! I'm Ashish's AI assistant. Ask me anything about his experience, skills, projects or education." },
  ])
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

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
      setMessages((m) => [...m, { role: 'bot', text: data.answer }])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'Sorry, I could not reach the assistant right now. Please try again in a moment.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      <button
        className="cw-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
      >
        {open ? '✕' : '💬'}
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

          {loading && (
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