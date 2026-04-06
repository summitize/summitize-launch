const navItems = [
  { href: "index.html", label: "Home" },
  { href: "services.html", label: "Services" },
  { href: "process.html", label: "Process" },
  { href: "portfolio.html", label: "Work" },
  { href: "about.html", label: "About" },
  { href: "contact.html", label: "Contact" }
];

const footerColumns = [
  { title: "Pages", links: navItems },
  {
    title: "Offer",
    links: [
      { href: "services.html#launch-sprint", label: "48-hour sprint" },
      { href: "services.html#deliverables", label: "Deliverables" },
      { href: "process.html#timeline", label: "Build timeline" }
    ]
  },
  {
    title: "Connect",
    links: [
      { href: "mailto:hello@summitizeventures.com", label: "hello@summitizeventures.com" },
      { href: "contact.html#lead-form", label: "Project inquiry" },
      { href: "about.html#principles", label: "How we work" }
    ]
  }
];

const currentPage = (() => {
  const path = window.location.pathname.split("/").pop();
  return path && path.length ? path : "index.html";
})();

class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to content</a>
      <header class="site-header">
        <div class="nav-shell">
          <a class="brand" href="index.html" aria-label="Summitize Ventures home">
            <span class="brand-mark">S</span>
            <span class="brand-copy">
              <span class="brand-name">Summitize Ventures</span>
              <span class="brand-tag">Premium sites in 48 hours</span>
            </span>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-label="Toggle navigation">
            <span></span>
          </button>
          <nav class="nav-links" aria-label="Primary navigation">
            ${navItems
              .map((item) => `<a href="${item.href}" class="${currentPage === item.href ? "is-active" : ""}">${item.label}</a>`)
              .join("")}
          </nav>
          <div class="nav-cta">
            <a class="button button-primary" href="contact.html#lead-form">Start your sprint</a>
          </div>
        </div>
      </header>
    `;

    const toggle = this.querySelector(".nav-toggle");
    const nav = this.querySelector(".nav-links");

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
                  <span class="brand-mark">S</span>
                  <span class="brand-copy">
                    <span class="brand-name">Summitize Ventures</span>
                    <span class="brand-tag">Sharper websites for serious businesses</span>
                  </span>
                </div>
                <p style="margin-top: 1rem; max-width: 320px;">
                  We build polished launch-ready websites in a focused 48-hour sprint so a business can show up with better clarity, stronger visual confidence, and more momentum.
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
              <span>&copy; <span data-year></span> Summitize Ventures</span>
              <span>Designed for quick launches, simple edits, and future growth.</span>
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

    const subject = encodeURIComponent(`New Summitize inquiry from ${name || "a founder"}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Business: ${business}`,
        `Requested site type: ${siteType}`,
        `Ideal launch window: ${timeline}`,
        "",
        "Project details:",
        details
      ].join("\n")
    );

    if (status) {
      status.textContent = "Your email draft is opening so you can send the inquiry directly to Summitize Ventures.";
      status.classList.add("is-visible");
    }

    window.location.href = `mailto:hello@summitizeventures.com?subject=${subject}&body=${body}`;
  });
});
