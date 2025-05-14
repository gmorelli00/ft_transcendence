import { checkAuth } from "./auth.js";
import { getCookie } from "./lang.js";

export function initializeSPA() {
  window.addEventListener("load", () => {
    handleRoute();
    getCookie();
  });
  window.addEventListener("popstate", () => {
    handleRoute();
    getCookie();
  });
  console.log("🚀 SPA initialized!");
}

export function setupNavigation(buttonSelector) {
  console.log("🚀 Setup navigation!");
  const buttons = document.querySelectorAll(buttonSelector);
  buttons.forEach((button) => {
    button.addEventListener("click", async function (event) {
      event.preventDefault();
      const url = this.getAttribute("data-route");
      console.log(`Navigating to: ${url}`);
      await navigateTo(url);
    });
  });
}

export async function navigateTo(url) {
  console.log(`Navigating to: ${url}`);
  history.pushState(null, null, url);
   await handleRoute();
}

async function fetchContent(path) {
  try {
      const response = await fetch(path, {
          headers: {
              "X-Requested-With": "XMLHttpRequest",
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
  } catch (error) {
      console.error("Error fetching content:", error);
      return null;  // Ritorna `null` in caso di errore per evitare crash
  }
}

export async function handleRoute() {
  const path = window.location.pathname;
  console.log(`handleRoute chiamato con path: ${path}`);

  const isAuthenticated = await checkAuth();

  if (path.includes("/pong_game/") && !isAuthenticated) {
    console.log("❌ Accesso negato: utente non autenticato.");
    window.location.href = "/"; // Reindirizza alla home di login
    return;
  }

  if (path === "/" && isAuthenticated) {
    console.log("❌ Accesso negato: utente autenticato non può tornare alla home di login.");
    window.location.href = "/pong_game/"; // Reindirizza al pong_menu
    return;
  }

  const contentDiv = document.getElementById("dynamic-content");
  const data = await fetchContent(path);

  if (data) {
    contentDiv.innerHTML = data.content || "";
  } else {
    console.error("❌ Errore nel caricamento del contenuto, impossibile aggiornare il DOM.");
    return;
  }

  setupNavigation("[data-route]");

  const scriptsToLoad = [];

  if (path.includes("/")) {
    scriptsToLoad.push({ src: "/static/js/auth.js", isModule: true });
    scriptsToLoad.push({ src: "/static/js/login.js", isModule: false });
  }

  if (path.includes("pong_game")) {
    scriptsToLoad.push({ src: "/static/js/logout.js", isModule: true });
    scriptsToLoad.push({ src: "/static/js/auth.js", isModule: true });
    scriptsToLoad.push({ src: "/static/js/pong_menu.js", isModule: true });
    scriptsToLoad.push({ src: "/static/js/script.js", isModule: true });
    scriptsToLoad.push({ src: "/static/js/lang.js", isModule: true });
  }

  console.log(`📜 Script da ricaricare:`, scriptsToLoad);

  try {
    // Rimuove gli script esistenti prima di ricaricarli
    removeExistingScripts(scriptsToLoad.map(s => s.src));

    // Ricarica gli script
    await Promise.all(
      scriptsToLoad.map(({ src, isModule }) => loadJS(src, isModule))
    );

    console.log("✅ Tutti gli script sono stati ricaricati con successo.");
  } catch (error) {
    console.error("❌ Errore nel ricaricamento degli script:", error);
  }
}


export function loadJS(scriptSrc, isModule = false) {
  return new Promise((resolve, reject) => {
    if (!scriptSrc) {
      reject(new Error("❌ scriptSrc è vuoto o indefinito."));
      return;
    }

    console.log(`⬇️ Caricamento script: ${scriptSrc}`);

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    if (isModule) script.type = "module";

    script.onload = () => {
      console.log(`✅ Script caricato con successo: ${scriptSrc}`);
      resolve();
    };

    script.onerror = (error) => {
      console.error(`❌ Errore nel caricamento dello script: ${scriptSrc}`, error);
      reject(new Error(`Errore nel caricamento dello script: ${scriptSrc}`));
    };

    document.head.appendChild(script);
  });
}

function removeExistingScripts(scriptSrcList) {
  scriptSrcList.forEach(src => {
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      console.log(`🗑️ Rimuovo script: ${src}`);
      existingScript.remove();
    }
  });
}

