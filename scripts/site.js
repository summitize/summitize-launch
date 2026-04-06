const contactEmail = "hello@summitize.in";

const navItems = [
  { href: "portfolio.html", label: "Demo" },
  { href: "index.html#pricing", label: "Pricing" },
  { href: "contact.html", label: "Contact" }
];

const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
  "Hi LaunchPilot by Summitize, I want to launch my website in 48 hours."
)}`;

const themeStorageKey = "summitize-theme";

const getInitialTheme = () => {
  const storedTheme = window.localStorage.getItem(themeStorageKey);
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const applyTheme = (theme) => {
  document.body.dataset.theme = theme;
  document.documentElement.dataset.theme = theme;

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const label = button.querySelector("[data-theme-label]");
    const pressed = theme === "light";
    button.setAttribute("aria-pressed", String(pressed));
    button.setAttribute("aria-label", pressed ? "Switch to night mode" : "Switch to day mode");
    if (label) {
      label.textContent = pressed ? "Day" : "Night";
    }
  });
};

const toggleTheme = () => {
  const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
  window.localStorage.setItem(themeStorageKey, nextTheme);
  applyTheme(nextTheme);
};

applyTheme(getInitialTheme());

const footerColumns = [
  {
    title: "Links",
    links: [
      { href: "portfolio.html", label: "Demo" },
      { href: "index.html#pricing", label: "Pricing" },
      { href: "contact.html", label: "Contact" }
    ]
  },
  {
    title: "Connect",
    links: [
      { href: `mailto:${contactEmail}`, label: contactEmail },
      { href: whatsappHref, label: "Chat on WhatsApp" }
    ]
  }
];

const currentPage = (() => {
  const path = window.location.pathname.split("/").pop();
  return path && path.length ? path : "index.html";
})();

const isCurrentNavItem = (item) => {
  const [page, hash] = item.href.split("#");
  const resolvedPage = page && page.length ? page : "index.html";

  if (resolvedPage !== currentPage) {
    return false;
  }

  if (!hash) {
    return true;
  }

  return window.location.hash === `#${hash}`;
};

class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to content</a>
      <header class="site-header">
        <div class="nav-shell">
          <a class="brand" href="index.html" aria-label="LaunchPilot by Summitize home">
            <img class="brand-logo" src="images/launchpilot-logo.png" alt="LaunchPilot by Summitize" />
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-label="Toggle navigation">
            <span></span>
          </button>
          <nav class="nav-links" aria-label="Primary navigation">
            ${navItems
              .map((item) => `<a href="${item.href}" class="${isCurrentNavItem(item) ? "is-active" : ""}">${item.label}</a>`)
              .join("")}
          </nav>
          <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Switch theme">
            <span class="theme-toggle-orb"></span>
            <span data-theme-label>Night</span>
          </button>
        </div>
      </header>
    `;

    const toggle = this.querySelector(".nav-toggle");
    const nav = this.querySelector(".nav-links");
    const themeToggle = this.querySelector("[data-theme-toggle]");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });

    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
    }

    applyTheme(document.body.dataset.theme || getInitialTheme());
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-shell">
            <div class="footer-grid">
              <div class="footer-column">
                <div class="brand">
                  <img class="brand-logo" src="images/launchpilot-logo.png" alt="LaunchPilot by Summitize" />
                </div>
                <p style="margin-top: 1rem; max-width: 320px;">
                  We help businesses, consultants, and startups launch their online presence fast using AI.
                </p>
              </div>
              ${footerColumns
                .map(
                  (column) => `
                    <div class="footer-column">
                      <h3>${column.title}</h3>
                      ${column.links.map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
                    </div>
                  `
                )
                .join("")}
            </div>
            <div class="footer-meta">
              <span>&copy; <span data-year></span> Summitize</span>
              <span>Get your website live in 48 hours.</span>
            </div>
          </div>
        </div>
      </footer>
    `;

    const yearNode = this.querySelector("[data-year]");
    if (yearNode) yearNode.textContent = String(new Date().getFullYear());
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);

const revealElements = document.querySelectorAll(".reveal");

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll("[data-lead-form]").forEach((form) => {
  const status = form.querySelector("[data-form-status]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const business = formData.get("business") || "";
    const siteType = formData.get("siteType") || "";
    const timeline = formData.get("timeline") || "";
    const details = formData.get("details") || "";

    const subject = encodeURIComponent(`New LaunchPilot inquiry from ${name || "a founder"}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Business: ${business}`,
        `Requested launch type: ${siteType}`,
        `Ideal launch window: ${timeline}`,
        "",
        "Project details:",
        details
      ].join("\n")
    );

    if (status) {
      status.textContent = "Your email draft is opening so you can send the inquiry directly to LaunchPilot by Summitize.";
      status.classList.add("is-visible");
    }

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  });
});

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  link.setAttribute("href", whatsappHref);
});
