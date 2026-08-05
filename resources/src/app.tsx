import React from "react";
import ReactDOM from "react-dom/client";
import CrudView from "./pages/crud-view";

const root = document.getElementById("app");

if (root) {
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <CrudView />
        </React.StrictMode>,
    );
}
