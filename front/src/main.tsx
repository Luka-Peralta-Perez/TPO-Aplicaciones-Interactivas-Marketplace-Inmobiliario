import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import { rutas } from "./rutas";

const router = createBrowserRouter(rutas);

createRoot(document.getElementById("root")!
).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);