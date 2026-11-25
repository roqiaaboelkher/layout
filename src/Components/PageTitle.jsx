export default function PageTitle({ title, subtitle }) {
  return (
    <div className="page-title">
      <h1 className="h2">{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}