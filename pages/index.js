import { useState, useRef } from 'react'
import Head from 'next/head'

const QUESTIONS = [
  {
    text: 'What is your investment time horizon?',
    options: [
      { label: 'Less than 3 years', pts: 1 },
      { label: '3 to 7 years', pts: 3 },
      { label: 'More than 7 years', pts: 5 },
    ],
    acks: [
      'Got it — shorter horizons mean you need more stability.',
      'A 3–7 year window gives you decent room to ride out volatility.',
      '7+ years is where the real compounding magic happens.',
    ],
  },
  {
    text: 'How do you react to market volatility?',
    options: [
      { label: 'I get uncomfortable and prefer stability', pts: 1 },
      { label: 'I can handle some ups and downs', pts: 3 },
      { label: "I'm fine with it — I see it as opportunity", pts: 5 },
    ],
    acks: [
      "Stability matters. There's no shame in knowing that.",
      'Balanced — most investors sit here.',
      'That mindset is a real edge over the long run.',
    ],
  },
  {
    text: 'If your portfolio drops 20%, what do you do?',
    options: [
      { label: "Sell — I'd rather cut my losses", pts: 1 },
      { label: 'Hold — wait it out', pts: 3 },
      { label: 'Add more — this is a buying opportunity', pts: 5 },
    ],
    acks: [
      "That's an honest answer. Protecting capital is valid.",
      'Holding through drawdowns is harder than it sounds.',
      'Adding during a dip takes conviction. Respect.',
    ],
  },
  {
    text: "What's your main goal when investing?",
    options: [
      { label: 'Protect my capital', pts: 1 },
      { label: 'Grow steadily over time', pts: 3 },
      { label: 'Maximise returns', pts: 5 },
    ],
    acks: [
      'Capital preservation is a completely valid strategy.',
      'Steady growth beats chasing moonshots for most people.',
      'High returns require high tolerance for uncertainty.',
    ],
  },
  {
    text: 'How financially secure are you right now?',
    options: [
      { label: 'I may need access to this money soon', pts: 1 },
      { label: 'I have some buffer but not a lot', pts: 3 },
      { label: "I'm stable — this is truly long-term money", pts: 5 },
    ],
    acks: [
      "That's important to know — liquidity needs shape your strategy.",
      'Some buffer is better than none.',
      "Investing money you won't need is the best position to be in.",
    ],
  },
  {
    text: 'How do you make investment decisions?',
    options: [
      { label: 'I follow others — tips, forums, social media', pts: 1 },
      { label: 'I do some research but need external confirmation', pts: 2 },
      { label: 'I make independent decisions based on my own analysis', pts: 3 },
    ],
    acks: [
      'Following others can work short-term but has limits.',
      'Wanting validation is normal — the key is building conviction.',
      'Independent thinking is how you build real conviction.',
    ],
  },
  {
    text: 'If a stock you hold underperforms for a full year, what do you do?',
    options: [
      { label: "Sell — clearly something's wrong", pts: 1 },
      { label: 'Hold — I stay the course', pts: 2 },
      { label: 'Reassess the thesis — and possibly add more', pts: 3 },
    ],
    acks: [
      'One year of underperformance often means very little in isolation.',
      'Holding requires patience. Not everyone can do it.',
      'Re-evaluating the thesis is what serious investors do.',
    ],
  },
  {
    text: 'What does your ideal investing journey look like?',
    options: [
      { label: 'Smooth — I want consistent, predictable returns', pts: 1 },
      { label: "Some ups and downs are fine, as long as it trends up", pts: 2 },
      { label: "I'm focused on growth — I can handle the ride", pts: 3 },
    ],
    acks: [
      'Smooth journeys exist — they just usually come with lower returns.',
      "That's the realistic version of most long-term investing.",
      'Growth-focused investors tend to outperform — but only if they stick it out.',
    ],
  },
]

