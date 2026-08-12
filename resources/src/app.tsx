import { createRoot } from "react-dom/client";
import AppRouter from "./routes";

const root = document.getElementById("app");

if (root) {
    createRoot(root).render(<AppRouter />);
}
