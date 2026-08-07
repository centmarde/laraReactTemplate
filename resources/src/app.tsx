import React from "react";
import ReactDOM from "react-dom/client";
import LandingView from "./pages/landing-view";

const root = document.getElementById("app");

if (root) {
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <LandingView />
        </React.StrictMode>,
    );
}
