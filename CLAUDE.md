# beebeeb-io/site

beebeeb.io marketing website. Astro + Tailwind 4. Package manager: **bun**.

## Build & dev

```sh
bun install
bun dev       # localhost:4321
bun run build # Static output in dist/
```

## Pages

- `/` — Landing (hero, trust bar, 4 pillars, comparison, founder quote, CTA)
- `/security` — How encryption works (flow diagram, primitives, threat model)
- `/pricing` — 4 plans (Free/Personal/Team/Business)
- `/about` — Founder story, company details, 5 promises
- `/status` — System status (service grid, 90-day uptime bars, incidents)
- `/docs` — Documentation landing (search bar, 6-card category grid)
- `/changelog` — Reverse-chronological entries with tag chips
- `/careers` — Open roles, company facts, contact CTA
- `/bug-bounty` — Rewards table, reporting instructions, hall of fame

## Design references

`../../design/hifi/hifi-landing.jsx`, `../../design/hifi/hifi-marketing.jsx`, and `../../design/hifi/hifi-public-extra.jsx`

## Brand rules

ALL copy comes from the design files. Don't invent marketing language.
- Company: Initlabs B.V., KvK 95157565, BTW NL867023430B01, Kelvinstraat 34A, 6601 HE Wijchen
- Voice: honest, precise, calm. No adjectives that can't be measured.
- Name infrastructure: "Hetzner · Germany" not "EU cloud"


## Graphify

This repo has a knowledge graph at graphify-out/.
- Before exploring code, read graphify-out/GRAPH_REPORT.md for module structure and relationships
- After modifying code, run `graphify update .` and commit the updated graphify-out/
- The graph tracks modules, functions, types, and their relationships (calls, imports, inherits)
- Use `graphify query "<question>"` to ask questions about the codebase
- Use `graphify path "<A>" "<B>"` to find connections between two concepts

## Keep shared docs in sync

When you add/change/remove endpoints, types, build commands, or dependencies: update the relevant skill file in `/home/guus/code/beebeeb.io/.claude/skills/` (beebeeb-api.md, beebeeb-designs.md, beebeeb-stack.md, beebeeb-dev.md). Other agents depend on these being accurate.