const PROFILES = {
  low: {
    label: '🟢 Low Risk (8 – 16)',
    intro: ['Alright, this tells me you value stability a lot.', 'Nothing wrong with that.', "But let's be real here:"],
    meaning: ["You're more afraid of losing money than missing upside"],
    portfolio: ['Focus on strong, proven businesses', 'Lean towards dividend stocks and ETFs', 'Avoid big, concentrated bets'],
    struggleLabel: 'Where people like you struggle',
    struggles: ['Sitting too much in cash', 'Being too conservative and missing out on growth'],
    edge: '👉 Your edge is patience, not aggression',
    reflection: 'Emotional reactions and fear. When markets dip, the urge to exit is strongest — and that\'s usually the worst time to sell.',
  },
  moderate: {
    label: '🟡 Moderate Risk (17 – 25)',
    intro: ['This is where most of you will fall.', "You want growth, but you don't want to get destroyed in the process."],
    meaning: ["You're trying to balance opportunity and risk"],
    portfolio: ['Core positions in strong companies and ETFs', 'Add some growth names on top', "Don't go all-in on hype"],
    struggleLabel: 'Common mistake here',
    struggles: ['Switching strategies when the market gets noisy', 'One week long-term, next week panic'],
    edge: '👉 Your edge is consistency',
    reflection: "Inconsistency. Moderate investors often do well in stable markets but drift when volatility hits — which is when discipline matters most.",
  },
  aggressive: {
    label: '🔴 Aggressive Risk (26 – 34)',
    intro: ["You're comfortable with volatility and you're here for growth.", "That's fine, but this is where discipline matters the most."],
    meaning: ["You can handle swings, but only if you stay grounded"],
    portfolio: ['More growth-focused companies', 'Higher conviction positions', 'Willing to sit through drawdowns'],
    struggleLabel: 'Biggest risk',
    struggles: ['Overconfidence', "Taking on risk you don't fully understand"],
    edge: '👉 Your edge is conviction — protect it with discipline',
    reflection: "Overconfidence. Aggressive investors often underestimate downside risk — especially during long bull markets. Having a thesis is not the same as being right.",
  },
}

function getProfile(score) {
  if (score <= 16) return { key: 'Low Risk', ...PROFILES.low }
  if (score <= 25) return { key: 'Moderate Risk', ...PROFILES.moderate }
  return { key: 'Aggressive Risk', ...PROFILES.aggressive }
}

