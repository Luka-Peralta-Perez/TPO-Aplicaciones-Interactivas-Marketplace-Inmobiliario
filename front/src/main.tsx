import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { API_URL } from "./comun/api";
import "./index.css";

type HealthResponse = {
  status: string;
};

function App() {
  const [estadoApi, setEstadoApi] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function verificarConexion() {
      try {
        const res = await fetch(`${API_URL}/health`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }

        const data: HealthResponse = await res.json();
        setEstadoApi(data.status);

      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setError("No se pudo conectar con la API");

      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    }
    verificarConexion();
    return () => controller.abort();
  }, []);

  return (
    <main>
      <h1>Marketplace inmobiliario</h1>
      {cargando && <p>Conectando con la API...</p>}
      {error && <p>{error}</p>}
      {estadoApi && (
        <p>Estado de la API:
          <strong>{estadoApi}</strong>
        </p>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);