import { logout } from "./logout.js";

export async function checkAuth() {
    try {
        let response = await fetch("http://localhost:8000/check-auth/", {
            credentials: "include"
        });

        let data = await response.json();
        updateAuthButton(data.authenticated);
        return data.authenticated;

    } catch (error) {
        console.error("Errore nel controllo autenticazione:", error);
    }
}

export function updateAuthButton(isAuthenticated) {
    let authContainer = document.getElementById("auth-btn-container");

    if (!authContainer) {
        console.error("Elemento con id 'auth-btn-container' non trovato.");
        return;
    }

    // Rimuovi eventuali event listener esistenti
    const existingButton = authContainer.querySelector("#logout-btn");
    if (existingButton) {
        existingButton.removeEventListener("click", logout);
    }

    if (isAuthenticated) {
        console.log("Utente loggato!");
        authContainer.innerHTML = `<button id="logout-btn" class="btn btn-primary btn-press" data-translate-key="0">Logout</button>`;
        document.getElementById("logout-btn").addEventListener("click", logout);
    } else {
        console.log("Utente non loggato!");
        authContainer.innerHTML = "";
    }
}
