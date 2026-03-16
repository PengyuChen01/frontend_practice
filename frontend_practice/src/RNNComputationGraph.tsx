
import { useState } from 'react'

const COLORS = {
  input: '#4FC3F7',
  hidden: '#81C784',
  output: '#FFB74D',
  loss: '#E57373',
  param: '#CE93D8',
  softmax: '#9575CD',
  groundTruth: '#A1887F',
  arrow: '#555',
  highlight: '#FF5722',
  highlightLight: 'rgba(255, 87, 34, 0.12)',
  bg: '#FAFAFA',
  text: '#333',
}

function ArrowDefs() {
  return (
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill={COLORS.arrow} />
      </marker>
      <marker id="arrowhead-red" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill={COLORS.highlight} />
      </marker>
    </defs>
  )
}

function Node({
  x, y, label, color, r = 26, highlighted = false,
}: {
  x: number; y: number; label: string; color: string; r?: number; highlighted?: boolean
}) {
  return (
    <g>
      {highlighted && <circle cx={x} cy={y} r={r + 6} fill={COLORS.highlightLight} stroke={COLORS.highlight} strokeWidth={2} strokeDasharray="4 2" />}
      <circle cx={x} cy={y} r={r} fill={color} stroke={highlighted ? COLORS.highlight : '#fff'} strokeWidth={2.5} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={600} fill="#fff">{label}</text>
    </g>
  )
}

function Edge({
  x1, y1, x2, y2, label, highlighted = false, curved = false, curveDir = 1, dashed = false,
}: {
  x1: number; y1: number; x2: number; y2: number; label?: string; highlighted?: boolean; curved?: boolean; curveDir?: number; dashed?: boolean
}) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  const r = 28
  const sx = x1 + (dx / len) * r
  const sy = y1 + (dy / len) * r
  const ex = x2 - (dx / len) * r
  const ey = y2 - (dy / len) * r

  const color = highlighted ? COLORS.highlight : COLORS.arrow
  const marker = highlighted ? 'url(#arrowhead-red)' : 'url(#arrowhead)'
  const strokeW = highlighted ? 2.5 : 1.5
  const dashArray = dashed ? '5 3' : undefined

  if (curved) {
    const mx = (sx + ex) / 2
    const my = (sy + ey) / 2
    const nx = -(ey - sy)
    const ny = ex - sx
    const nLen = Math.sqrt(nx * nx + ny * ny)
    const offset = 40 * curveDir
    const cx = mx + (nx / nLen) * offset
    const cy = my + (ny / nLen) * offset
    const path = `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`
    return (
      <g>
        <path d={path} fill="none" stroke={color} strokeWidth={strokeW} markerEnd={marker} strokeDasharray={dashArray} />
        {label && (
          <text x={cx} y={cy - 8} textAnchor="middle" fontSize={11} fill={color} fontWeight={highlighted ? 700 : 500} fontStyle="italic">{label}</text>
        )}
      </g>
    )
  }

  return (
    <g>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth={strokeW} markerEnd={marker} strokeDasharray={dashArray} />
      {label && (
        <text x={(sx + ex) / 2 + (Math.abs(dx) < 5 ? 14 : 0)} y={(sy + ey) / 2 - 6} textAnchor="middle" fontSize={11} fill={color} fontWeight={highlighted ? 700 : 500} fontStyle="italic">{label}</text>
      )}
    </g>
  )
}

function ParamBox({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x - 16} y={y - 10} width={32} height={20} rx={4} fill={COLORS.param} stroke="#fff" strokeWidth={1.5} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill="#fff">{label}</text>
    </g>
  )
}

