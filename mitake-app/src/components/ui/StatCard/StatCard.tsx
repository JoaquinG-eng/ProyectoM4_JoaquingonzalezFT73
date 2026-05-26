import "./StatCard.css";

type StatCardProps = {
  titulo: string;
  valor: string;
  descripcion: string;
  variante?: "primary" | "warning" | "default";
};

function StatCard({
  titulo,
  valor,
  descripcion,
  variante = "default",
}: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${variante}`}>
      <div className="stat-card__content">
        <p className="stat-card__title">
          {titulo}
        </p>

        <h3 className="stat-card__value">
          {valor}
        </h3>

        <span className="stat-card__description">
          {descripcion}
        </span>
      </div>
    </article>
  );
}

export default StatCard;