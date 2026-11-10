import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as RME, type ReactNode } from 'react'
import profileImg from './assets/profile.png'
import resumeUrl from './assets/AshishKumarResume.pdf'
import './App.css'

type Project = {
  title: string
  category: 'AI / RAG' | 'Translation' | 'Automation' | 'Azure / LLM'
  description: string
  stack: string[]
  number: string
}

const navItems = ['About', 'Skills', 'Experience', 'Projects', 'Education', 'Achievements', 'Contact']

const skills = [
  'C# / C++', 'Python', 'Azure OpenAI', 'Azure AI Search', '.NET Core',
  'Azure API Management', 'RAG', 'Azure Functions', 'Azure Logic Apps',
  'REST APIs', 'LangChain', 'LLMs', 'Microservices', 'Docker', 'GitHub Actions', 'Copilot Studio', 'Cosmos DB',
]

const projects: Project[] = [
  {
    title: 'Enterprise RAG-Based Document Q&A System',
    category: 'AI / RAG',
    description: 'A Retrieval-Augmented Generation system on Azure AI Search for intelligent querying of enterprise documents. Built as three independent pipelines — document indexing, question answering with contextual responses, and index deletion — orchestrated with Azure Logic Apps and Azure Functions, with Python powering retrieval and search.',
    stack: ['RAG', 'Azure AI Search', 'Azure Logic Apps', 'Azure Functions', 'Python'],
    number: '01',
  },
  {
    title: 'Real-Time Multilingual Translation',
    category: 'Translation',
    description: 'Real-time translation of user queries, Copilot responses, and Adaptive Cards for an enterprise Teams assistant, using Azure AI Translator and Azure OpenAI / Foundry LLMs. Includes batching and content-protection mechanisms to keep translations reliable.',
    stack: ['Azure AI Translator', 'Azure OpenAI', 'Copilot Studio', 'Adaptive Cards', '.NET'],
    number: '02',
  },
  {
    title: 'OCR + LLM',
    category: 'Azure / LLM',
    description: 'An OCR-based document processing pipeline using Azure Document Intelligence, with extracted data integrated into LLM and RAG workflows for intelligent document understanding and question answering.',
    stack: ['Azure Document Intelligence', 'OCR', 'LLMs', 'RAG'],
    number: '03',
  },
  {
    title: 'Meeting Bot',
    category: 'Automation',
    description: 'An automation bot designed to join online meetings across Zoom, Google Meet, and Microsoft Teams.',
    stack: ['Python', 'Automation', 'APIs'],
    number: '04',
  },
]

