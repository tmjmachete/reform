---
name: Reform Journal
description: Written companion to the re:form Podcast — honest conversations about faith, life, and finding your way back.
colors:
  ink: "#1a1612"
  ink-light: "#4a4035"
  gilt-scripture: "#C9933A"
  gilt-soft: "#e8c07a"
  cream: "#faf7f2"
  cream-deep: "#f0ebe0"
  writing-ink: "#1B3A5C"
  writing-ink-mid: "#2D6A9F"
  rule: "#d6cfc4"
  verse-bg: "#f4f0e8"
  stc-border: "#8B6914"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(38px, 7vw, 58px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(22px, 5vw, 28px)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "18px"
    fontWeight: 300
    lineHeight: 1.85
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "10px"
    fontWeight: 400
    letterSpacing: "0.3em"
rounded:
  none: "0"
  sm: "2px"
  md: "4px"
spacing:
  sm: "14px"
  md: "24px"
  lg: "48px"
  xl: "80px"
components:
  issue-chip:
    backgroundColor: "rgba(201,147,58,0.1)"
    textColor: "{colors.gilt-scripture}"
    rounded: "{rounded.sm}"
    padding: "5px 14px"
  issue-chip-border:
    backgroundColor: "transparent"
    textColor: "{colors.gilt-scripture}"
    rounded: "{rounded.sm}"
    padding: "5px 14px"
  post-card-cta:
    backgroundColor: "transparent"
    textColor: "{colors.gilt-scripture}"
    rounded: "{rounded.none}"
    padding: "0"
---

# Design System: Reform Journal

## 1. Overview

**Creative North Star: "The Broadsheet Confession"**

Reform Journal is designed as a high-quality literary broadsheet about the interior life. Think of a print paper left on a table: it has gravitas and permanence; its typography asks you to slow down before you read. The "Confession" half of the metaphor carries the honesty: this is not a curated highlight reel of faith. It names the difficulty. The design earns that candor by refusing every aesthetic shortcut that signals produced content.

The color strategy is Restrained. Cream surfaces and warm dark ink carry 90% of the visual weight. Gilt Scripture gold appears only where it earns its presence: issue labels, rule marks, directional arrows. Writing Ink deep blue anchors the masthead and scripture references — places where weight and permanence are structurally required, not decorative choices. Three typefaces do all the work: Playfair Display sets authority; Source Serif 4 earns trust over length; DM Sans handles everything functional.

This system explicitly rejects SaaS-style ministry tech: gradient backgrounds, glassmorphism, bold product-launch typography. It equally rejects the generic Christian publishing aesthetic: pastel palettes, stock cross imagery, decorative callout boxes, clip-art religious iconography. Both signals say "produced content." This system says "written letter."

**Key Characteristics:**
- Paper-warm cream surfaces with almost no visual noise
- Two editorial typefaces bearing all hierarchy; one sans for function
- Gold as a rare, specific accent — never a background fill, never in prose
- Deep blue as ink-heavy permanence, not atmosphere
- Flat surfaces; depth through tonal layering, never shadows

## 2. Colors: The Broadsheet Palette

Three color families: Gilt (warmth and function), Writing Ink (weight and permanence), Warm Paper (the surface itself). Gold and blue never compete — they serve different emotional registers.

### Primary
- **Gilt Scripture** (#C9933A): Issue labels, horizontal rules, CTA arrows, section marker dots. The accent that marks what matters. Never used as a background fill or in continuous body copy. Its scarcity is the mechanism.
- **Gilt Soft** (#e8c07a): Issue chip borders, secondary gold echoes. The quieter version of Gilt Scripture; used for outlines and secondary callouts where full gold would dominate.

### Secondary
- **Writing Ink** (#1B3A5C): Hero masthead background, scripture quotation text, emphatic italic passages. Every surface that requires weight and permanence.
- **Writing Ink Mid** (#2D6A9F): Scripture block accent borders, secondary reference marks. The mid-tone that prevents Writing Ink from feeling isolated.

### Neutral
- **Ink** (#1a1612): All body copy, article headlines, site name. Nearly-black with a warm brown undertone — never pure black.
- **Ink Light** (#4a4035): Metadata, dates, captions, secondary text, hero taglines. Warm mid-tone that reads comfortably against cream at small sizes.
- **Cream** (#faf7f2): Primary surface. Slightly warm, slightly off-white. The paper the journal is printed on.
- **Cream Deep** (#f0ebe0): Secondary surfaces: about strips, scripture block backgrounds, alternate section fills. A deeper paper tone that creates quiet separation without contrast.
- **Rule** (#d6cfc4): Section dividers, post card separators, horizontal rules. Light enough to never compete with editorial content.
- **Verse Background** (#f4f0e8): Scripture block fill. The warmest paper tone, reserved for quoted scripture and citations to visually mark them as received text.

### Named Rules
**The One Gilt Rule.** Gold appears on ≤10% of any screen. Its scarcity is what makes it feel precious rather than decorative. If you find yourself considering gold as a section background or a heading color, the answer is no.

**The Two Registers Rule.** Gold and blue serve different purposes and should never appear adjacent as competing accents. Gold marks function; blue marks permanence. An element with both is confused about what it is.

## 3. Typography: The Broadsheet Triad

**Display Font:** Playfair Display (Georgia, serif fallback)
**Body Font:** Source Serif 4 (Georgia, serif fallback)
**Label Font:** DM Sans (system sans-serif fallback)

**Character:** Playfair Display commands silence — the headline that asks you to stop before you read. Source Serif 4 earns trust over length; its generous x-height and warm curves make 1,500 words feel like 500. DM Sans handles everything functional: dates, labels, metadata. Three voices in total, each with a clear jurisdiction. They do not cross-pollinate.

### Hierarchy
- **Display** (Playfair Display, 700, clamp(38px, 7vw, 58px), line-height 1.15, -0.02em tracking): Article titles only. One per page. Italic `<em>` within display type shifts to Writing Ink blue.
- **Headline** (Playfair Display, 700, clamp(22px, 5vw, 28px), line-height 1.25, -0.01em tracking): Post card titles on the index. Italic emphasis shifts to Writing Ink blue. First post (latest) scales up to clamp(26px, 6vw, 34px).
- **Site Name / Masthead** (Playfair Display, 700, clamp(36px, 9vw, 56px), color white): The hero treatment of the journal name. Functionally the logotype; italic `<em>` shifts to Gilt Soft.
- **Body** (Source Serif 4, 300, 18px, line-height 1.85): All article prose. Maximum container width is 660px (~65-70ch at 18px). Leading is intentionally generous — this writing is meant to be read slowly. The lead paragraph increases to 21px italic at Source Serif 4 with Ink Light color.
- **Label** (DM Sans, 400-500, 10-12px, 0.15-0.35em tracking, all-caps): Dates, issue numbers, category chips, CTA arrows, figure captions. The functional layer. Never competes with editorial voice.

### Named Rules
**The Weight Rule.** Hierarchy is enforced through size and weight contrast, never through color. Gilt Scripture gold does not distinguish headings from body copy — scale and weight do that. Gold marks function, not semantic importance.

**The Italic Voice.** Italic in Playfair Display or Source Serif 4 signals editorial interiority: the personal, the reflective, the uncertain. DM Sans is never italicized in the interface layer. Italic is reserved for the writing itself.

**The Jurisdiction Rule.** Playfair Display belongs to display and headline roles. Source Serif 4 belongs to body prose and article subtitles. DM Sans belongs to UI labels, dates, and metadata. No typeface crosses into another's jurisdiction.

## 4. Elevation

This system is flat. Surfaces are distinguished by tonal value (cream → cream-deep → writing-ink), not by shadows or blur. The only exception is the sticky masthead's `backdrop-filter: blur(8px)` — a functional choice that prevents scrolling prose from bleeding through as it passes beneath the header. It is not a decorative choice and should not be replicated for other surfaces.

There is no shadow vocabulary. Depth is communicated through:
1. Background tonal steps (cream → cream-deep → writing-ink)
2. The rule token for horizontal separation between content zones
3. The single gilt-soft border on issue chips marking interactive elements

### Named Rules
**The Flat-Or-Committed Rule.** Surfaces are either flat (on cream, no shadow, no border) or fully committed to a background color (the Writing Ink hero; the Cream Deep strips). There is no middle ground of subtle card shadows, elevated panels, or lifted tiles. If a surface needs to feel distinct from its neighbor, change its background tint — never add a shadow.

**The One Blur Rule.** The masthead backdrop blur is the only blur in the system. It solves a specific scroll problem. Any new use of `backdrop-filter` requires the same level of justification; decorative glass panels are prohibited.

## 5. Components

### Sticky Masthead
A quiet landmark. Small, centered, typographically precise. It should feel like the nameplate on a journal — not a navigation bar.
- **Background:** cream with `backdrop-filter: blur(8px)` — functional transparency only
- **Brand name:** Playfair Display 700, gilt-scripture, 13px, 0.35em tracking, uppercase
- **Tagline:** DM Sans 400, ink-light, 11px, 0.15em tracking, uppercase; strong tags in gilt-scripture
- **Border:** 1px solid rule at bottom
- **Position:** sticky top-0, z-index 100

### Issue Chip
The visual accent that marks time and category. Used exclusively for issue numbers and entry labels.
- **Shape:** 2px radius — almost square, just enough to not feel hard
- **Background:** gilt-scripture at 10% opacity (#C9933A1a)
- **Border:** 1px solid gilt-soft
- **Text:** gilt-scripture, DM Sans 400, 10-11px, 0.25-0.3em tracking, uppercase
- **Usage:** Never repurposed as a navigation tab, interactive filter, or decorative label

### Post Card (Index)
Post cards carry no visual container of their own. The article is the card; the border below is the only separator.
- **Structure:** Full-width `<a>` block, no background fill, no radius, no shadow
- **Separator:** 1px solid rule, border-bottom
- **Meta row:** issue chip + date in DM Sans ink-light, displayed as flex row
- **Title:** Headline typography, ink; italic `<em>` in writing-ink blue
- **Excerpt:** Source Serif 4 italic, 15px, ink-light
- **CTA:** DM Sans uppercase gilt-scripture, 12px, 0.18em tracking, with `→` that translates +4px on hover
- **Hover state:** CTA arrow only; the card itself remains flat

### Article Hero
The moment before the writing begins. Generous space, centered, restrained.
- **Container:** max-width 720px, centered, 56px top padding, 36px bottom
- **Issue label:** issue chip component above title
- **Title:** Display typography; italic `<em>` in writing-ink blue
- **Subtitle:** Source Serif 4 italic, 17px, ink-light, max-width 480px, line-height 1.6
- **Rule:** 40px wide, 2px, gilt-scripture, centered between subtitle and byline
- **Byline:** DM Sans ink-light uppercase; journal name in gilt-scripture bold

### Scripture Block
Quoted scripture is received text — it has a different texture than the author's prose.
- **Background:** verse-bg (#f4f0e8) — the warmest paper tone, reserved for this use alone
- **Left border:** 4px solid writing-ink-mid — marks the boundary between received and written text (see Do's and Don'ts note)
- **Radius:** `0 4px 4px 0` — right side only; left is flush with the accent border
- **Reference label:** DM Sans 500, writing-ink-mid, 11px, 0.2em tracking, uppercase
- **Text:** Playfair Display italic, 17px, writing-ink, line-height 1.65

### Source / Citation Block
For external quotations and attributed sources. Parallel structure to scripture blocks but in a warmer amber register.
- **Background:** stc-bg (#f0ede6)
- **Left border:** 4px solid stc-border (#8B6914) — amber-gold, distinct from both gilt-scripture and writing-ink
- **Text:** Source Serif 4 italic, ink

### Section Marker
Chapter-break device between major article sections. Horizontal, light, unhurried.
- **Structure:** `dot — line — label — line` layout
- **Dot:** 8px circle, gilt-scripture background
- **Lines:** flex-grow, 1px solid rule
- **Label:** DM Sans 400, ink-light, 10px, 0.3em tracking, uppercase

## 6. Do's and Don'ts

### Do:
- **Do** use Gilt Scripture (#C9933A) only for functional accent marks: issue chips, horizontal rules, CTA arrows, section dots, brand name in masthead. Rarity makes it feel earned.
- **Do** use Writing Ink (#1B3A5C) wherever permanence and weight are required: hero backgrounds, scripture quotation text, structural blue emphasis.
- **Do** keep all article body prose in Source Serif 4 Light (300) at 18px with line-height 1.85. Long-form reading requires that air.
- **Do** use DM Sans exclusively for functional metadata: dates, labels, CTAs, captions, masthead taglines. It never appears in article prose.
- **Do** distinguish surfaces through background tonal steps (cream → cream-deep → writing-ink), not through shadows or borders.
- **Do** verify contrast for DM Sans label text in Gilt Scripture at 10-11px — this is borderline WCAG AA and should be checked against its background.
- **Do** use `prefers-reduced-motion` to suppress the fadeUp animations; they are enhancement only, never load-bearing.

### Don't:
- **Don't** use gradient backgrounds, glassmorphism panels, or blurred overlay cards anywhere except the functional masthead blur. These are SaaS-style ministry tech and are explicitly prohibited by the brand brief.
- **Don't** use pastel fills, stock cross or dove imagery, clip-art religious iconography, or template-style callout boxes. The generic Christian publishing aesthetic signals produced content, not honest writing. It is prohibited.
- **Don't** use color alone to create typographic hierarchy. Headline vs. body distinction comes from scale and weight. Gold marks function, never importance.
- **Don't** add box-shadows, card elevation, or lifted panels. The system is flat by commitment.
- **Don't** use Playfair Display for body prose, captions, or UI labels. It belongs to display and headline roles.
- **Don't** use Source Serif 4 for navigation, dates, or any functional metadata. That work belongs to DM Sans.
- **Don't** italicize DM Sans in the interface layer. Italic is reserved for editorial voice in Playfair and Source Serif 4.
- **Don't** replicate the `border-left` stripe pattern from the current scripture and lead-paragraph components in new components. Those patterns are inherited and flagged for review against the impeccable absolute ban on side-stripe borders. New blockquotes, callouts, or alerts should use full borders, background tints, or leading icons instead.
- **Don't** let gold and Writing Ink blue appear as competing adjacent accents. They serve separate registers: function vs. permanence.