import { useState } from 'react'
import { posts } from './posts.js'

const ICONS = {
  home: <path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z" />,
  places: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  alerts: (
    <>
      <path d="M6 17v-6a6 6 0 0112 0v6l2 2H4z" />
      <path d="M10 21h4" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </>
  ),
  reply: <path d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5A8 8 0 1121 12z" />,
  pen: <path d="M4 20l1-4L16 5l3 3L8 19z" />,
  paw: (
    <>
      <ellipse cx="6.5" cy="10.5" rx="2" ry="2.6" />
      <ellipse cx="10" cy="6.5" rx="2" ry="2.8" />
      <ellipse cx="14" cy="6.5" rx="2" ry="2.8" />
      <ellipse cx="17.5" cy="10.5" rx="2" ry="2.6" />
      <path d="M12 12c-3 0-5.5 3-5.5 5.2 0 1.8 1.6 2.3 3 1.9 1-.3 1.6-.5 2.5-.5s1.5.2 2.5.5c1.4.4 3-.1 3-1.9C17.5 15 15 12 12 12z" />
    </>
  ),
}

const LONG = 280
const NAV = [
  ['home', 'Home'],
  ['places', 'Places'],
  ['alerts', 'Alerts'],
  ['profile', 'Profile'],
]

function Icon({ name }) {
  return (
    <svg
      className={name === 'paw' ? 'icon icon-fill' : 'icon'}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  )
}

function initials(name) {
  return name
    .replace(/[^A-Za-z ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const counts = {}
posts.forEach((p) => {
  if (p.location) counts[p.location] = (counts[p.location] || 0) + 1
})
const places = Object.keys(counts)
  .map((name) => ({ name, count: counts[name] }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
places.unshift({ name: '', label: 'All', count: posts.length })

function Post({ post, packed, onPack }) {
  const long = post.text.length > LONG
  const [open, setOpen] = useState(false)
  return (
    <article className="post">
      <div className="avatar" aria-hidden="true">
        {initials(post.author)}
      </div>
      <div className="body">
        <p className="meta">
          <strong>{post.handle}</strong>
          <span>
            {post.time}
            {post.location ? ` · ${post.location}` : ''}
          </span>
        </p>
        <p className={`text${long && !open ? ' is-clamped' : ''}`}>{post.text}</p>
        {long && (
          <button className="more" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? 'Show less' : 'Show more'}
          </button>
        )}
        <div className="actions">
          <button className="act reply" type="button">
            <Icon name="reply" />
            <span className="sr-only">Replies</span>
            <span>{post.replies}</span>
          </button>
          <button className="act pack" type="button" aria-pressed={packed} onClick={onPack}>
            <Icon name="paw" />
            <span className="sr-only">Pack</span>
            <span>{post.packs + (packed ? 1 : 0)}</span>
          </button>
        </div>
      </div>
    </article>
  )
}

function App() {
  const [place, setPlace] = useState('')
  const [sort, setSort] = useState('latest')
  const [packed, setPacked] = useState(new Set())

  let list = posts.filter((p) => !place || p.location === place)
  if (sort === 'loudest') list = [...list].sort((a, b) => b.packs - a.packs)

  const pick = (name) => setPlace(name === place ? '' : name)
  const togglePack = (id) => {
    const next = new Set(packed)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setPacked(next)
  }

  return (
    <div className="shell">
      <header className="side">
        <a className="wordmark" href="#" aria-label="Howl home">
          Howl
        </a>
        <nav aria-label="Main">
          {NAV.map(([icon, label]) => (
            <a key={icon} className="nav-link" href="#" aria-current={icon === 'home' ? 'page' : undefined}>
              <Icon name={icon} />
              {label}
            </a>
          ))}
        </nav>
        <button className="btn" type="button">
          Howl
        </button>
      </header>

      <main className="main">
        <div className="top">
          <a className="wordmark phone-only" href="#" aria-label="Howl home">
            Howl
          </a>
          <div className="tabs" role="group" aria-label="Order posts">
            <button type="button" aria-pressed={sort === 'latest'} onClick={() => setSort('latest')}>
              Latest
            </button>
            <button type="button" aria-pressed={sort === 'loudest'} onClick={() => setSort('loudest')}>
              Loudest
            </button>
          </div>
          <div className="chips phone-only" role="group" aria-label="Filter by place">
            {places.map((pl) => (
              <button
                key={pl.name || 'all'}
                className="chip"
                type="button"
                aria-pressed={pl.name === place}
                onClick={() => pick(pl.name)}
              >
                {pl.label || pl.name}
              </button>
            ))}
          </div>
        </div>
        <p className="sr-only" role="status">
          Showing {list.length} post{list.length === 1 ? '' : 's'}
          {place ? ` from ${place}` : ''}
        </p>
        <div className="feed">
          {list.map((p) => (
            <Post key={p.id} post={p} packed={packed.has(p.id)} onPack={() => togglePack(p.id)} />
          ))}
        </div>
      </main>

      <aside className="extras" aria-label="Places">
        <h2>Places</h2>
        <div role="group" aria-label="Filter by place">
          {places.map((pl) => (
            <button
              key={pl.name || 'all'}
              className="place-row"
              type="button"
              aria-pressed={pl.name === place}
              onClick={() => pick(pl.name)}
            >
              <span>{pl.label || pl.name}</span>
              <span className="count">{pl.count}</span>
            </button>
          ))}
        </div>
      </aside>

      <button className="fab phone-only" type="button" aria-label="Write a Howl">
        <Icon name="pen" />
      </button>

      <nav className="bottom-nav phone-only" aria-label="Main">
        {NAV.map(([icon, label]) => (
          <a key={icon} href="#" aria-label={label} aria-current={icon === 'home' ? 'page' : undefined}>
            <Icon name={icon} />
          </a>
        ))}
      </nav>
    </div>
  )
}

export default App
