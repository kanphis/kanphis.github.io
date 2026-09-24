/*
 * Locale for the stub site — the mechanics of webApp privacy.html extended
 * with persistence: ?lang= or the hash win over everything, then the stored
 * choice (localStorage "lang", so navigating between pages keeps the
 * language), then the browser locale. Only an explicit switch stores the
 * choice and mirrors it into the hash; a URL override stays display-only.
 * Without JavaScript both languages remain visible.
 */
(() => {
    const script = document.currentScript;
    let titles = {};
    try { titles = JSON.parse(script?.dataset.titles || "{}"); } catch {}

    const root = document.documentElement;
    const buttons = document.querySelectorAll(".lang-switch button");

    const apply = (lang, persist) => {
        root.setAttribute("data-lang", lang);
        root.lang = lang;
        if (titles[lang]) document.title = titles[lang];
        buttons.forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
        });
        if (!persist) return;
        try { localStorage.setItem("lang", lang); } catch {
            // storage may be unavailable (private mode, sandboxed frame)
        }
        try {
            history.replaceState(null, "", "#" + lang);
        } catch {
            // sandboxed contexts may forbid URL changes
        }
    };

    const fromUrl = () => {
        const query = new URLSearchParams(window.location.search).get("lang");
        const hash = window.location.hash.replace("#", "");
        if (query === "en" || query === "ru") return query;
        if (hash === "en" || hash === "ru") return hash;
        return null;
    };

    const stored = () => {
        try {
            const value = localStorage.getItem("lang");
            return value === "en" || value === "ru" ? value : null;
        } catch {
            return null;
        }
    };

    const requested = fromUrl() ?? stored();
    if (requested) {
        apply(requested, false);
    } else {
        const preferred = navigator.languages || [navigator.language || "en"];
        apply(preferred.some((tag) => tag.toLowerCase().startsWith("ru")) ? "ru" : "en", false);
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => apply(button.dataset.lang, true));
    });
})();
