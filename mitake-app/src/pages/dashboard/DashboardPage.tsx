import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Topbar from "../../components/layout/Topbar/Topbar";

import StatCard from "../../components/ui/StatCard/StatCard";

import "./DashboardPage.css";

function DashboardPage() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard__content">
        <Topbar />

        <section className="dashboard__body">
          <section className="dashboard__stats">
            <StatCard
              titulo="Tareas completadas"
              valor="18"
              descripcion="+4 esta semana"
              variante="primary"
            />

            <StatCard
              titulo="En progreso"
              valor="7"
              descripcion="3 tickets activos"
              variante="warning"
            />

            <StatCard
              titulo="Equipo"
              valor="12"
              descripcion="Miembros activos"
            />
          </section>

          <section className="dashboard__section">
            <div className="dashboard__section-header">
              <h2>Tareas recientes</h2>

              <button>
                Ver todas
              </button>
            </div>

            <div className="dashboard__placeholder">
              Próximamente tareas dinámicas...
            </div>
          </section>

          <section className="dashboard__section">
            <div className="dashboard__section-header">
              <h2>Kanban de tickets</h2>

              <button>
                Abrir tablero
              </button>
            </div>

            <div className="dashboard__placeholder dashboard__placeholder--large">
              Próximamente tablero Kanban...
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;