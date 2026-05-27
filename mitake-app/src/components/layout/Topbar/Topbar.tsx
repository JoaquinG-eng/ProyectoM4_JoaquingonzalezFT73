type BotonPrimario = {
  etiqueta: string;

  alHacerClick: () => void;
};

type TopbarProps = {
  tituloSeccion: string;

  subtituloSeccion: string;

  botonPrimario?: BotonPrimario;
};

function Topbar({
  tituloSeccion,
  subtituloSeccion,
  botonPrimario,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <h1>{tituloSeccion}</h1>

        <p>
          {subtituloSeccion}
        </p>
      </div>

      {botonPrimario && (
        <button
          onClick={
            botonPrimario.alHacerClick
          }
        >
          {
            botonPrimario.etiqueta
          }
        </button>
      )}
    </header>
  );
}

export default Topbar;