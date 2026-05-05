---
title: "Why we chose Hetzner"
date: "2026-05-05"
author: "Guus Langelaar"
excerpt: "The infrastructure decision behind Beebeeb: green energy, German law, sensible pricing, and a company that's been operating EU data centers since 1997."
readingTime: 4
---

Every infrastructure decision involves tradeoffs. This is ours, made explicit.

When we started building Beebeeb, we evaluated five object storage providers: AWS S3, Cloudflare R2, Backblaze B2, Wasabi, and Hetzner Object Storage. Here's what we found and why we chose Hetzner.

## The shortlist

**AWS S3** is the obvious choice if you're not thinking about jurisdiction. It's the most mature, has the widest tooling ecosystem, and scales to anything. It's also operated by a US company under US law with US legal exposure. For a privacy-first European product, this was disqualifying. We won't use AWS for user data, full stop.

**Cloudflare R2** is genuinely interesting — zero egress fees, global edge, excellent S3 compatibility. Cloudflare is also a US company. Same problem.

**Backblaze B2** and **Wasabi** are both US-headquartered. Backblaze is a genuinely good company with transparent pricing; Wasabi is known for hot storage at cold storage prices. Neither is European.

**Hetzner Object Storage** is S3-compatible, operated by a German company with no US ownership, priced fairly, and available from Hetzner's existing data center locations.

We chose Hetzner.

## Why Germany specifically

Hetzner's primary facilities are in Falkenstein (Saxony), Nuremberg (Bavaria), and Helsinki (Finland). We use Falkenstein as our primary location.

German data protection law is among the strictest globally. The Bundesdatenschutzgesetz (BDSG) predates GDPR and in several respects goes further. German courts have a long track record of enforcing data subject rights. German law enforcement requests go through established legal processes with meaningful oversight.

There's no Cloud Act equivalent in German law. A US subpoena cannot compel Hetzner to produce data — Hetzner would have to be served through Mutual Legal Assistance Treaty (MLAT) procedures, which are slow, require dual criminality, and are subject to German judicial review.

## Green energy

Hetzner's Falkenstein and Nuremberg campuses run on 100% renewable energy. This is verified through European energy attribute certificates (Guarantees of Origin), not carbon offsets. The electricity is generated locally — primarily from wind and hydroelectric sources in central Europe.

For a company that wants to be around for decades, infrastructure energy use matters. The major US cloud providers have made renewable energy commitments, but many rely on purchasing offsets for power they're actually drawing from coal or gas plants. Hetzner's renewable claim is direct.

## Pricing

Hetzner's object storage pricing is straightforward: €0.0059/GB/month storage, €0.0119/GB egress (within Europe). There are no hidden fees for API calls, no charges for `PUT` requests, no minimum object sizes, and no minimum storage duration.

For comparison, AWS S3 in eu-west-1 charges ~$0.023/GB/month storage plus $0.09/GB egress to the internet. For a storage product where egress costs matter, this is roughly a 7-8x difference in marginal cost.

This isn't why we chose Hetzner — we chose them primarily for jurisdiction and reliability — but it means we can offer competitive pricing to users without taking a loss on storage costs.

## What we gave up

Hetzner doesn't have a global edge network. Files stored in Falkenstein are served from Falkenstein. For a user in New Zealand, latency to the storage layer will be higher than with Cloudflare R2 or AWS.

We've mitigated this with client-side chunking and parallel uploads, and the web client uses range requests for large file downloads. But we're honest that if you're primarily a user in Southeast Asia or the Americas and latency is a critical factor, we're not the optimal choice for that reason.

We may add additional storage locations over time — Helsinki is already available from Hetzner. Any expansion will stay within the EU/EEA to maintain the jurisdiction guarantees.

## The result

Beebeeb's infrastructure today: primary storage at Hetzner Falkenstein (FSN1), secondary at Hetzner Helsinki (HEL1), API servers at Hetzner CX-series VMs. Everything in the EU, everything under EU law, everything on 100% renewable energy.

We'll add data centers as we grow. Every one will be in the EU. That's not negotiable.

— Guus Langelaar, May 2026.
