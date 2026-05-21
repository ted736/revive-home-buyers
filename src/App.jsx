import { useState, useEffect, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const GREEN = '#2D6A3F'
const CHARCOAL = '#3D4145'

function MapFlyTo({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1.2 })
    }
  }, [position, map])
  return null
}

function AddressAutocomplete({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const debounceRef = useRef(null)
  const wrapperRef = useRef(null)

  const search = useCallback(async (q) => {
    if (q.length < 4) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q,
        format: 'json',
        addressdetails: '1',
        limit: '6',
        countrycodes: 'us',
      })
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { 'Accept-Language': 'en' },
      })
      const data = await res.json()
      setResults(data)
      setOpen(data.length > 0)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e) => {
    const v = e.target.value
    setQuery(v)
    setHighlighted(-1)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(v), 350)
  }

  const handleSelect = (item) => {
    setQuery(item.display_name)
    setOpen(false)
    setResults([])
    onSelect({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      label: item.display_name,
    })
  }

  const handleKeyDown = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, -1)) }
    if (e.key === 'Enter' && highlighted >= 0) { e.preventDefault(); handleSelect(results[highlighted]) }
    if (e.key === 'Escape') { setOpen(false) }
  }

  useEffect(() => {
    const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
          color: GREEN, fontSize: 20, pointerEvents: 'none',
        }}>📍</span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Enter your property address..."
          autoComplete="off"
          style={{
            width: '100%',
            padding: '18px 18px 18px 48px',
            fontSize: 16,
            border: `2px solid ${GREEN}`,
            borderRadius: open ? '8px 8px 0 0' : 8,
            outline: 'none',
            background: 'white',
            color: CHARCOAL,
            boxShadow: '0 2px 12px rgba(45,106,63,0.15)',
            transition: 'border-color 0.2s',
          }}
          aria-label="Property address"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {loading && (
          <span style={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            color: '#9ca3af', fontSize: 14,
          }}>Searching…</span>
        )}
      </div>
      {open && (
        <div className="autocomplete-dropdown">
          {results.map((item, i) => (
            <div
              key={item.place_id}
              className={`autocomplete-item${i === highlighted ? ' highlighted' : ''}`}
              onMouseDown={() => handleSelect(item)}
              onMouseEnter={() => setHighlighted(i)}
            >
              {item.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function LeadForm({ address, onSubmit, submitted }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (submitted) {
    return (
      <div style={{
        background: '#f0fdf4',
        border: `2px solid ${GREEN}`,
        borderRadius: 12,
        padding: 32,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <h3 style={{ color: GREEN, margin: '0 0 8px', fontSize: 22, fontWeight: 700 }}>
          We got it!
        </h3>
        <p style={{ color: CHARCOAL, margin: 0 }}>
          We'll be in touch shortly with a fair cash offer for your property.
        </p>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 600))
    onSubmit({ name, phone, email, address })
    setSubmitting(false)
  }

  const fieldStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: 15,
    border: '2px solid #e2e8f0',
    borderRadius: 8,
    outline: 'none',
    color: CHARCOAL,
    background: 'white',
    transition: 'border-color 0.2s',
    marginBottom: 12,
    display: 'block',
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 16px', textAlign: 'center' }}>
        Get your free cash offer — no obligation
      </p>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        required
        style={fieldStyle}
        onFocus={e => e.target.style.borderColor = GREEN}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      />
      <input
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="Phone number"
        required
        style={fieldStyle}
        onFocus={e => e.target.style.borderColor = GREEN}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email address"
        style={fieldStyle}
        onFocus={e => e.target.style.borderColor = GREEN}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      />
      {address && (
        <div style={{
          background: '#f0fdf4',
          border: `1px solid #bbf7d0`,
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 12,
          fontSize: 13,
          color: '#166534',
        }}>
          📍 {address.label.split(',').slice(0, 3).join(',')}
        </div>
      )}
      <button
        type="submit"
        disabled={submitting || !address}
        style={{
          width: '100%',
          padding: '16px',
          background: !address ? '#9ca3af' : GREEN,
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 700,
          cursor: !address ? 'not-allowed' : 'pointer',
          letterSpacing: 0.3,
          transition: 'background 0.2s',
        }}
      >
        {submitting ? 'Sending…' : !address ? 'Select an address above first' : 'Get My Cash Offer →'}
      </button>
    </form>
  )
}

export default function App() {
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [mapCenter] = useState([40.7608, -111.8910])
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (data) => {
    console.log('Lead captured:', data)
    setSubmitted(true)
  }

  return (
    <div style={{ minHeight: '100svh', background: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: CHARCOAL,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <HouseLogo />
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 18, letterSpacing: 1, lineHeight: 1.1 }}>
              REVIVE
            </div>
            <div style={{ color: GREEN, fontWeight: 600, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase' }}>
              HOME BUYERS
            </div>
          </div>
        </div>
        <div style={{ color: '#9ca3af', fontSize: 13 }}>Utah • Idaho • Montana</div>
      </header>

      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, ${CHARCOAL} 0%, #2a2d31 100%)`,
        padding: '56px 24px 64px',
        textAlign: 'center',
        color: 'white',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(45,106,63,0.25)',
            border: `1px solid rgba(45,106,63,0.5)`,
            borderRadius: 20,
            padding: '4px 16px',
            fontSize: 12,
            color: '#86efac',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 20,
            fontWeight: 600,
          }}>
            Fast · Fair · Cash
          </div>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800,
            margin: '0 0 16px',
            lineHeight: 1.15,
            letterSpacing: -1,
          }}>
            Get a Cash Offer for<br />
            <span style={{ color: '#86efac' }}>Your Property</span>
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: 18,
            margin: '0 0 40px',
            lineHeight: 1.6,
          }}>
            Enter your address below. We buy homes as-is — no repairs, no commissions, no hassle.
          </p>
        </div>
      </section>

      {/* Main card */}
      <main style={{
        flex: 1,
        maxWidth: 1100,
        width: '100%',
        margin: '-32px auto 48px',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,420px)',
        gap: 24,
        alignItems: 'start',
      }}>
        {/* Map + search side */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          overflow: 'hidden',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          <AddressAutocomplete onSelect={setSelectedAddress} />
          <MapContainer
            center={mapCenter}
            zoom={selectedAddress ? 16 : 9}
            style={{ height: 400, width: '100%', borderRadius: 12 }}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {selectedAddress && (
              <>
                <Marker position={[selectedAddress.lat, selectedAddress.lng]}>
                  <Popup>
                    <strong>Your Property</strong><br />
                    {selectedAddress.label.split(',').slice(0, 3).join(',')}
                  </Popup>
                </Marker>
                <MapFlyTo position={[selectedAddress.lat, selectedAddress.lng]} />
              </>
            )}
          </MapContainer>
          {!selectedAddress && (
            <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', margin: 0 }}>
              Type your address above to see it on the map
            </p>
          )}
        </div>

        {/* Form side */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          padding: 28,
          position: 'sticky',
          top: 24,
        }}>
          <h2 style={{
            color: CHARCOAL,
            fontSize: 22,
            fontWeight: 700,
            margin: '0 0 4px',
            textAlign: 'center',
          }}>
            Get Your Free Cash Offer
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: 13,
            textAlign: 'center',
            margin: '0 0 20px',
          }}>
            Close in as little as 7 days
          </p>

          <div style={{
            display: 'flex',
            gap: 8,
            marginBottom: 20,
            justifyContent: 'center',
          }}>
            {['No repairs', 'No agents', 'No fees'].map(t => (
              <span key={t} style={{
                background: '#f0fdf4',
                color: GREEN,
                border: '1px solid #bbf7d0',
                borderRadius: 20,
                padding: '3px 10px',
                fontSize: 11,
                fontWeight: 600,
              }}>{t}</span>
            ))}
          </div>

          <LeadForm
            address={selectedAddress}
            onSubmit={handleSubmit}
            submitted={submitted}
          />

          <p style={{
            color: '#9ca3af',
            fontSize: 11,
            textAlign: 'center',
            margin: '16px 0 0',
            lineHeight: 1.5,
          }}>
            Your information is 100% private and secure.
            We'll never share or sell your data.
          </p>
        </div>
      </main>

      {/* How it works */}
      <section style={{
        background: 'white',
        borderTop: '1px solid #f1f5f9',
        padding: '48px 24px',
        textAlign: 'center',
      }}>
        <h2 style={{ color: CHARCOAL, fontWeight: 800, fontSize: 28, margin: '0 0 40px', letterSpacing: -0.5 }}>
          How It Works
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 32,
          maxWidth: 800,
          margin: '0 auto',
        }}>
          {[
            { icon: '📍', step: '1', title: 'Enter Your Address', desc: 'Type your property address and confirm on the map.' },
            { icon: '📞', step: '2', title: 'We Contact You', desc: 'A local buyer calls within 24 hours — no pressure.' },
            { icon: '💵', step: '3', title: 'Get Your Cash Offer', desc: 'Fair offer based on your property. Close fast or on your timeline.' },
          ].map(({ icon, step, title, desc }) => (
            <div key={step} style={{ padding: '0 8px' }}>
              <div style={{
                width: 56,
                height: 56,
                background: '#f0fdf4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                margin: '0 auto 16px',
              }}>{icon}</div>
              <h3 style={{ color: CHARCOAL, fontWeight: 700, fontSize: 17, margin: '0 0 8px' }}>{title}</h3>
              <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: CHARCOAL,
        color: '#9ca3af',
        padding: '24px',
        textAlign: 'center',
        fontSize: 13,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <HouseLogo small />
          <span style={{ color: 'white', fontWeight: 700, letterSpacing: 1 }}>REVIVE HOME BUYERS</span>
        </div>
        <p style={{ margin: 0 }}>Utah • Idaho • Montana · Cash home buyers</p>
        <p style={{ margin: '4px 0 0' }}>© 2026 Revive Home Buyers. All rights reserved.</p>
      </footer>
    </div>
  )
}

function HouseLogo({ small }) {
  const size = small ? 24 : 36
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="18,4 32,16 32,32 22,32 22,24 14,24 14,32 4,32 4,16" fill={GREEN} opacity="0.9" />
      <polygon points="18,2 34,15 33,16 18,5 3,16 2,15" fill="white" opacity="0.85" />
      <rect x="16" y="26" width="4" height="6" rx="1" fill="#3D4145" />
      <rect x="20" y="17" width="6" height="6" rx="1" fill="white" opacity="0.7" />
    </svg>
  )
}
