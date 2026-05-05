---
title: "How zero-knowledge encryption actually works"
date: "2026-04-21"
author: "Guus Langelaar"
excerpt: "A plain-language explanation of AES-256-GCM, OPAQUE, and key derivation — and why the order of operations matters more than the algorithm names."
readingTime: 6
---

"End-to-end encrypted" has become a marketing phrase that means very different things depending on who's saying it. Some products encrypt data in transit but store plaintext on the server. Some encrypt files but keep the keys in a company-controlled vault. Some use client-side encryption but include a backdoor for "account recovery" that requires the company to hold a copy of your key.

Beebeeb is zero-knowledge by architecture. Here's what that means in concrete terms, without the usual hand-waving.

## The key hierarchy

The foundation of Beebeeb's security is a three-level key hierarchy. Each level derives from the one above it.

**Level 1: Master key.** This is a random 256-bit key that never leaves your device. It's generated when you create your account and is tied to your password via the OPAQUE protocol (more on this below). The master key is what makes everything else work — lose it and you lose access to your files. We cannot recover it for you. This isn't a limitation we're planning to fix; it's an intentional design property.

**Level 2: File keys.** Each file you upload gets a unique 256-bit encryption key derived from the master key and the file's unique ID using HKDF-SHA256, a standard key derivation function. The derivation is deterministic — given the same master key and file ID, you always get the same file key. This means we don't need to store file keys anywhere: they're re-derived on demand when you decrypt a file.

**Level 3: Chunk keys.** Large files are split into chunks before encryption. Each chunk is encrypted with the file key but uses a unique random nonce. This matters for two reasons: if one chunk is corrupted, only that chunk's data is unrecoverable (not the whole file); and the same plaintext chunk encrypted twice produces different ciphertext, which prevents statistical analysis.

## The cipher: AES-256-GCM

Every chunk is encrypted with AES-256-GCM. The "GCM" part stands for Galois/Counter Mode, which provides *authenticated encryption*: the cipher not only scrambles the data, it also produces an authentication tag that proves the data hasn't been modified. If even one bit of a chunk is flipped — by a storage error, a network glitch, or a malicious actor — decryption fails and the tampering is detected.

The "256" means the key is 256 bits (32 bytes). Current quantum computers cannot crack AES-256; even a theoretical large-scale quantum computer running Grover's algorithm would reduce the effective security to 128 bits, which remains computationally infeasible to brute-force.

Each chunk has a 12-byte nonce. The nonce doesn't need to be secret — it's stored alongside the ciphertext — but it must be unique per key. Beebeeb generates nonces randomly using the browser's `crypto.getRandomValues()`, which is seeded from the OS's entropy pool.

## Authentication: OPAQUE

OPAQUE is a Password-Authenticated Key Exchange (PAKE) protocol developed by researchers at MIT and Stanford. It was standardized by the IETF in 2023. The key property is that your password never leaves your device, even during registration.

Here's how a traditional password system works: you type your password, it's hashed (say, with bcrypt or Argon2), and the hash is sent to the server. The server stores the hash. When you log in, the hash is compared.

The problem: the server sees a hash of your password. If the server is compromised, an attacker has the hash. With a weak password, offline cracking is feasible.

OPAQUE works differently. During registration, your client and the server execute a cryptographic protocol in which the server learns a "credential file" that proves you know the password, but the server never learns the password or any hash of it. During login, the protocol runs again — the server verifies you know the password without you sending it, and both sides derive a shared session key.

From our perspective, this means we literally have nothing to compromise. There are no password hashes in our database that could be leaked.

## Where the encryption runs

All encryption and decryption runs in your browser, in WebAssembly. The WASM module is compiled from Rust — our core cryptography library is open source and auditable. If you're technical enough to care, you can compile it yourself and verify the binary matches what we serve.

The sequence for an upload is:
1. Your browser generates a file key (derived from master key + file ID via HKDF).
2. The file is chunked.
3. Each chunk is encrypted in-browser using AES-256-GCM.
4. Only the ciphertext is sent to our servers.

The sequence for a download is the reverse: ciphertext arrives from our servers, your browser decrypts it, you see the file. We never see the plaintext.

## What we can see

We can see: encrypted ciphertext, file sizes, the number of chunks, timestamps, and account email addresses (needed to send verification emails).

We cannot see: filenames, file contents, folder names, or anything about what you're storing.

This isn't a policy. It's a consequence of the architecture. Even if we wanted to read your files — even under a court order — the data on our servers is indistinguishable from random noise without your master key, which we don't have.

That's what zero-knowledge means.