export default function Home() {
  const [screen, setScreen] = useState('intro') // intro | quiz | results
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneCode, setPhoneCode] = useState('+65')
  const [introError, setIntroError] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [ack, setAck] = useState('')
  const [answered, setAnswered] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [profile, setProfile] = useState(null)
  const [coachingAnswer, setCoachingAnswer] = useState(null) // null | true | false
  const [submitted, setSubmitted] = useState(false)
  const submitCalledRef = useRef(false)

  const progress = screen === 'quiz' ? (currentQ / QUESTIONS.length) * 100 : screen === 'results' ? 100 : 0

  function startQuiz() {
    if (!name.trim() || !email.trim() || !email.includes('@')) {
      setIntroError(true)
      return
    }
    setIntroError(false)
    setScreen('quiz')
  }

  function selectOption(idx) {
    if (answered) return
    setAnswered(true)
    setSelectedIdx(idx)
    const q = QUESTIONS[currentQ]
    const newScore = score + q.options[idx].pts
    setScore(newScore)
    setAck(q.acks[idx])

    setTimeout(() => {
      if (currentQ + 1 < QUESTIONS.length) {
        setCurrentQ(currentQ + 1)
        setAnswered(false)
        setSelectedIdx(null)
        setAck('')
      } else {
        const p = getProfile(newScore)
        setProfile(p)
        setScreen('results')
        submitResult(newScore, p.key, null)
      }
    }, 900)
  }

  async function submitResult(finalScore, profileKey, coaching) {
    if (submitCalledRef.current) return
    submitCalledRef.current = true
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone ? `${phoneCode} ${phone}` : '',
          score: finalScore,
          profile: profileKey,
          coachingInterest: coaching,
        }),
      })
      setSubmitted(true)
    } catch (e) {
      console.error(e)
    }
  }

  async function handleCoaching(yes) {
    setCoachingAnswer(yes)
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone ? `${phoneCode} ${phone}` : '',
          score,
          profile: profile?.key,
          coachingInterest: yes,
        }),
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <Head>
        <title>Investor Risk Profile — Invest with Bjorn</title>
        <meta name="description" content="Find out your investor risk profile in 2 minutes." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.brand}>Invest with Bjorn</div>

          {/* PROGRESS BAR */}
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>

          {/* ── INTRO ── */}
          {screen === 'intro' && (
            <div>
              <h1 style={styles.h1}>Can you handle the ups and downs of investing?</h1>
              <div style={styles.introBody}>
                <p style={styles.introPara}>Before you decide what to buy, it's important to understand how you actually think about risk.</p>
                <p style={styles.introPara}>Because what you <em>think</em> you'll do… and what you <strong>actually do</strong> can be very different.</p>
                <p style={styles.introPara}>The biggest challenge isn't the market — it's staying calm when things get unpredictable.</p>
                <p style={{ ...styles.introPara, marginBottom: 0 }}>Take 2 minutes to answer a few quick questions. Be honest with yourself.</p>
              </div>

              <div style={styles.inputRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Your name</label>
                  <input style={styles.input} type="text" placeholder="e.g. Sarah" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Your email</label>
                  <input style={styles.input} type="email" placeholder="e.g. sarah@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>

              <div style={{ ...styles.inputGroup, marginTop: 16 }}>
                <label style={styles.label}>Contact number <span style={{ fontWeight: 400, color: '#888' }}>(optional)</span></label>
                <div style={styles.phoneRow}>
                  <select style={styles.phoneCode} value={phoneCode} onChange={e => setPhoneCode(e.target.value)}>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+60">🇲🇾 +60</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+852">🇭🇰 +852</option>
                    <option value="+86">🇨🇳 +86</option>
                  </select>
                  <input style={{ ...styles.input, flex: 1 }} type="tel" placeholder="e.g. 9123 4567" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>

              {introError && <p style={styles.errorMsg}>Please fill in your name and email to continue.</p>}

              <button style={styles.btnPrimary} onClick={startQuiz}>Start the quiz →</button>
            </div>
          )}

          {/* ── QUIZ ── */}
          {screen === 'quiz' && (
            <div>
              <p style={styles.qCounter}>Question {currentQ + 1} of {QUESTIONS.length}</p>
              <p style={styles.qText}>{QUESTIONS[currentQ].text}</p>
              <div style={styles.optionsList}>
                {QUESTIONS[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    style={{ ...styles.optionBtn, ...(selectedIdx === i ? styles.optionSelected : {}) }}
                    onClick={() => selectOption(i)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {ack && <p style={styles.ackText}>{ack}</p>}
            </div>
          )}

          {/* ── RESULTS ── */}
          {screen === 'results' && profile && (
            <div>
              <div style={styles.scoreBadge}>Your score: <strong style={styles.scoreNum}>{score}</strong> / 34</div>
              <h2 style={styles.profileLabel}>{profile.label}</h2>
              <div style={styles.profileIntro}>
                {profile.intro.map((p, i) => <p key={i} style={{ marginBottom: 6 }}>{p}</p>)}
              </div>

              <div style={styles.sectionBlock}>
                <div style={styles.sectionLabel}>What this means</div>
                {profile.meaning.map((item, i) => <BulletItem key={i} text={item} />)}
              </div>

              <div style={styles.sectionBlock}>
                <div style={styles.sectionLabel}>Portfolio direction</div>
                {profile.portfolio.map((item, i) => <BulletItem key={i} text={item} />)}
              </div>

              <div style={styles.sectionBlock}>
                <div style={styles.sectionLabel}>{profile.struggleLabel}</div>
                {profile.struggles.map((item, i) => <BulletItem key={i} text={item} muted />)}
                <div style={styles.edgeBox}>{profile.edge}</div>
              </div>

              <hr style={styles.divider} />

              <div style={styles.reflectionBox}>
                <div style={styles.reflectionLabel}>Based on your answers, your biggest risk is likely</div>
                <p style={styles.reflectionText}>{profile.reflection}</p>
              </div>

              <p style={styles.closingQuote}>"At the end of the day, the best portfolio is one you can actually stick with. Markets will always test you. Your job is not to predict everything — your job is to stay in the game."</p>

              <hr style={styles.divider} />

              {/* Coaching CTA */}
              <div style={styles.ctaCard}>
                <h3 style={styles.ctaH3}>Would you be open to a quick personal call with me?</h3>
                <p style={styles.ctaBody}>Here's what we'd do together:</p>
                <div style={{ marginBottom: 20 }}>
                  <BulletItem text="I'll look through your current portfolio and share ideas to help optimise your returns" />
                  <BulletItem text="You get a personalised take based on your risk profile — not generic advice" />
                  <BulletItem text="It also helps me collect real data and insights for my future content and research" />
                </div>
                {coachingAnswer === null ? (
                  <div style={styles.coachingBtns}>
                    <button style={styles.btnYes} onClick={() => handleCoaching(true)}>Yes, I'm open to it</button>
                    <button style={styles.btnNo} onClick={() => handleCoaching(false)}>Maybe another time</button>
                  </div>
                ) : coachingAnswer ? (
                  <div style={styles.coachingResponse}>Thanks {name}! I'll reach out to you personally to set up a time. Keep an eye on your inbox.</div>
                ) : (
                  <div style={styles.coachingResponse}>No worries at all. You can always reach out when you're ready — I'm not going anywhere.</div>
                )}
              </div>

              {/* Telegram CTA */}
              <div style={styles.ctaCard}>
                <h3 style={styles.ctaH3}>Want exclusive market insights? Join my Telegram below!</h3>
                <p style={styles.ctaBody}>I share market analysis, my personal investing playbook, and free resources — giving you the edge most retail investors never get and helping you invest smarter.</p>
                <a href="https://t.me/investwithbjorn" target="_blank" rel="noopener noreferrer" style={styles.tgLink}>
                  <TelegramIcon />
                  Join t.me/investwithbjorn
                </a>
              </div>

              <p style={styles.disclaimer}>This is for education and self-awareness only, not financial advice.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function BulletItem({ text, muted }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 7 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#aaa', marginTop: 8, flexShrink: 0, display: 'inline-block' }} />
      <span style={{ fontSize: 15, color: muted ? '#888' : '#1a1a1a', lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 6.764l-1.687 7.949c-.123.55-.457.684-.922.425l-2.553-1.88-1.23 1.18c-.136.137-.25.25-.512.25l.183-2.594 4.724-4.266c-.205-.183.046-.284.318-.1L7.46 14.73l-2.507-.783c-.545-.17-.556-.545.113-.806l9.787-3.774c.454-.163.851.113.704.806l-.427-.41z" fill="currentColor" />
    </svg>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#fafaf9',
    padding: '0 16px 60px',
  },
  container: {
    maxWidth: 620,
    margin: '0 auto',
    paddingTop: 40,
  },
  brand: {
    fontSize: 12,
    fontWeight: 500,
    color: '#888',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 32,
  },
  progressBar: {
    height: 3,
    background: '#e8e8e6',
    borderRadius: 2,
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#1a1a1a',
    borderRadius: 2,
    transition: 'width 0.4s ease',
  },
  h1: {
    fontSize: 22,
    fontWeight: 500,
    color: '#1a1a1a',
    lineHeight: 1.4,
    marginBottom: 16,
  },
  introBody: {
    marginBottom: 32,
  },
  introPara: {
    fontSize: 16,
    color: '#555',
    lineHeight: 1.8,
    marginBottom: 12,
  },
  inputRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 0,
  },
  inputGroup: {
    marginBottom: 0,
  },
  label: {
    display: 'block',
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 15,
    border: '1px solid #ddd',
    borderRadius: 8,
    background: '#fff',
    color: '#1a1a1a',
    outline: 'none',
  },
  phoneRow: {
    display: 'flex',
    gap: 8,
  },
  phoneCode: {
    padding: '10px 10px',
    fontSize: 14,
    border: '1px solid #ddd',
    borderRadius: 8,
    background: '#fff',
    color: '#1a1a1a',
    width: 90,
    flexShrink: 0,
    appearance: 'none',
    cursor: 'pointer',
  },
  errorMsg: {
    fontSize: 13,
    color: '#c0392b',
    marginTop: 8,
    marginBottom: 0,
  },
  btnPrimary: {
    display: 'inline-block',
    marginTop: 24,
    padding: '11px 24px',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
  },
  qCounter: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
    letterSpacing: '0.05em',
  },
  qText: {
    fontSize: 18,
    fontWeight: 500,
    color: '#1a1a1a',
    lineHeight: 1.5,
    marginBottom: 28,
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  optionBtn: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '13px 16px',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 15,
    color: '#1a1a1a',
    cursor: 'pointer',
    lineHeight: 1.4,
    transition: 'background 0.12s',
  },
  optionSelected: {
    background: '#f5f5f3',
    borderColor: '#aaa',
    fontWeight: 500,
  },
  ackText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 16,
    lineHeight: 1.5,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #eee',
    margin: '32px 0',
  },
  scoreBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },
  scoreNum: {
    fontSize: 18,
    fontWeight: 500,
    color: '#1a1a1a',
  },
  profileLabel: {
    fontSize: 22,
    fontWeight: 500,
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 1.3,
  },
  profileIntro: {
    fontSize: 16,
    color: '#555',
    lineHeight: 1.8,
    marginBottom: 28,
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#888',
    marginBottom: 10,
  },
  edgeBox: {
    display: 'inline-block',
    marginTop: 16,
    padding: '10px 16px',
    background: '#f5f5f3',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: '#1a1a1a',
  },
  reflectionBox: {
    background: '#f5f5f3',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 24,
  },
  reflectionLabel: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: 8,
  },
  reflectionText: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 1.6,
  },
  closingQuote: {
    fontSize: 15,
    color: '#888',
    lineHeight: 1.8,
    fontStyle: 'italic',
  },
  ctaCard: {
    border: '1px solid #e0e0de',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  ctaH3: {
    fontSize: 17,
    fontWeight: 500,
    color: '#1a1a1a',
    lineHeight: 1.4,
    marginBottom: 10,
  },
  ctaBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.7,
    marginBottom: 16,
  },
  coachingBtns: {
    display: 'flex',
    gap: 10,
  },
  btnYes: {
    flex: 1,
    padding: '11px 16px',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  btnNo: {
    flex: 1,
    padding: '11px 16px',
    background: 'transparent',
    color: '#888',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 14,
    cursor: 'pointer',
  },
  coachingResponse: {
    padding: '14px 16px',
    background: '#f5f5f3',
    borderRadius: 8,
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 1.6,
  },
  tgLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 14,
    color: '#1a1a1a',
    textDecoration: 'none',
    fontWeight: 500,
  },
  disclaimer: {
    fontSize: 12,
    color: '#aaa',
    lineHeight: 1.6,
    paddingTop: 16,
    borderTop: '1px solid #eee',
    marginTop: 8,
  },
}
