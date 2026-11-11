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

const NAME_KEY = 'chat-name'
const ROW_KEY = 'chat-row-id'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const read = (k: string) => { try { return localStorage.getItem(k) } catch { return null } }
const write = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* ignore */ } }
const remove = (k: string) => { try { localStorage.removeItem(k) } catch { /* ignore */ } }

const getRowId = (): number | null => {
  const v = read(ROW_KEY)
  return v ? Number(v) : null
}

// Creates the row in the DB (number + name) and remembers its number
const registerVisitor = async (name: string) => {
  try {
    const res = await fetch(`${API_URL}/visitor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const data = await res.json()
    if (data.id) write(ROW_KEY, String(data.id))
  } catch { /* ignore, /chat creates the row as a fallback */ }
}

const greeting = (name: string) =>
  name
    ? `Hi ${name}! I'm Ashish's AI assistant. Ask me anything about his experience, skills, projects or education.`
    : "Hi! I'm Ashish's AI assistant. Ask me anything about his experience, skills, projects or education."

export default function ChatWidget({ trigger }: { trigger?: ChatTrigger }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [nudge, setNudge] = useState(false)
  const [unread, setUnread] = useState(false)
  const [name, setName] = useState(() => read(NAME_KEY) ?? '')
  const [nameInput, setNameInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>(() => [
    { role: 'bot', text: greeting(read(NAME_KEY) ?? '') },
  ])

  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const lastTrigger = useRef(0)
  const nudged = useRef(false)
  const pendingPrompt = useRef<string | null>(null)

  const needsName = !name

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: loading ? 'auto' : 'smooth' })
  }, [messages, loading, open])

  useEffect(() => {
    if (!open) return
    if (needsName) nameRef.current?.focus()
    else inputRef.current?.focus()
  }, [open, needsName])

  // ---- Attention nudge ----
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

  const send = async (text: string, nameOverride?: string) => {
    const question = text.trim()
    const who = (nameOverride ?? name).trim()
    if (!question || loading) return

    // No name yet: open the panel, remember the question, ask for the name first
    if (!who) {
      pendingPrompt.current = question
      openChat()
      return
    }

    setMessages((m) => [...m, { role: 'user', text: question }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, name: who, visitor_id: getRowId() }),
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

  const submitName = async (e: FormEvent) => {
    e.preventDefault()
    const n = nameInput.trim().slice(0, 60)
    if (!n) return

    write(NAME_KEY, n)
    remove(ROW_KEY) // a new name gets a fresh row
    setName(n)
    setMessages((m) => m.map((x, i) => (i === 0 ? { ...x, text: greeting(n) } : x)))

    // Create the row (number + name) before the first question is saved
    await registerVisitor(n)

    const queued = pendingPrompt.current
    pendingPrompt.current = null
    if (queued) send(queued, n)
  }

  const changeName = () => {
    remove(NAME_KEY)
    remove(ROW_KEY)
    setName('')
    setNameInput('')
    setMessages((m) => m.map((x, i) => (i === 0 ? { ...x, text: greeting('') } : x)))
  }

  // Opened from outside (the "Ask AI" buttons)
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

  const hasUserMsg = messages.some((m) => m.role === 'user')

  return (
    <>
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
            <small>{name ? `Chatting as ${name}` : 'AI assistant'}</small>
          </div>
          {name && (
            <button className="cw-switch" onClick={changeName} type="button">Change name</button>
          )}
        </header>

        {needsName ? (
          <form className="cw-gate" onSubmit={submitName}>
            <div className="cw-gate-icon">👋</div>
            <h4>Welcome! What should I call you?</h4>
            <p>
              {pendingPrompt.current
                ? 'Enter your name and I will answer your question right away.'
                : 'Tell me your name and ask anything about Ashish.'}
            </p>

            <label className="cw-field">
              <span>Your name</span>
              <input
                ref={nameRef}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Priya"
                maxLength={60}
                autoComplete="given-name"
              />
            </label>

            <button className="cw-go" type="submit" disabled={!nameInput.trim()}>
              Start chatting <span aria-hidden>→</span>
            </button>
          </form>
        ) : (
          <>
            <div className="cw-body">
              {messages.map((m, i) => (
                <div key={i} className={`cw-msg ${m.role}`}>{m.text}</div>
              ))}

              {loading && messages[messages.length - 1]?.role === 'user' && (
                <div className="cw-msg bot cw-typing"><i /><i /><i /></div>
              )}

              {!hasUserMsg && !loading && (
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
          </>
        )}
      </section>
    </>
  )
}