function DerivationSteps({ step }: { step: number }) {
  const steps = [
    {
      title: 'Goal: Compute ∂L₂/∂U',
      content: (
        <>
          <p>Given our equations:</p>
          <div className="math-block">
            aₜ = Uxₜ + Whₜ₋₁ + b<br/>
            hₜ = tanh(aₜ)<br/>
            oₜ = Vhₜ + c<br/>
            ŷₜ = Softmax(oₜ)<br/>
            Lₜ = CE(ŷₜ, yₜ)
          </div>
          <p style={{ marginTop: 8 }}>L₂ depends on U through <strong>all three time steps</strong> (t=0, 1, 2), because h₂ depends on h₁ which depends on h₀, and each hₜ depends on U through aₜ = <strong>U</strong>xₜ + Whₜ₋₁ + b.</p>
          <p style={{ marginTop: 8 }}>By the chain rule, we sum over all paths from L₂ back to U:</p>
          <div className="math-block">
            ∂L₂/∂U = Σₖ₌₀² (∂L₂/∂aₖ) · (∂aₖ/∂U)
          </div>
        </>
      ),
    },
    {
      title: 'Step 1: From L₂ through ŷ₂ and o₂ to h₂',
      content: (
        <>
          <p>Start from the loss L₂ = CE(ŷ₂, y₂) where ŷ₂ = Softmax(o₂).</p>
          <p>Using the <strong>softmax + CE combined derivative</strong> hint:</p>
          <div className="math-block">∂L₂/∂o₂ = ŷ₂ − y₂</div>
          <p style={{ marginTop: 8 }}>Then since o₂ = Vh₂ + c, we get ∂o₂/∂h₂ = V, so:</p>
          <div className="math-block">∂L₂/∂h₂ = Vᵀ · (∂L₂/∂o₂) = Vᵀ(ŷ₂ − y₂)</div>
        </>
      ),
    },
    {
      title: 'Step 2: From h₂ to a₂ using tanh derivative',
      content: (
        <>
          <p>Since hₜ = tanh(aₜ), and f(x) = tanh(x) → f'(x) = 1 − tanh²(x):</p>
          <div className="math-block">∂h₂/∂a₂ = 1 − tanh²(a₂) = 1 − h₂²</div>
          <p style={{ marginTop: 8 }}>So:</p>
          <div className="math-block">∂L₂/∂a₂ = ∂L₂/∂h₂ ⊙ (1 − h₂²)</div>
          <p style={{ marginTop: 8 }}>Define <strong>δₜ = ∂L₂/∂aₜ</strong>. For t=2:</p>
          <div className="math-block">δ₂ = Vᵀ(ŷ₂ − y₂) ⊙ (1 − h₂²)</div>
        </>
      ),
    },
    {
      title: 'Step 3: BPTT — backpropagate δ through time via W',
      content: (
        <>
          <p>From aₜ = Uxₜ + <strong>W</strong>hₜ₋₁ + b, the gradient flows back through W:</p>
          <div className="math-block">∂aₜ/∂hₜ₋₁ = W</div>
          <p>And from hₜ₋₁ = tanh(aₜ₋₁):</p>
          <div className="math-block">∂hₜ₋₁/∂aₜ₋₁ = diag(1 − hₜ₋₁²)</div>
          <p style={{ marginTop: 8 }}>Combining gives the <strong>BPTT recurrence</strong>:</p>
          <div className="math-block">δₜ₋₁ = Wᵀ · δₜ ⊙ (1 − hₜ₋₁²)</div>
          <p style={{ marginTop: 8 }}>Unrolling for our 3-length sequence:</p>
          <div className="math-block">
            δ₁ = Wᵀ · δ₂ ⊙ (1 − h₁²)<br />
            δ₀ = Wᵀ · δ₁ ⊙ (1 − h₀²)
          </div>
        </>
      ),
    },
    {
      title: 'Step 4: Final result — ∂aₖ/∂U = xₖᵀ, sum all contributions',
      content: (
        <>
          <p>Since aₖ = <strong>U</strong>xₖ + Whₖ₋₁ + b, the direct derivative w.r.t. U is:</p>
          <div className="math-block">∂aₖ/∂U = xₖᵀ</div>
          <p style={{ marginTop: 8 }}>Summing over all time steps where U appears:</p>
          <div className="math-block" style={{ background: 'rgba(255,87,34,0.08)', border: '2px solid #FF5722', padding: '12px 16px', borderRadius: 8 }}>
            ∂L₂/∂U = Σₖ₌₀² δₖ · xₖᵀ = δ₂·x₂ᵀ + δ₁·x₁ᵀ + δ₀·x₀ᵀ
          </div>
          <p style={{ marginTop: 12 }}>where (fully expanded):</p>
          <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
            <li><strong>δ₂</strong> = Vᵀ(ŷ₂ − y₂) ⊙ (1 − h₂²)</li>
            <li><strong>δ₁</strong> = Wᵀ · δ₂ ⊙ (1 − h₁²)</li>
            <li><strong>δ₀</strong> = Wᵀ · δ₁ ⊙ (1 − h₀²)</li>
          </ul>
        </>
      ),
    },
  ]

  return (
    <div style={{ marginTop: 16 }}>
      {steps.filter((_, i) => i <= step).map((s, i) => (
        <div key={i} style={{
          marginBottom: 16, padding: '12px 16px', borderRadius: 8,
          background: i === step ? 'rgba(255,87,34,0.06)' : '#fff',
          border: i === step ? '1px solid #FF5722' : '1px solid #e0e0e0',
          transition: 'all 0.3s',
        }}>
          <h4 style={{ margin: '0 0 8px', color: i === step ? COLORS.highlight : '#555' }}>{s.title}</h4>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: '#444' }}>{s.content}</div>
        </div>
      ))}
    </div>
  )
}

