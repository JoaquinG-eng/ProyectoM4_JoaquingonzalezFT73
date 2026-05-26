import "./Topbar.css";

function Topbar() {
  return (
    <header className="topbar">
      <div>
        <h1 className="topbar__title">
          Dashboard
        </h1>

        <p className="topbar__subtitle">
          Gestioná tus tareas y tickets.
        </p>
      </div>

      <div className="topbar__actions">
        <button className="topbar__button">
          Nueva tarea
        </button>

        <button className="topbar__button topbar__button--secondary">
          Nuevo ticket
        </button>
      </div>
    </header>
  );
}

export default Topbar;