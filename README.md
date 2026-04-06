# Summitize Ventures site

Static marketing site foundation for Summitize Ventures, built to showcase the custom website-in-48-hours offer.

## Structure

- `index.html`: homepage and primary value proposition
- `services.html`: service formats and standard deliverables
- `process.html`: 48-hour workflow and FAQs
- `portfolio.html`: representative site directions and scalability story
- `about.html`: positioning and working principles
- `contact.html`: inquiry page with email-draft form flow
- `404.html`: fallback page
- `styles/site.css`: global design system, layout utilities, and responsive styling
- `scripts/site.js`: shared header/footer rendering, mobile nav, reveal animations, and contact form behavior

## Notes

- Shared navigation and footer are injected through `scripts/site.js`, so page shell updates only need to happen in one place.
- The design system uses CSS variables for colors, spacing, radii, shadows, and typography so the look can evolve without rewriting page markup.
- The current contact form opens a `mailto:` draft. It can be swapped later for Formspree, Web3Forms, HubSpot, or a custom backend endpoint.
