import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <h2>Mitake</h2>
      </div>

      <nav className="sidebar__menu">
        <button className="sidebar__item sidebar__item--active">
          Dashboard
        </button>

        <button className="sidebar__item">
          Mis tareas
        </button>

        <button className="sidebar__item">
          Tickets
        </button>

        <button className="sidebar__item">
          Estadísticas
        </button>

        <button className="sidebar__item">
          Calendario
        </button>
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__logout">
          Salir
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;