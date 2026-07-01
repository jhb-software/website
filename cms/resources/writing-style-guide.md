---
title: Writing Style & Tonality Guide
description: Voice, structure, formatting, linking and SEO rules for JHB Software articles (en/de).
---

# Writing Style & Tonality Guide — JHB Software Articles

For articles in the `articles` collection, in both `en` and `de`.

## Reader

A practicing developer (Payload, Astro, Next.js, Vercel, MongoDB, TypeScript) who
arrived from a search with a concrete problem and wants a working, trustworthy answer.

## Voice

Like a **senior engineer documenting something they built and use** — a technical
paper, not a marketing post.

- **Objective and precise.** Factual, scientific register. State how things work;
  don’t cheer-lead. No promotional reader address (`Discover…`, `Are you …?`,
  `The good news:`).
- **Honest about trade-offs.** Real sections for _When Not to Use_ / _Alternatives_.
  Credibility comes from naming limits.
- **Well-sourced.** Exact versions and numbers (`3.65.0`, `maxPoolSize: 10`, `500`),
  and links to primary sources (see below).

## Structure

Typical arc (not every section is mandatory, but the spine is consistent):

1. **Intro (no heading)** — name the scenario and the problem as facts.
2. **Problem / context** — what breaks without a solution; concrete stakes.
3. **Solution** — name the feature, hook, package, and the version it landed in.
4. **How it works** — the mechanism, often a capability list.
5. **Implementation** — code, introduced by a framing sentence.
6. **Code walkthrough** — key lines/options, one bullet each.
7. **Balance section** — _When Not to Use_ / _Alternatives_ / _Good to Know_. A
   signature of our content; don’t skip it on opinionated pieces.
8. **Conclusion** — recap the payoff, give a concrete next step.

Headings: descriptive, keyword-rich H1 (doubles as SEO title); section headings often
phrased as questions (`What Are Virtual Fields?`, `When Not to Use …`).

## Formatting

- **Bulleted lists with a bold lead-in:** `**Term — explanation**` (em dash separates).
- **Inline code** for every identifier, option, package, version.
- **Code blocks** get a framing sentence; keep useful inline comments and reference
  links inside the code.
- **Specifics over vagueness** — exact number/version/limit, never “a lot”/“recently”.

## Link generously

Linking is core to our style. **Whenever something can be linked, link it** — this is
what makes us well-sourced. Link the **first** meaningful mention of:

- **APIs / hooks / options / config** → the official docs page.
- **Packages / features** → npm, the **GitHub repo**, or the **PR/release** that
  introduced it.
- **Concepts / guides** → the canonical write-up.
- **Our own related articles** → cross-link via their internal path.

Prefer primary/official sources; use the term itself as anchor text (never “click
here”). Many links per article is normal and good.

## German (`de`)

- **No reader address — write objectively.** Neither “Sie/Ihnen/Ihre” nor “du”. Avoid
  _“Erfahren Sie, wie Sie …”_. Use impersonal forms (`man`, `lässt sich …`, passive,
  nominalizations); inclusive scientific “wir” is fine.
  - _“Erfahren Sie, wie Sie MongoDB-Verbindungen optimieren”_ →
    _“Wie sich MongoDB-Verbindungen optimieren lassen”_.
- **Keep technical terms in English** (_Hook, Pooling, Cold Start, serverless,
  Cluster, Deployment_); identifiers/packages stay verbatim.
- Mirrors the EN article 1:1 (same structure, code, and links), but must read as
  natural German.

## SEO / metadata

- **`meta.title`** — descriptive, keyword-rich; DE convention appends `… | JHB Software`.
- **`excerpt` / `meta.description`** — one or two sentences, benefit-first but
  objective: _“This article shows how to …”_ / _“Wie sich … optimieren lassen.”_,
  never _“Learn how you can …”_ / _“Erfahren Sie, wie Sie …”_.
- **`tags`** — reuse existing tags; don’t invent near-duplicates.
- **`image.alt`** — a full sentence restating the topic.

## Checklist

- [ ] Intro states scenario + problem as facts; no salesy/question opener.
- [ ] Objective register throughout; no “Sie”/“du”/promotional “you”.
- [ ] A balance section for opinionated pieces.
- [ ] Identifiers/options/packages in inline code with exact versions.
- [ ] Linked generously: docs for APIs, GitHub/PR for features, cross-links to our articles.
- [ ] Lists use `**Term — explanation**`; code blocks have a framing sentence.
- [ ] Conclusion recaps payoff + next step.
- [ ] DE reads as natural, impersonal German with English tech terms and the same links.
- [ ] `meta.title`, `excerpt`, `tags`, `image.alt` set, objective, benefit-first.
