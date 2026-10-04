/* Marca que o JS está ativo (as animações de entrada só rodam com JS) */
document.documentElement.classList.add("js");

/* ===== [NOVO] TEMA CLARO/ESCURO =====
   Ordem de prioridade: escolha salva (localStorage) > preferência do sistema > escuro */
const root = document.documentElement;
const THEME_KEY = "theme";
const systemLight = window.matchMedia("(prefers-color-scheme: light)");

const getSaved = () => {
  try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
};

const applyTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#f4f6fc" : "#0b1020");
};

// Aplicado já no carregamento do script (no <head>), antes da primeira pintura
const saved = getSaved();
applyTheme(saved === "light" || saved === "dark" ? saved : systemLight.matches ? "light" : "dark");

document.addEventListener("DOMContentLoaded", () => {
  /* ===== [NOVO] BOTÃO DE TEMA ===== */
  const themeBtn = document.querySelector(".theme-btn");

  const syncThemeBtn = () => {
    const isLight = root.getAttribute("data-theme") === "light";
    themeBtn.setAttribute("aria-label", isLight ? "Mudar para tema escuro" : "Mudar para tema claro");
  };
  syncThemeBtn();

  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.classList.add("theme-anim"); // liga a transição suave
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* armazenamento indisponível */ }
    syncThemeBtn();
    setTimeout(() => root.classList.remove("theme-anim"), 450);
  });

  // Se o usuário nunca escolheu, acompanha mudanças do sistema
  systemLight.addEventListener("change", (ev) => {
    if (!getSaved()) { applyTheme(ev.matches ? "light" : "dark"); syncThemeBtn(); }
  });

  /* ===== MENU MOBILE ===== */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("menu");

  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  /* ===== ANIMAÇÃO AO ROLAR ===== */
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => observer.observe(el));
  } else {
    items.forEach((el) => el.classList.add("visible"));
  }

  /* ===== ANO NO RODAPÉ ===== */
  document.getElementById("ano").textContent = new Date().getFullYear();
});
