import { checkAuth } from "./auth.js";

export async function logout() {
    let response = await fetch("http://localhost:8000/logout/", {
        method: "POST",
        credentials: "include",
    });

    if (response.ok) {
        console.log("Logout riuscito!");
        checkAuth(); // 🔄 Aggiorna la barra senza ricaricare la pagina
        window.location.href = "/";
    } else {
        console.error("Errore nel logout:", response.status);
    }
}