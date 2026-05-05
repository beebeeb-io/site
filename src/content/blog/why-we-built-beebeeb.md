---
title: "Why we built Beebeeb"
date: "2026-04-14"
author: "Guus Langelaar"
excerpt: "The honest story of two brothers in Wijchen who got tired of cloud storage that treats your private files as a product to be mined."
readingTime: 4
---

My brother Bram and I grew up in Wijchen, a small town in Gelderland. We've been building things together since we were kids — first with Lego, then with code. Beebeeb is the most serious thing we've built, and it started with a specific frustration.

A few years ago I found out that a major cloud provider had flagged one of my documents for "policy review." The document contained nothing illegal, nothing offensive — it was a draft business plan with some competitor analysis. The fact that a stranger at a tech company could read it without my knowledge or consent bothered me in a way I couldn't shake.

When I dug into the technical details of how these services work, the frustration turned into something else. Anger, maybe. Not at the reviewers — they're just doing their jobs — but at the architecture. Every mainstream cloud storage product is built around a fundamental assumption: *we hold your keys, so we can always open your files*. It's not a bug. It's a feature they depend on for search, scanning, AI training, and compliance.

**The privacy that's missing**

There's a long tail of legitimate reasons people need private storage. Journalists protecting sources. Lawyers with attorney-client communications. Doctors handling patient data. Small businesses keeping financials away from competitors. Individuals who just believe their personal files are none of Google's business.

These users deserve better than "trust us." They deserve a system where "trust us" is structurally impossible — where the keys never leave the device, and no amount of legal pressure, business decision, or data breach at Beebeeb can expose their files.

That's what zero-knowledge encryption means when it's done right. Not a marketing phrase. A mathematical guarantee.

**Why we had to build it ourselves**

There are other zero-knowledge storage products. We evaluated them seriously. The problems we found fell into three categories:

*Complexity*. Some tools are technically excellent but aimed at security professionals. The UX assumes you know what a PGP keyring is. Most people shouldn't have to.

*Trust gaps*. Several "end-to-end encrypted" products turned out to encrypt metadata only, or used key escrow "for recovery," which is functionally the same as having no encryption at all if the company can initiate recovery on your behalf.

*Jurisdiction*. US-based companies are subject to the Cloud Act, which allows US authorities to compel access to data stored anywhere in the world. For European users and businesses, this isn't paranoia — it's a real compliance consideration under GDPR. Storing sensitive EU data on infrastructure governed by US law is a liability.

We wanted a product that solves all three: simple enough for anyone to use, genuinely zero-knowledge by architecture, and operated entirely under EU jurisdiction with EU infrastructure.

**What we built**

Beebeeb encrypts every file on your device before it leaves, using AES-256-GCM with a unique key derived per file. Your master key is derived from your password using OPAQUE — a recent cryptographic protocol that means we never see your password, not even a hash of it, during login.

Files are stored on Hetzner's infrastructure in Falkenstein, Germany. Beebeeb is operated by Initlabs B.V., a Dutch company registered with the Dutch Chamber of Commerce. Dutch privacy law applies. German data center law applies. No US parent company. No US jurisdiction.

We're launching with a web client and mobile apps. Desktop sync is in development. The encryption engine is open source and independently auditable — if you want to verify that we're not lying about any of this, you can.

We think cloud storage that respects your privacy shouldn't require you to be a cryptographer. That's what we're building.

— Guus Langelaar, Wijchen, May 2026
