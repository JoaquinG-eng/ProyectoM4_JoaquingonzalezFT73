type StatCardProps = {
  tituloEstadistica: string;

  valorPrincipal:
    | string
    | number;

  descripcionSecundaria: string;

  colorDeFondo: string;

  icono: string;
};

function StatCard({
  tituloEstadistica,
  valorPrincipal,
  descripcionSecundaria,
  colorDeFondo,
  icono,
}: StatCardProps) {
  return (
    <article
      className="stat-card"
      style={{
        background:
          colorDeFondo,
      }}
    >
      <div className="stat-card__icono">
        {icono}
      </div>

      <h3>
        {tituloEstadistica}
      </h3>

      <strong>
        {valorPrincipal}
      </strong>

      <p>
        {
          descripcionSecundaria
        }
      </p>
    </article>
  );
}

export default StatCard;