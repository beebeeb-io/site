---
title: "What 'Made in Europe' actually means for your data"
date: "2026-04-28"
author: "Guus Langelaar"
excerpt: "EU jurisdiction, Hetzner Falkenstein, Dutch corporate law, and why none of this matters without zero-knowledge encryption — but together, they do."
readingTime: 5
---

"Stored in Europe" is a claim that gets made a lot. Amazon has European data centers. Microsoft has European data centers. Google has European data centers. Your data is technically stored on EU soil — in a facility operated by a US parent company, subject to US law, accessible under the US Cloud Act.

This matters more than most people realize.

## The Cloud Act problem

The Clarifying Lawful Overseas Use of Data Act (CLOUD Act) was signed into US law in 2018. It allows US law enforcement agencies to compel US-headquartered companies to produce data stored anywhere in the world — including data stored on EU servers operated by EU subsidiaries.

For European businesses handling sensitive data, this creates a genuine compliance problem. The European Court of Justice ruled in *Schrems II* (2020) that the US-EU Privacy Shield arrangement was invalid precisely because US surveillance law doesn't provide adequate protection for EU data subjects. The subsequent EU-US Data Privacy Framework has been challenged and may face similar scrutiny.

The practical upshot: storing sensitive EU data with a US-parented provider carries legal risk that isn't going away. For healthcare, legal, and financial data in particular, "stored in Europe" means very little if the company holding the keys is incorporated in Delaware.

## Beebeeb's jurisdiction

Beebeeb is operated by Initlabs B.V., incorporated in the Netherlands (Chamber of Commerce registration: KvK 95157565). We have no US parent company, no US investors with contractual data access rights, and no US-incorporated entity in our corporate structure.

Our legal obligations are:
- **Dutch corporate law** (Burgerlijk Wetboek)
- **GDPR** (Regulation (EU) 2016/679), enforced by the Autoriteit Persoonsgegevens
- **Dutch criminal procedure** for law enforcement requests
- **NIS2 Directive** (Network and Information Security)

If a Dutch court orders us to produce user data, we comply — but we can only produce what we have, which is encrypted ciphertext. This isn't a legal loophole. It's what zero-knowledge architecture produces.

## The infrastructure: Hetzner, Falkenstein

Our primary data center is in Falkenstein, Saxony, Germany. The facility is operated by Hetzner Online GmbH, a German company founded in 1997. Hetzner has no US ownership, no US operations, and is subject to German data protection law (Bundesdatenschutzgesetz) alongside GDPR.

We chose Hetzner's Falkenstein data center specifically rather than "EU infrastructure" generically for several reasons, which we've covered in more detail in a separate post. The short version: German data center law is among the strictest in the world, Hetzner has a strong track record, and the jurisdiction is unambiguous.

## Why jurisdiction alone isn't enough

Here's the thing: jurisdiction matters, but it's not sufficient. A company could be incorporated in Luxembourg, use German infrastructure, and still have full access to all your files because they hold the encryption keys. "EU-governed" and "private" are different properties.

Beebeeb's architecture means that even within the applicable legal frameworks — Dutch law, German law, GDPR — the data we hold is useless without the master key, which we don't have. A court order requiring us to produce file contents would be technically complied with: we'd hand over encrypted ciphertext. Without the key, it reveals nothing.

The combination of zero-knowledge encryption and EU jurisdiction is what actually provides meaningful privacy protection. Either property alone is weaker than both together.

## What this means in practice

If you're a European business handling personal data under GDPR: you can use Beebeeb without the Cloud Act exposure that comes with US-headquartered providers.

If you're a journalist, lawyer, or doctor: EU jurisdiction means requests for your data go through EU legal processes, with EU procedural protections.

If you're an individual who just wants their photos and documents to be private: the architecture means we literally cannot read them, and the jurisdiction means no foreign government can compel us to produce them either.

We're not the only European cloud storage provider. We are one of the few that combines EU jurisdiction with genuine zero-knowledge encryption. Both properties are necessary. Neither is sufficient on its own.

"Made in Europe" means something when the company is actually European, the infrastructure is actually in Europe, and the architecture makes the jurisdiction meaningful. That's what we've built.

— Wijchen, Netherlands. May 2026.
