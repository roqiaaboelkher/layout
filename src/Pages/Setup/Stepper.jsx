const STEPS = ['بياناتك', 'جدولك', 'طلابك']

export default function Stepper({ step }) {
  return (
    <ol className="stepper">
      {STEPS.map((label, i) => {
        const n = i + 1
        const state = n < step ? 'done' : n === step ? 'current' : 'todo'
        return (
          <li key={label} className={'step step-' + state}>
            <span className="step-dot">{state === 'done' ? <i className="bi bi-check-lg" /> : n}</span>
            <span>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}