const experience = [
  {
    role: 'Analyst — Software Engineer',
    company: 'Deloitte',
    location: 'Gurugram, India',
    period: 'Aug 2025 — Present',
    current: true,
    points: [
      'Built an OCR pipeline using Azure Document Intelligence to extract structured data from documents and tables.',
      'Integrated extracted content into LLM-driven workflows to improve response accuracy and consistency.',
      'Designed intelligent query-routing workflows using Azure OpenAI, Logic Apps, and Azure Functions.',
      'Improved system quality through prompt evaluation strategies and iterative optimization.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Linkfields Innovation',
    location: 'Hyderabad, India',
    period: 'Jun 2024 — Aug 2025',
    current: false,
    points: [
      'Implemented MediatR to decouple business logic, reducing response times by 30%.',
      'Managed 50+ APIs using Azure API Management with secure and scalable rollouts.',
      'Built serverless architectures with Azure Functions, lowering operational costs by 40%.',
      'Implemented Azure AD and B2C authentication across 100+ enterprise applications.',
      'Enabled JWT-based authorization aligned with enterprise security standards.',
    ],
  },
]

const education = [
  { degree: 'B.Tech', school: 'National Institute of Technology, Hamirpur', period: 'Jun 2019 — Aug 2023', result: 'CGPA 8.57' },
  { degree: 'Class XII', school: 'Govt. Senior Secondary School, Kotla Behr (H.P)', period: 'Mar 2018 — Mar 2019', result: '90.2%' },
  { degree: 'Class X', school: 'Vasishat Bharti Public High School, Sansarpur Terrace (H.P)', period: 'Mar 2016 — Mar 2017', result: '94.57%' },
]

const achievements = [
  'Received Deloitte’s “Move the Dot – Team” Award for building agentic AI solutions using Copilot Studio and Azure.',
  'Secured 32nd rank statewide in 10th grade.',
  'Participated in EXL Hackathon 2024 focused on LLM innovation.',
  'Ranked in the top 130 institutionally on GeeksforGeeks.',
  'Solved 550+ problems on LeetCode.',
]

const categories = ['All', 'AI / RAG', 'Translation', 'Azure / LLM', 'Automation'] as const
const EMAIL = 'ashishkumar2172001@gmail.com'

function Reveal({ children, d = 0 }: { children: ReactNode; d?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`rv ${on ? 'in' : ''}`} style={{ '--d': `${d}ms` } as CSSProperties}>{children}</div>
}

function Count({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [v, setV] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t: number) => {
        const k = Math.min((t - t0) / 1500, 1)
        setV(Math.round(to * (1 - Math.pow(1 - k, 3))))
        if (k < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [to])
  return <span ref={ref}>{v}{suffix}</span>
}

function Typer({ words }: { words: string[] }) {
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)
  const [del, setDel] = useState(false)
  useEffect(() => {
    const w = words[i]
    const t = window.setTimeout(() => {
      if (!del && n < w.length) setN(n + 1)
      else if (!del) setDel(true)
      else if (n > 0) setN(n - 1)
      else { setDel(false); setI((i + 1) % words.length) }
    }, !del && n === w.length ? 1400 : del ? 35 : 75)
    return () => window.clearTimeout(t)
  }, [n, del, i, words])
  return <span className="typer">{words[i].slice(0, n)}<i className="car" /></span>
}

const Letters = ({ text, base = 0 }: { text: string; base?: number }) => (
  <>{text.split('').map((c, i) => <span key={i} className="ch" style={{ '--i': i + base } as CSSProperties}>{c}</span>)}</>
)

function Marquee({ items, rev = false }: { items: string[]; rev?: boolean }) {
  return (
    <div className={`marq ${rev ? 'rev' : ''}`}>
      <div className="track">{[...items, ...items].map((s, i) => <span key={i}>{s}<em>✦</em></span>)}</div>
    </div>
  )
}

function Tilt({ children }: { children: ReactNode }) {
  const move = (e: RME<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    const s = e.currentTarget.style
    s.setProperty('--rx', `${(0.5 - y) * 9}deg`)
    s.setProperty('--ry', `${(x - 0.5) * 11}deg`)
    s.setProperty('--px', `${x * 100}%`)
    s.setProperty('--py', `${y * 100}%`)
  }
  const leave = (e: RME<HTMLElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }
  return <article className="card" onMouseMove={move} onMouseLeave={leave}>{children}</article>
}

function App() {
  const [dark, setDark] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  const [filter, setFilter] = useState<(typeof categories)[number]>('All')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const onScroll = () => {
      const max = root.scrollHeight - window.innerHeight
      root.style.setProperty('--p', String(max > 0 ? window.scrollY / max : 0))
      let cur = ''
      for (const item of navItems) {
        const el = document.getElementById(item.toLowerCase())
        if (el && el.getBoundingClientRect().top <= 200) cur = item.toLowerCase()
      }
      setActive(cur)
    }
    const onMove = (e: MouseEvent) => {
      root.style.setProperty('--mx', `${e.clientX}px`)
      root.style.setProperty('--my', `${e.clientY}px`)
      root.style.setProperty('--nx', String(e.clientX / window.innerWidth))
      root.style.setProperty('--ny', String(e.clientY / window.innerHeight))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMove) }
  }, [])

  const visible = useMemo(() => projects.filter((p) => filter === 'All' || p.category === filter), [filter])
  const roles = useMemo(() => ['cloud-native backends.', 'RAG pipelines.', 'LLM-powered apps.', 'enterprise Teams bots.'], [])
  const close = () => setMenuOpen(false)

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); window.setTimeout(() => setCopied(false), 1800) }
    catch { window.location.href = `mailto:${EMAIL}` }
  }

  return (
    <div className={`app ${dark ? '' : 'light'}`}>
      <div className="bar" /><div className="glow" /><div className="grain" />

      <header className="nav">
        <a className="logo" href="#home" onClick={close}>AK<b>.</b></a>
        {navItems.map((i) => <a key={i} className={`l ${active === i.toLowerCase() ? 'on' : ''}`} href={`#${i.toLowerCase()}`}>{i}</a>)}
        <button className="ib" onClick={() => setDark((v) => !v)} aria-label="Toggle theme">{dark ? '☀' : '☾'}</button>
        <a className="btn p sm resume" href={resumeUrl} download="AshishKumar_Resume.pdf">Resume ↓</a>
        <button className="ib menu" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" aria-expanded={menuOpen}>{menuOpen ? '✕' : '☰'}</button>
      </header>
      <nav className={`sheet ${menuOpen ? 'open' : ''}`}>
        {navItems.map((i) => <a key={i} href={`#${i.toLowerCase()}`} onClick={close}>{i}</a>)}
        <a href={resumeUrl} download="AshishKumar_Resume.pdf" onClick={close}>Resume ↓</a>
      </nav>

      <main id="home">
        <section className="hero wrap">
          <div>
            <div className="tag"><span className="dot" /> Available for opportunities</div>
            <h1 className="name">
              <span className="ln"><Letters text="Ashish" /></span>
              <span className="ln out"><Letters text="Kumar" base={6} /></span>
            </h1>
            <p className="role">I build <Typer words={roles} /></p>
            <p className="lead">Software engineer at <strong>Deloitte</strong> shipping scalable Azure backends and practical AI systems — from RAG workflows to enterprise bots.</p>
            <div className="row">
              <a className="btn p" href="#projects">Explore my work ↗</a>
              <a className="btn g" href={resumeUrl} download="AshishKumar_Resume.pdf">Download resume ↓</a>
            </div>
          </div>
          <div className="pic">
            <div className="frame"><img src={profileImg} alt="Portrait of Ashish Kumar" /></div>
            <div className="badge">
              <svg viewBox="0 0 120 120"><defs><path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
                <text><textPath href="#circ">OPEN TO WORK • AZURE • .NET • AI • </textPath></text></svg>
              <b>↗</b>
            </div>
            <div className="float"><strong>550+</strong> LeetCode solved</div>
          </div>
        </section>

        <section id="about" className="sec">
          <div className="wrap about">
            <Reveal>
              <div className="kick">01 / About</div>
              <h2 className="h2">Curious by nature. <em>Engineer by craft.</em></h2>
              <p className="big">I turn complex problems into reliable software — from scalable APIs and cloud infrastructure to AI-powered applications.</p>
              <p className="mut">My work spans C#, Python, .NET Core, and Azure, with hands-on experience building LLM applications, retrieval-augmented generation pipelines, and document intelligence workflows.</p>
              <div className="stats">
                <div className="stat"><b><Count to={50} suffix="+" /></b><small>APIs managed</small></div>
                <div className="stat"><b><Count to={30} suffix="%" /></b><small>Faster responses</small></div>
                <div className="stat"><b><Count to={40} suffix="%" /></b><small>Lower costs</small></div>
              </div>
            </Reveal>
            <Reveal d={150}>
              <div className="term">
                <div className="tb"><i /><i /><i /></div>
                <pre>
                  <div><b className="k">const</b> <b className="f">ashish</b> = {'{'}</div>
                  <div className="i1">role: <b className="s">'Software Engineer'</b>,</div>
                  <div className="i1">stack: [<b className="s">'.NET'</b>, <b className="s">'Azure'</b>, <b className="s">'Python'</b>],</div>
                  <div className="i1">building: <b className="s">'RAG + LLM systems'</b>,</div>
                  <div className="i1">shipsTo: <b className="s">'production'</b>,</div>
                  <div className="i1">openToWork: <b className="n">true</b><i className="car" /></div>
                  <div>{'}'}</div>
                </pre>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="skills" className="sec">
          <div className="wrap"><Reveal><div className="kick">02 / Toolkit</div><h2 className="h2">Things I <em>work with.</em></h2></Reveal></div>
          <Marquee items={skills} />
          <Marquee items={[...skills].reverse()} rev />
        </section>

        <section id="experience" className="sec">
          <div className="wrap">
            <Reveal><div className="kick">03 / Experience</div><h2 className="h2">Where I’ve made <em>an impact.</em></h2></Reveal>
            <div className="tl">
              {experience.map((job, i) => (
                <Reveal key={job.company} d={i * 120}>
                  <article className="job">
                    <div className="jh"><span className="per">{job.period}{job.current && <span className="pill">CURRENT</span>}</span></div>
                    <h3>{job.role}</h3>
                    <div className="co">{job.company} <span>· {job.location}</span></div>
                    <ul>{job.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="sec">
          <div className="wrap">
            <Reveal><div className="kick">04 / Selected work</div><h2 className="h2">Ideas into <em>reality.</em></h2></Reveal>
            <div className="chips">
              {categories.map((c) => (
                <button key={c} className={filter === c ? 'on' : ''} onClick={() => setFilter(c)}>
                  {c}<sup>{c === 'All' ? projects.length : projects.filter((p) => p.category === c).length}</sup>
                </button>
              ))}
            </div>
            <div className="grid">
              {visible.map((p) => (
                <Tilt key={p.title}>
                  <div className="cn"><span>{p.number}</span><span className="arr">↗</span></div>
                  <div className="cc">{p.category}</div>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="tags">{p.stack.map((t) => <span key={t}>{t}</span>)}</div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="sec">
          <div className="wrap">
            <Reveal><div className="kick">05 / Education</div><h2 className="h2">The <em>foundations.</em></h2></Reveal>
            <Reveal>{education.map((e) => (
              <div className="ed" key={e.school}>
                <div><span className="deg">{e.degree}</span><h3>{e.school}</h3><p>{e.period}</p></div>
                <strong>{e.result}</strong>
              </div>
            ))}</Reveal>
          </div>
        </section>

        <section id="achievements" className="sec">
          <div className="wrap">
            <Reveal><div className="kick">06 / Recognition</div><h2 className="h2">Milestones <em>&amp; moments.</em></h2></Reveal>
            <div className="achs">
              {achievements.map((a, i) => <Reveal key={a} d={i * 80}><div className="ach"><b>{String(i + 1).padStart(2, '0')}</b><p>{a}</p></div></Reveal>)}
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="wrap">
            <Reveal>
              <div className="kick">07 / Contact</div>
              <div className="mega">Have an idea?<br /><em>Let’s build it.</em></div>
              <a className="mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <div className="row c">
                <a className="btn p" href={`mailto:${EMAIL}`}>Email me ↗</a>
                <button className="btn g" onClick={copyEmail}>{copied ? 'Copied ✓' : 'Copy email'}</button>
              </div>
              <div className="row c soc">
                <a className="btn g" href="https://www.linkedin.com/in/ashish-kumar-933661212/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
                <a className="btn g" href="https://github.com/ashjarial" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                <a className="btn g" href="https://leetcode.com/u/Ashish_kumar_dhiman2172001/" target="_blank" rel="noopener noreferrer">LeetCode ↗</a>
              </div>
              <p className="info">+91 6283872395 · Gurugram, India</p>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="foot wrap"><span>© 2026 Ashish Kumar</span><a href="#home">Back to top ↑</a></footer>
    </div>
  )
}

export default App
