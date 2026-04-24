<p align="center">
  <h3 align="center">Beebeeb Website</h3>
  <p align="center">The beebeeb.io marketing website — honest security, no spin.</p>
</p>

<p align="center">
  <a href="https://github.com/beebeeb-io/site/blob/main/LICENSE"><img src="https://img.shields.io/github/license/beebeeb-io/site" alt="License"></a>
  <a href="https://github.com/beebeeb-io/site/actions"><img src="https://img.shields.io/github/actions/workflow/status/beebeeb-io/site/ci.yml?branch=main" alt="CI"></a>
  <a href="https://github.com/beebeeb-io/site/graphs/contributors"><img src="https://img.shields.io/github/contributors/beebeeb-io/site" alt="Contributors"></a>
  <a href="https://github.com/beebeeb-io/site/stargazers"><img src="https://img.shields.io/github/stars/beebeeb-io/site" alt="Stars"></a>
  <a href="https://github.com/beebeeb-io/site/issues"><img src="https://img.shields.io/github/issues/beebeeb-io/site" alt="Issues"></a>
</p>

---

## What is Beebeeb?

Beebeeb is end-to-end encrypted cloud storage. Your files are encrypted before they leave your device and can only be decrypted by you. The server never sees your data, your keys, or your plaintext.

This is the **marketing website** at [beebeeb.io](https://beebeeb.io) — the public-facing site that explains what Beebeeb does, how the encryption works, and what it costs.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 6 |
| Styling | Tailwind CSS 4 |
| Output | Static HTML (deployable to any CDN) |
| Package manager | Bun |

## Getting started

### Prerequisites

- [Bun](https://bun.sh) (latest)

### Clone, install, and run

```sh
git clone https://github.com/beebeeb-io/site.git
cd site
bun install
bun dev
```

The dev server starts at `http://localhost:4321`.

### Other commands

```sh
bun run build     # Static output in dist/
bun run preview   # Preview the production build
```

### Deployment

The site builds to static HTML in `dist/`. Deploy to any static host or CDN — no server runtime required.

## Project structure

```
src/
  pages/
    index.astro         # Landing page (hero, trust bar, 4 pillars, comparison, founder quote, CTA)
    security.astro      # How encryption works (flow diagram, primitives, threat model)
    pricing.astro       # Plans: Free, Personal, Team, Business
    about.astro         # Founder story, company details, 5 promises
  components/
    Nav.astro           # Site navigation
    Footer.astro        # Site footer
    Button.astro        # CTA button
    Chip.astro          # Tag/label chip
    RegionBadge.astro   # Data region indicator
  layouts/
    base.astro          # Base HTML layout
  styles/               # Global styles and Tailwind config
astro.config.mjs        # Astro configuration
```

## Copy guidelines

All copy on this site follows the Beebeeb brand voice:

- **Honest.** No adjectives that can't be measured. No "military-grade" or "blazing fast."
- **Precise.** Name the infrastructure ("Hetzner, Germany" not "EU cloud"). Name the algorithms.
- **Calm.** Confidence without exclamation marks.

Copy is maintained in the design files and should not be invented in code.

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Ensure pre-commit hooks pass
5. Open a pull request

Please read [SECURITY.md](SECURITY.md) before submitting security-related changes.

## Security

If you discover a security vulnerability, please report it responsibly. See [SECURITY.md](SECURITY.md) for details.

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).

Copyright (C) 2025-2026 [Initlabs B.V.](https://initlabs.nl)

## Part of Beebeeb

| Repository | Description |
|-----------|-------------|
| [web](https://github.com/beebeeb-io/web) | Web client |
| [mobile](https://github.com/beebeeb-io/mobile) | iOS and Android app |
| [server](https://github.com/beebeeb-io/server) | API server |
| [site](https://github.com/beebeeb-io/site) | Marketing website (you are here) |

[beebeeb.io](https://beebeeb.io)
