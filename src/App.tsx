import { useState, useEffect } from 'react'
import profileImg from './assets/profile.png'
import './App.css'

function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, height: '3px',
      width: `${progress}%`,
      background: 'linear-gradient(90deg, #0ea5e9, #6366f1)',
      zIndex: 9999, transition: 'width 0.1s linear',
      boxShadow: '0 0 8px rgba(99,102,241,0.6)'
    }} />
  )
}

function AnimatedH1({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])
  return (
    <h1 style={{
      fontSize: 'clamp(2rem, 6vw, 3.5rem)',
      fontWeight: 800,
      margin: 0,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
      fontFamily: "'Playfair Display', Georgia, serif",
      color: '#0f172a',
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease'
    }}>
      {children}
    </h1>
  )
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), delay) }, [])
  return (
    <div style={{
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      opacity: visible ? 1 : 0,
      transition: `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, opacity 0.6s ease ${delay}ms`
    }}>
      {children}
    </div>
  )
}

const skills = [
  "C# / C++", "Python", "Azure OpenAI", "Azure AI Search", ".NET Core",
  "Azure API Management", "RAG", "Azure Functions", "Azure Logic Apps",
  "REST APIs", "LangChain", "LLMs",
]

const skillColors: Record<string, string> = {
  "C# / C++": "#dbeafe",
  "Python": "#fef9c3",
  "Azure OpenAI": "#ede9fe",
  "Azure AI Search": "#ede9fe",
  ".NET Core": "#dbeafe",
  "Azure API Management": "#ede9fe",
  "RAG": "#dcfce7",
  "Azure Functions": "#ede9fe",
  "Azure Logic Apps": "#ede9fe",
  "REST APIs": "#fee2e2",
  "LangChain": "#dcfce7",
  "LLMs": "#fce7f3",
}

