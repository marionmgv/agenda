/* Persistance locale. Les donnees restent dans le navigateur :
   rien n'est envoye sur un serveur, mais elles ne suivent pas d'un appareil a l'autre.
   D'ou l'export / import JSON propose dans les reglages. */

const CLE = "agenda-marion-v3";

/** Complete un etat ancien avec les champs apparus depuis, sans rien effacer. */
export function normaliser(state) {
  if (!state) return null;
  return {
    ...state,
    exceptions: state.exceptions || [],
    extras: state.extras || [],
    periodes: state.periodes || [],
    // Les taches generees automatiquement (rattachees a une seance) sont retirees :
    // seules restent celles saisies a la main.
    tasks: (state.tasks || []).filter((t) => !t.seanceId),
  };
}

export function charger() {
  try {
    const brut = localStorage.getItem(CLE);
    return brut ? normaliser(JSON.parse(brut)) : null;
  } catch (e) {
    console.warn("Lecture impossible :", e);
    return null;
  }
}

export function sauver(state) {
  try {
    localStorage.setItem(CLE, JSON.stringify(state));
    return true;
  } catch (e) {
    console.warn("Enregistrement impossible :", e);
    return false;
  }
}

export function exporter(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `agenda-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importer(fichier) {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader();
    lecteur.onload = () => {
      try {
        const data = JSON.parse(lecteur.result);
        if (!data || typeof data !== "object" || !Array.isArray(data.slots)) {
          reject(new Error("Ce fichier n'est pas une sauvegarde de l'agenda."));
          return;
        }
        resolve(normaliser(data));
      } catch (e) {
        reject(new Error("Fichier illisible."));
      }
    };
    lecteur.onerror = () => reject(new Error("Lecture du fichier impossible."));
    lecteur.readAsText(fichier);
  });
}