export default function RNNComputationGraph() {
  const [step, setStep] = useState(0)
  const maxStep = 4

  const colSpacing = 220
  const rowY = { x: 560, a: 460, h: 360, o: 260, yhat: 160, L: 60 }
  const cols = [120, 120 + colSpacing, 120 + 2 * colSpacing]

  const getHighlights = (s: number) => {
    if (s === 0) return { nodes: [] as string[], edges: [] as string[] }
    if (s === 1) return { nodes: ['L2', 'yhat2', 'o2', 'h2'], edges: ['L2-yhat2', 'yhat2-o2', 'o2-h2'] }
    if (s === 2) return { nodes: ['h2', 'a2'], edges: ['h2-a2'] }
    if (s === 3) return { nodes: ['a2', 'h1', 'a1', 'h0', 'a0'], edges: ['a2-h1', 'h1-a1', 'a1-h0', 'h0-a0'] }
    if (s === 4) return { nodes: ['a0', 'a1', 'a2', 'x0', 'x1', 'x2'], edges: ['a0-x0', 'a1-x1', 'a2-x2'] }
    return { nodes: [] as string[], edges: [] as string[] }
  }

  const hl = getHighlights(step)
  const isHN = (id: string) => hl.nodes.includes(id)
  const isHE = (id: string) => hl.edges.includes(id)

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", maxWidth: 1050, margin: '0 auto', padding: '24px 16px' }}>
      <h2 style={{ textAlign: 'center', color: COLORS.text, marginBottom: 4 }}>
        RNN Computation Graph: ∂L₂/∂U
      </h2>
      <p style={{ textAlign: 'center', color: '#777', fontSize: 14, marginBottom: 20 }}>
        3-length sequence — click through steps to see the backpropagation path
      </p>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          style={{
            padding: '8px 20px', borderRadius: 6, border: 'none',
            background: step === 0 ? '#ddd' : COLORS.highlight, color: '#fff',
            cursor: step === 0 ? 'default' : 'pointer', fontWeight: 600, fontSize: 14,
          }}
        >
          ← Prev
        </button>
        <span style={{ lineHeight: '36px', fontSize: 14, color: '#777' }}>Step {step} / {maxStep}</span>
        <button
          onClick={() => setStep(Math.min(maxStep, step + 1))}
          disabled={step === maxStep}
          style={{
            padding: '8px 20px', borderRadius: 6, border: 'none',
            background: step === maxStep ? '#ddd' : COLORS.highlight, color: '#fff',
            cursor: step === maxStep ? 'default' : 'pointer', fontWeight: 600, fontSize: 14,
          }}
        >
          Next →
        </button>
      </div>

      {/* SVG Computation Graph */}
      <div style={{ background: COLORS.bg, borderRadius: 12, border: '1px solid #e0e0e0', padding: 8, marginBottom: 16, overflow: 'auto' }}>
        <svg viewBox="0 0 820 640" width="100%" style={{ display: 'block' }}>
          <ArrowDefs />

          {/* Time step labels */}
          {[0, 1, 2].map(t => (
            <text key={t} x={cols[t]} y={620} textAnchor="middle" fontSize={13} fill="#999" fontWeight={600}>
              t = {t}
            </text>
          ))}

          {/* x_t -> a_t (U) */}
          {[0, 1, 2].map(t => (
            <Edge key={`xa${t}`} x1={cols[t]} y1={rowY.x} x2={cols[t]} y2={rowY.a}
              label="U" highlighted={isHE(`a${t}-x${t}`)} />
          ))}

          {/* a_t -> h_t (tanh) */}
          {[0, 1, 2].map(t => (
            <Edge key={`ah${t}`} x1={cols[t]} y1={rowY.a} x2={cols[t]} y2={rowY.h}
              label="tanh" highlighted={isHE(`h${t}-a${t}`)} />
          ))}

          {/* h_t -> o_t (V) */}
          {[0, 1, 2].map(t => (
            <Edge key={`ho${t}`} x1={cols[t]} y1={rowY.h} x2={cols[t]} y2={rowY.o}
              label="V" highlighted={isHE(`o${t}-h${t}`)} />
          ))}

          {/* o_t -> ŷ_t (Softmax) */}
          {[0, 1, 2].map(t => (
            <Edge key={`oy${t}`} x1={cols[t]} y1={rowY.o} x2={cols[t]} y2={rowY.yhat}
              label="Softmax" highlighted={isHE(`yhat${t}-o${t}`)} />
          ))}

          {/* ŷ_t -> L_t (CE) */}
          {[0, 1, 2].map(t => (
            <Edge key={`yL${t}`} x1={cols[t]} y1={rowY.yhat} x2={cols[t]} y2={rowY.L}
              label="CE" highlighted={isHE(`L${t}-yhat${t}`)} />
          ))}

          {/* Recurrent: h_{t-1} -> a_t (W) */}
          {[1, 2].map(t => (
            <Edge key={`rec${t}`} x1={cols[t - 1]} y1={rowY.h} x2={cols[t]} y2={rowY.a}
              label="W" curved curveDir={-1}
              highlighted={isHE(`a${t}-h${t - 1}`)} />
          ))}

          {/* y_t -> L_t (ground truth, dashed) */}
          {[0, 1, 2].map(t => (
            <Edge key={`ygt${t}`} x1={cols[t] + 70} y1={rowY.L + 40} x2={cols[t] + 22} y2={rowY.L + 8}
              dashed />
          ))}

          {/* b -> a_t (right side) */}
          {[0, 1, 2].map(t => (
            <g key={`b${t}`}>
              <line x1={cols[t] + 44} y1={rowY.a + 10} x2={cols[t] + 28} y2={rowY.a + 2}
                stroke={COLORS.param} strokeWidth={1} markerEnd="url(#arrowhead)" strokeDasharray="3 2" />
              <ParamBox x={cols[t] + 58} y={rowY.a + 14} label="b" />
            </g>
          ))}

          {/* c -> o_t (left side) */}
          {[0, 1, 2].map(t => (
            <g key={`c${t}`}>
              <line x1={cols[t] - 44} y1={rowY.o + 10} x2={cols[t] - 28} y2={rowY.o + 2}
                stroke={COLORS.param} strokeWidth={1} markerEnd="url(#arrowhead)" strokeDasharray="3 2" />
              <ParamBox x={cols[t] - 58} y={rowY.o + 14} label="c" />
            </g>
          ))}

          {/* === NODES === */}
          {[0, 1, 2].map(t => (
            <Node key={`x${t}`} x={cols[t]} y={rowY.x} label={`x${t}`} color={COLORS.input} highlighted={isHN(`x${t}`)} />
          ))}
          {[0, 1, 2].map(t => (
            <Node key={`a${t}`} x={cols[t]} y={rowY.a} label={`a${t}`} color="#78909C" highlighted={isHN(`a${t}`)} />
          ))}
          {[0, 1, 2].map(t => (
            <Node key={`h${t}`} x={cols[t]} y={rowY.h} label={`h${t}`} color={COLORS.hidden} highlighted={isHN(`h${t}`)} />
          ))}
          {[0, 1, 2].map(t => (
            <Node key={`o${t}`} x={cols[t]} y={rowY.o} label={`o${t}`} color={COLORS.output} highlighted={isHN(`o${t}`)} />
          ))}
          {[0, 1, 2].map(t => (
            <Node key={`yhat${t}`} x={cols[t]} y={rowY.yhat} label={`ŷ${t}`} color={COLORS.softmax} highlighted={isHN(`yhat${t}`)} />
          ))}
          {[0, 1, 2].map(t => (
            <Node key={`L${t}`} x={cols[t]} y={rowY.L} label={`L${t}`} color={COLORS.loss}
              highlighted={isHN(`L${t}`) || (t === 2 && step >= 1)} />
          ))}

          {/* y_t ground truth boxes (next to L_t) */}
          {[0, 1, 2].map(t => (
            <g key={`ygt_node${t}`}>
              <rect x={cols[t] + 52} y={rowY.L + 26} width={32} height={22} rx={4}
                fill={COLORS.groundTruth} stroke="#fff" strokeWidth={1.5} />
              <text x={cols[t] + 68} y={rowY.L + 38} textAnchor="middle" dominantBaseline="middle"
                fontSize={11} fontWeight={600} fill="#fff">y{t}</text>
            </g>
          ))}

          {/* Legend */}
          <g transform="translate(660, 310)">
            <text x={0} y={0} fontSize={12} fontWeight={700} fill="#999">Legend</text>
            {[
              { label: 'xₜ  (input)', color: COLORS.input },
              { label: 'aₜ  (pre-act)', color: '#78909C' },
              { label: 'hₜ  (hidden)', color: COLORS.hidden },
              { label: 'oₜ  (output)', color: COLORS.output },
              { label: 'ŷₜ  (softmax)', color: COLORS.softmax },
              { label: 'Lₜ  (CE loss)', color: COLORS.loss },
              { label: 'b, c (bias)', color: COLORS.param },
              { label: 'yₜ  (truth)', color: COLORS.groundTruth },
            ].map((item, i) => (
              <g key={i} transform={`translate(0, ${18 + i * 22})`}>
                <circle cx={8} cy={0} r={7} fill={item.color} />
                <text x={22} y={4} fontSize={11} fill="#666">{item.label}</text>
              </g>
            ))}
          </g>

          {/* BPTT annotation — placed below the recurrent W arcs */}
          {step >= 3 && (
            <g opacity={0.7}>
              <text x={340} y={530} textAnchor="middle" fontSize={11} fill={COLORS.highlight} fontWeight={600}>
                ← BPTT: gradient flows back through W →
              </text>
            </g>
          )}

          {/* Step 1: combined derivative annotation — top-right, clear of nodes */}
          {step === 1 && (
            <g>
              <rect x={610} y={8} width={200} height={44} rx={6}
                fill="rgba(255,87,34,0.08)" stroke={COLORS.highlight} strokeWidth={1} />
              <text x={710} y={24} textAnchor="middle" fontSize={11} fill={COLORS.highlight} fontWeight={600}>
                Combined derivative:
              </text>
              <text x={710} y={42} textAnchor="middle" fontSize={12} fill={COLORS.highlight} fontWeight={700} fontFamily="'Courier New', monospace">
                ∂L₂/∂o₂ = ŷ₂ − y₂
              </text>
              {/* Arrow pointing from annotation to the o2→ŷ2 area */}
              <line x1={610} y1={46} x2={cols[2] + 20} y2={rowY.yhat - 30}
                stroke={COLORS.highlight} strokeWidth={1} strokeDasharray="4 3" markerEnd="url(#arrowhead-red)" />
            </g>
          )}
        </svg>
      </div>

      {/* Derivation Steps */}
      <DerivationSteps step={step} />

      {/* Reference Equations */}
      <div style={{
        marginTop: 24, padding: '16px 20px', borderRadius: 8,
        background: '#f5f5f5', border: '1px solid #e0e0e0',
      }}>
        <h4 style={{ margin: '0 0 8px', color: '#555' }}>Reference Equations</h4>
        <div style={{ fontSize: 14, lineHeight: 2, color: '#555', fontFamily: "'Courier New', monospace" }}>
          <div>aₜ = Uxₜ + Whₜ₋₁ + b</div>
          <div>hₜ = tanh(aₜ)</div>
          <div>oₜ = Vhₜ + c</div>
          <div>ŷₜ = Softmax(oₜ)</div>
          <div>Lₜ = CE(ŷₜ, yₜ)</div>
          <div>f(x) = tanh(x) → f'(x) = 1 − tanh²(x)</div>
          <div style={{ marginTop: 4, color: COLORS.highlight, fontWeight: 600 }}>
            Hint: ∂Lₜ/∂oₜ = ŷₜ − yₜ &nbsp;(softmax + CE combined)
          </div>
        </div>
      </div>
    </div>
  )
}
