import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Topbar from "../../components/layout/Topbar/Topbar";

import "./DashboardPage.css";

function DashboardPage() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard__content">
        <Topbar />

        <section className="dashboard__body">
          <h2>Bienvenido a Mitake</h2>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;