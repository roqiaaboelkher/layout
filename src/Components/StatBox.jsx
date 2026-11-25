export default function StatBox(
    { value, label, tone = 'pending' }
) {
  return (
    <div className={'stat-box stat-' + tone}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}