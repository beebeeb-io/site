# Graph Report - site  (2026-05-02)

## Corpus Check
- 21 files · ~5,288 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 46 nodes · 36 edges · 3 communities detected
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 3|Community 3]]

## God Nodes (most connected - your core abstractions)
1. `initAll()` - 8 edges
2. `initCounters()` - 3 edges
3. `fetchStrapi()` - 3 edges
4. `initScrollReveal()` - 2 edges
5. `animateCounter()` - 2 edges
6. `initStagger()` - 2 edges
7. `initFaqAccordion()` - 2 edges
8. `initNavbar()` - 2 edges
9. `initScrollProgress()` - 2 edges
10. `initMobileMenu()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `clearCache()` --calls--> `POST()`  [INFERRED]
  src/lib/strapi.ts → src/pages/api/revalidate.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.38
Nodes (9): animateCounter(), initAll(), initCounters(), initFaqAccordion(), initMobileMenu(), initNavbar(), initScrollProgress(), initScrollReveal() (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.32
Nodes (3): fetchStrapi(), getCached(), setCache()

### Community 3 - "Community 3"
Cohesion: 0.67
Nodes (2): POST(), clearCache()

## Knowledge Gaps
- **Thin community `Community 3`** (3 nodes): `POST()`, `clearCache()`, `revalidate.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `clearCache()` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._