export default function App() {
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = ['About', 'Skills', 'Experience', 'Projects', 'Achievements', 'Contact']

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(n => document.getElementById(n.toLowerCase()))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i]
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(navLinks[i].toLowerCase())
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on nav click
  const handleNavClick = () => setMenuOpen(false)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #f8fafc; font-family: 'DM Sans', sans-serif; color: #1e293b; overflow-x: hidden; }
        a { color: inherit; text-decoration: none; }
        ::selection { background: #6366f1; color: white; }

        /* Nav */
        nav a:hover { color: #6366f1 !important; }

        /* Cards */
        .skill-tag:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .btn-primary:hover { background: #4f46e5 !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.35); }
        .btn-outline:hover { border-color: #6366f1 !important; color: #6366f1 !important; transform: translateY(-1px); }
        .social-btn:hover { background: #6366f1 !important; color: white !important; transform: translateY(-2px); }

        /* Mobile menu */
        .mobile-menu {
          display: none;
          position: fixed;
          top: 60px;
          left: 0; right: 0;
          background: rgba(248,250,252,0.98);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #e2e8f0;
          flex-direction: column;
          padding: 1rem 0;
          z-index: 99;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: #1e293b;
          border-left: 3px solid transparent;
          transition: all 0.15s;
        }
        .mobile-menu a.active {
          color: #6366f1;
          border-left-color: #6366f1;
          background: #f5f3ff;
        }
        .mobile-menu a:hover { color: #6366f1; background: #f8f7ff; }

        /* Hamburger */
        .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; }
        .hamburger:hover { background: #f1f5f9; }
        .hamburger span { display: block; width: 22px; height: 2px; background: #1e293b; border-radius: 2px; transition: all 0.25s; }
        .hamburger span + span { margin-top: 5px; }

        /* Experience card list */
        .exp-list li { font-size: 0.9rem; }

        /* Contact card */
        .contact-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        /* ── RESPONSIVE ─────────────────────────────── */

        /* Tablet (≤900px) */
        @media (max-width: 900px) {
          .hero-inner {
            gap: 2.5rem !important;
          }
          .hero-img-wrap {
            width: 200px !important;
          }
          .hero-img-wrap img {
            width: 190px !important;
            height: 230px !important;
          }
        }

        /* Mobile (≤768px) */
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block; }

          .hero-inner {
            flex-direction: column !important;
            text-align: center;
            gap: 2rem !important;
          }
          .hero-img-wrap {
            width: auto !important;
            margin: 0 auto;
          }
          .hero-img-wrap img {
            width: 160px !important;
            height: 190px !important;
          }
          .hero-text { width: 100% !important; }
          .hero-btns {
            justify-content: center !important;
            flex-wrap: wrap;
          }
          .hero-btns button {
            width: 100%;
            max-width: 260px;
          }

          .section-container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          .projects-grid {
            grid-template-columns: 1fr !important;
          }
          .achievements-grid {
            grid-template-columns: 1fr !important;
          }

          .edu-card-inner {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
          }
          .edu-grade { text-align: left !important; }

          .contact-card {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .social-btns {
            width: 100%;
            justify-content: flex-start !important;
            flex-wrap: wrap;
          }

          .exp-card-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }

        /* Small mobile (≤480px) */
        @media (max-width: 480px) {
          .hero-section { padding: 3rem 1rem !important; }
          .hero-img-wrap img {
            width: 130px !important;
            height: 158px !important;
          }
          .skills-wrap { gap: 0.4rem !important; }
          .skill-tag { font-size: 0.78rem !important; padding: 0.35rem 0.8rem !important; }
        }
      `}</style>

      <ScrollProgress />

      {/* Sticky Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(248,250,252,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 1.5rem',
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
            AK<span style={{ color: '#6366f1' }}>.</span>
          </span>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '2rem' }}>
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} style={{
                fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.01em',
                color: activeSection === link.toLowerCase() ? '#6366f1' : '#64748b',
                transition: 'color 0.2s',
                borderBottom: activeSection === link.toLowerCase() ? '2px solid #6366f1' : '2px solid transparent',
                paddingBottom: '2px'
              }}>{link}</a>
            ))}
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className={activeSection === link.toLowerCase() ? 'active' : ''}
            onClick={handleNavClick}
          >{link}</a>
        ))}
      </div>

      {/* Hero */}
      <section className="hero-section" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)', borderBottom: '1px solid #e2e8f0', padding: '5rem 2rem' }}>
        <div className="hero-inner" style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '4rem' }}>

          <div className="hero-img-wrap" style={{ width: '260px', flexShrink: 0, position: 'relative' }}>
            <FadeIn delay={100}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{
                  position: 'absolute', inset: '-8px',
                  background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
                  borderRadius: '16px', zIndex: 0, opacity: 0.3
                }} />
                <img src={profileImg} alt="Ashish Kumar" width={240} height={290}
                  style={{ borderRadius: '12px', display: 'block', position: 'relative', zIndex: 1, objectFit: 'cover', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }} />
              </div>
            </FadeIn>
          </div>

          <div className="hero-text" style={{ flex: 1, minWidth: 0 }}>
            <FadeIn delay={50}>
              <span style={{ display: 'inline-block', background: '#ede9fe', color: '#6d28d9', fontSize: '0.78rem', fontWeight: 600, padding: '0.3rem 0.85rem', borderRadius: '999px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Available for opportunities
              </span>
            </FadeIn>
            <AnimatedH1>Ashish Kumar</AnimatedH1>
            <FadeIn delay={250}>
              <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', color: '#475569', marginTop: '0.75rem', fontWeight: 400, lineHeight: 1.6 }}>
                Python &nbsp;·&nbsp; .NET &nbsp;·&nbsp; Azure &nbsp;·&nbsp; AI & LLM Applications &nbsp;·&nbsp; Data Structure
              </p>
              <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '1rem', lineHeight: 1.7 }}>
                Building scalable cloud-native backends and intelligent AI systems at <strong style={{ color: '#0f172a' }}>Deloitte</strong>.
              </p>
            </FadeIn>
            <FadeIn delay={400}>
              <div className="hero-btns" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button className="btn-primary" style={{ backgroundColor: '#6366f1', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  View Projects →
                </button>
                <button className="btn-outline" style={{ backgroundColor: 'transparent', color: '#0f172a', padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1.5px solid #0f172a', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  Download Resume
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="section-container" style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 2rem' }}>

        {/* About */}
        <section id="about" style={{ padding: '5rem 0 3rem', textAlign: 'center', width: '100%' }}>
          <SectionLabel>About</SectionLabel>
          <h2 style={h2Style}>Who I Am</h2>
          <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', maxWidth: '700px', margin: '1rem auto 0', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            I'm a Software Engineer specializing in backend development with <strong style={{ color: '#0f172a' }}>C#, Python, .NET Core, and Azure</strong>. I build scalable APIs and cloud-native applications, and bring hands-on experience with AI technologies including <strong style={{ color: '#0f172a' }}>LLMs, RAG pipelines, and vector databases</strong>.
          </p>
        </section>

        {/* Skills */}
        <section id="skills" style={{ padding: '3rem 0' }}>
          <SectionLabel>Skills</SectionLabel>
          <h2 style={h2Style}>Tech Stack</h2>
          <div className="skills-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.5rem' }}>
            {skills.map(skill => (
              <span key={skill} className="skill-tag" style={{
                padding: '0.45rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 500,
                background: skillColors[skill] || '#f1f5f9', color: '#1e293b',
                border: '1px solid rgba(0,0,0,0.06)', transition: 'all 0.2s', cursor: 'default'
              }}>
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="experience" style={{ padding: '3rem 0' }}>
          <SectionLabel>Experience</SectionLabel>
          <h2 style={h2Style}>Work History</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>

            <ExperienceCard
              title="Analyst — Software Engineer"
              company="Deloitte"
              location="Gurugram, India"
              period="Aug 2025 – Present"
              accent="#6366f1"
              badge="Current"
              bullets={[
                "Built an OCR pipeline using Azure Document Intelligence to extract structured data from documents and tables, improving automation accuracy.",
                "Integrated extracted content into LLM-driven workflows, boosting response accuracy and consistency.",
                "Designed intelligent query-routing workflows using Azure OpenAI, Logic Apps, and Azure Functions.",
                "Improved system quality using prompt evaluation strategies and iterative optimization.",
              ]}
            />

            <ExperienceCard
              title="Software Engineer"
              company="Linkfields Innovation"
              location="Hyderabad, India"
              period="Jun 2024 – Aug 2025"
              accent="#0ea5e9"
              bullets={[
                "Implemented MediatR to decouple business logic, reducing response times by 30%.",
                "Managed 50+ APIs using Azure API Management with secure and scalable rollout.",
                "Built serverless architectures with Azure Functions, lowering operational costs by 40%.",
                "Implemented Azure AD & B2C authentication across 100+ enterprise applications.",
                "Enabled JWT-based authorization aligned with enterprise security standards.",
              ]}
            />
          </div>
        </section>

        {/* Projects */}
        <section id="projects" style={{ padding: '3rem 0' }}>
          <SectionLabel>Projects</SectionLabel>
          <h2 style={h2Style}>Featured Work</h2>
          <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
            {[
              { title: 'RAG FitBot', tag: 'AI / RAG', desc: 'AI-powered document assistant that extracts insights from documents using RAG architecture.', color: '#dcfce7', dot: '#16a34a' },
              { title: 'Meeting Bot', tag: 'Automation', desc: 'Automation bot that joins Zoom, Google Meet and Teams meetings automatically.', color: '#dbeafe', dot: '#2563eb' },
              { title: 'OCR + LLM', tag: 'Azure / LLM', desc: 'Extracts structured data from documents and allows intelligent question answering.', color: '#ede9fe', dot: '#7c3aed' },
            ].map(p => (
              <div key={p.title} className="card" style={{
                padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '14px',
                background: '#fff', transition: 'all 0.25s', cursor: 'default',
                borderTop: `3px solid ${p.dot}`
              }}>
                <span style={{ display: 'inline-block', background: p.color, color: p.dot, fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '999px', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  {p.tag}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>{p.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section id="education" style={{ padding: '3rem 0' }}>
          <SectionLabel>Education</SectionLabel>
          <h2 style={h2Style}>Academic Background</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {[
              { school: 'National Institute of Technology, Hamirpur', degree: 'B.Tech', period: 'Jun 2019 – Aug 2023', grade: 'CGPA: 8.57', highlight: true },
              { school: 'Govt. Senior Secondary School, Kotla Behr (H.P)', degree: 'Class XII', period: 'Mar 2018 – Mar 2019', grade: '90.2%', highlight: false },
              { school: 'Vasishat Bharti Public High School, Sansarpur Terrace (H.P)', degree: 'Class X', period: 'Mar 2016 – Mar 2017', grade: '94.57%', highlight: false },
            ].map(ed => (
              <div key={ed.school} className="card" style={{
                padding: '1.25rem 1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px',
                background: ed.highlight ? '#fafafa' : '#fff', transition: 'all 0.25s'
              }}>
                <div className="edu-card-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{ed.degree}</p>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', overflowWrap: 'break-word' }}>{ed.school}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>{ed.period}</p>
                  </div>
                  <div className="edu-grade" style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ display: 'inline-block', background: '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: '1rem', padding: '0.3rem 0.9rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                      {ed.grade}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section id="achievements" style={{ padding: '3rem 0' }}>
          <SectionLabel>Achievements</SectionLabel>
          <h2 style={h2Style}>Recognition & Highlights</h2>
          <div className="achievements-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            {[
              { icon: '🏆', text: 'Received Deloitte\'s "Move the Dot – Team" Award for building agentic AI solutions using Copilot Studio and Azure.' },
              { icon: '🥇', text: 'Secured 32nd rank statewide in 10th grade.' },
              { icon: '💡', text: 'Participated in EXL Hackathon 2024 focused on LLM innovation.' },
              { icon: '📊', text: 'Ranked Top 130 institutionally on GeeksforGeeks.' },
              { icon: '⚡', text: 'Solved 550+ problems on LeetCode.' },
            ].map((a, i) => (
              <div key={i} className="card" style={{
                padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px',
                background: '#fff', display: 'flex', gap: '1rem', alignItems: 'flex-start', transition: 'all 0.25s'
              }}>
                <span style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>{a.icon}</span>
                <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.65 }}>{a.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" style={{ padding: '3rem 0 5rem' }}>
          <SectionLabel>Contact</SectionLabel>
          <h2 style={h2Style}>Get in Touch</h2>
          <div className="contact-card" style={{
            marginTop: '1.5rem', padding: '2rem', borderRadius: '16px',
            background: 'linear-gradient(135deg, #f0f4ff, #faf5ff)',
            border: '1px solid #e0e7ff',
          }}>
            <div>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.3rem', overflowWrap: 'break-word' }}>ashishkumar2172001@gmail.com</p>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>+91 6283872395 &nbsp;·&nbsp; Gurugram, India</p>
            </div>
            <div className="social-btns" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { label: 'GitHub', href: 'https://github.com/ashjarial' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ashish-kumar-933661212/' },
                { label: 'LeetCode', href: 'https://leetcode.com/u/Ashish_kumar_dhiman2172001/' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-btn"
                  style={{ padding: '0.5rem 1.1rem', borderRadius: '8px', border: '1.5px solid #c7d2fe', background: '#fff', fontWeight: 600, fontSize: '0.85rem', color: '#4f46e5', transition: 'all 0.2s' }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </section>

      </div>

      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '1.5rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
        © 2026 Ashish Kumar
      </footer>
    </>
  )
}

// ── Small helpers ────────────────────────────────────────────

const h2Style: React.CSSProperties = {
  fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800,
  color: '#0f172a', letterSpacing: '-0.025em',
  fontFamily: "'Playfair Display', Georgia, serif", marginTop: '0.4rem'
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: '0.72rem', fontWeight: 700,
      color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase',
      background: '#ede9fe', padding: '0.25rem 0.75rem', borderRadius: '999px'
    }}>{children}</span>
  )
}

function ExperienceCard({ title, company, location, period, accent, bullets, badge }: {
  title: string; company: string; location: string; period: string;
  accent: string; bullets: string[]; badge?: string
}) {
  return (
    <div className="card" style={{
      padding: '1.75rem', border: '1px solid #e2e8f0', borderRadius: '14px',
      background: '#fff', borderLeft: `4px solid ${accent}`, transition: 'all 0.25s',
      textAlign: 'left'
    }}>
      <div className="exp-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{title}</h3>
          <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.2rem' }}>
            <strong style={{ color: accent }}>{company}</strong> &nbsp;·&nbsp; {location}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {badge && (
            <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
              ● {badge}
            </span>
          )}
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, whiteSpace: 'nowrap' }}>{period}</span>
        </div>
      </div>
      <ul className="exp-list" style={{ marginTop: '1rem', paddingLeft: '1.1rem', color: '#475569', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {bullets.map((b, i) => <li key={i} style={{ fontSize: '0.9rem' }}>{b}</li>)}
      </ul>
    </div>
  )
}