---
title: "Why we chose EU-only infrastructure"
date: "2026-05-05"
author: "Guus Langelaar"
excerpt: "The infrastructure decision behind Beebeeb: green energy, German law, sensible pricing, and a data center operator that's been running EU facilities since 1997."
readingTime: 4
---

Every infrastructure decision involves tradeoffs. This is ours, made explicit.

When we started building Beebeeb, we evaluated five object storage providers: AWS S3, Cloudflare R2, Backblaze B2, Wasabi, and a German-operated S3-compatible object storage service. Here's what we found and why we chose EU-only infrastructure.

## The shortlist

**AWS S3** is the obvious choice if you're not thinking about jurisdiction. It's the most mature, has the widest tooling ecosystem, and scales to anything. It's also operated by a US company under US law with US legal exposure. For a privacy-first European product, this was disqualifying. We won't use AWS for user data, full stop.

**Cloudflare R2** is genuinely interesting — zero egress fees, global edge, excellent S3 compatibility. Cloudflare is also a US company. Same problem.

**Backblaze B2** and **Wasabi** are both US-headquartered. Backblaze is a genuinely good company with transparent pricing; Wasabi is known for hot storage at cold storage prices. Neither is European.

**Our chosen provider** offers S3-compatible object storage, operated by a German company with no US ownership, priced fairly, and available from established data center locations in Germany and Finland.

We chose EU-only infrastructure.

## Why Germany specifically

Our provider's primary facilities are in Falkenstein (Saxony), Nuremberg (Bavaria), and Helsinki (Finland). We use Falkenstein as our primary location.

German data protection law is among the strictest globally. The Bundesdatenschutzgesetz (BDSG) predates GDPR and in several respects goes further. German courts have a long track record of enforcing data subject rights. German law enforcement requests go through established legal processes with meaningful oversight.

There's no Cloud Act equivalent in German law. A US subpoena cannot compel a German data center operator to produce data — they would have to be served through Mutual Legal Assistance Treaty (MLAT) procedures, which are slow, require dual criminality, and are subject to German judicial review.

## Green energy

The Falkenstein and Nuremberg campuses run on 100% renewable energy. This is verified through European energy attribute certificates (Guarantees of Origin), not carbon offsets. The electricity is generated locally — primarily from wind and hydroelectric sources in central Europe.

For a company that wants to be around for decades, infrastructure energy use matters. The major US cloud providers have made renewable energy commitments, but many rely on purchasing offsets for power they're actually drawing from coal or gas plants. Our provider's renewable claim is direct.

## Pricing

The object storage pricing is straightforward: competitive per-GB storage and egress rates within Europe. There are no hidden fees for API calls, no charges for `PUT` requests, no minimum object sizes, and no minimum storage duration.

For comparison, AWS S3 in eu-west-1 charges ~$0.023/GB/month storage plus $0.09/GB egress to the internet. For a storage product where egress costs matter, our infrastructure costs are roughly 7-8x lower in marginal cost.

This isn't why we chose this provider — we chose them primarily for jurisdiction and reliability — but it means we can offer competitive pricing to users without taking a loss on storage costs.

## What we gave up

Our infrastructure doesn't have a global edge network. Files stored in Falkenstein are served from Falkenstein. For a user in New Zealand, latency to the storage layer will be higher than with Cloudflare R2 or AWS.

We've mitigated this with client-side chunking and parallel uploads, and the web client uses range requests for large file downloads. But we're honest that if you're primarily a user in Southeast Asia or the Americas and latency is a critical factor, we're not the optimal choice for that reason.

We may add additional storage locations over time — Helsinki is already available. Any expansion will stay within the EU/EEA to maintain the jurisdiction guarantees.

## The result

Beebeeb's infrastructure today: primary storage in Falkenstein, Germany, secondary in Helsinki, Finland, API servers on dedicated EU virtual machines. Everything in the EU, everything under EU law, everything on 100% renewable energy.

We'll add data centers as we grow. Every one will be in the EU. That's not negotiable.

— Guus Langelaar, May 2026.
