# Chainmail Arc

CHAINMAIL — Official Web3 Website & MVP

Build a complete, premium, production-quality website and MVP web application for CHAINMAIL.

CHAINMAIL is inspired by the original open-source Chainmail project:

https://github.com/zepeng811/chainmail

The original project describes itself as:

“Protecting email recipients using the blockchain.”

and implements the concept of authenticated email using blockchain, including PGP-based sender authentication, fingerprint registration, sender identity registration, message registration, and message verification.

The new CHAINMAIL website should modernize this concept and prepare it for the Arc ecosystem.

IMPORTANT:

The original repository is the technical/conceptual reference.

Do NOT blindly copy its outdated Ethereum/Goerli configuration.

Do NOT claim that the original repository is already deployed on Arc.

The new website should clearly present CHAINMAIL as an Arc-focused implementation inspired by the original Chainmail architecture.

1. BRAND

Project name:

CHAINMAIL

Primary positioning:

Verified Communication for the On-Chain Era.

Secondary tagline:

Encrypted Email. On-Chain Trust.

Core concept:

CHAINMAIL brings cryptographic identity and blockchain-backed verification to digital communication.

Brand keywords:

communication

verification

identity

cryptography

trust

blockchain

privacy

Web3

Arc

The website must feel like serious Web3 infrastructure.

It should NOT look like:

a meme coin website

a generic crypto token landing page

a casino

a trading platform

a generic AI SaaS

an exaggerated “100x” project

a fake enterprise website

The visual identity should feel like:

Cybersecurity + Web3 Infrastructure + Digital Communication

2. OFFICIAL ASSETS — CRITICAL

The user has supplied official CHAINMAIL assets.

Use the uploaded image files DIRECTLY.

The latest supplied assets are:

CHAINMAIL logo

CHAINMAIL 3:1 banner

Use the supplied assets as the source of truth for the visual identity.

DO NOT:

redraw the logo

generate a replacement logo

create a different logo

convert the logo into JSON

convert the logo into SVG

recreate the logo with CSS

replace the supplied banner

use a random stock image

use an AI-generated replacement

distort the logo

change its proportions

The images must remain normal image files.

For example:

public/
assets/
chainmail-logo.png
chainmail-banner.png

Use normal image references:

/assets/chainmail-logo.png
/assets/chainmail-banner.png

Do not encode image contents into JSON.

Do not inline image data.

Do not replace the files with generated placeholders.

3. VISUAL REFERENCE

The latest logo defines the visual identity.

Primary visual characteristics:

black background

cyan

turquoise

electric blue

violet

purple

subtle neon glow

geometric shapes

circular/orbital structure

envelope symbolism

chain symbolism

The banner follows the same identity.

The entire website must visually match the supplied assets.

Use the same general color language throughout the website.

Recommended palette:

Deep Black
#020207

Deep Navy
#050B1A

Cyan
#22D3EE

Turquoise
#2DD4BF

Electric Blue
#3B82F6

Violet
#8B5CF6

Purple
#A855F7

White
#F8FAFC

Muted Gray
#94A3B8

Do not introduce bright red, orange, yellow, or unrelated colors unless required for system status/error states.

4. WEBSITE GOAL

The website has two purposes:

PUBLIC WEBSITE

Explain:

what CHAINMAIL is

what problem it solves

how it works

why blockchain verification matters

how the original repository relates to the project

why Arc is the target ecosystem

future roadmap

MVP APPLICATION

Allow users to:

Connect wallet

Establish Chainmail identity

Sign a message

Verify a signed message

View verification information

Keep the MVP simple.

Do NOT attempt to build a full Gmail replacement in V1.

5. NAVIGATION

Create a sticky navigation bar.

Left:

Official CHAINMAIL logo.

Center:

About

How It Works

Technology

Roadmap

Right:

GitHub

Buy

Launch App

Mobile:

Use a clean hamburger navigation.

6. SOCIAL LINKS

Only include:

X

GitHub

No:

Telegram

Discord

Instagram

Facebook

LinkedIn

Medium

Reddit

Do NOT invent an X URL.

Create an environment/config variable for the X URL if it has not been provided.

GitHub URL:

https://github.com/zepeng811/chainmail

7. BUY BUTTON

The Buy button must link to:

https://radardex.pro

Use:

target="_blank"
rel="noopener noreferrer"

The button label:

Buy

Do not create an internal swap page.

Do not create fake trading data.

Do not display:

token price

market cap

liquidity

volume

holders

fake exchange data

unless real APIs are intentionally integrated later.

The Buy button simply opens:

radardex.pro

8. CONTRACT ADDRESS

The contract address is NOT available yet.

Display:

CA: Coming Soon

Do NOT invent an address.

Do NOT use an example wallet address.

Do NOT display a fake contract.

Make the contract address configurable so it can later be changed easily.

Example:

VITE_CHAINMAIL_CONTRACT_ADDRESS=

Until configured:

Coming Soon

9. HERO SECTION

Use the supplied CHAINMAIL banner asset directly.

Do not recreate the artwork.

Do not create a new hero image.

Hero should visually resemble the supplied banner.

Hero copy:

CHAINMAIL

Verified Communication for the On-Chain Era.

Supporting text:

CHAINMAIL brings cryptographic identity and blockchain-backed verification to digital communication.

Primary CTA:

Launch App

Secondary CTA:

View GitHub

Additional status:

Built on Arc

CA: Coming Soon

Do not include:

Launch App text inside the image itself

View GitHub text inside the image itself

Those are website buttons only.

10. HERO BANNER CONTENT

The supplied banner already contains:

CHAINMAIL

Verified Communication for the On-Chain Era

Encrypted Email

On-Chain Trust

Privacy by Design

Built on Arc

Powered by @Circle

Preserve the banner as supplied.

Do not recreate these elements separately inside the image.

The website may repeat the important messaging as HTML text below/around the image if necessary.

11. POWERED BY CIRCLE

The brand messaging should include:

Powered by @Circle

Use this wording consistently where appropriate.

Do not fabricate additional Circle partnership claims.

Do not claim:

official partnership

grant

investment

endorsement

unless there is verified evidence.

The visual phrase Powered by @Circle should remain limited to the supplied project branding.

12. HERO RESPONSIVENESS

Desktop:

Use the supplied 3:1 banner prominently.

Tablet:

Scale proportionally.

Mobile:

Do not simply shrink the entire desktop banner until text becomes unreadable.

Use responsive cropping/object positioning.

Important:

The CHAINMAIL logo and main branding must remain visible.

Do not replace the supplied banner with another image.

13. ABOUT SECTION

Headline:

Communication You Can Verify.

Copy:

Traditional communication relies heavily on centralized trust. CHAINMAIL explores a blockchain-backed approach where sender identity, cryptographic signatures, and verification data can establish a verifiable origin for digital communication.

Add a technical note:

Private message content should remain off-chain. Blockchain should be used for identity, verification metadata, and proofs where appropriate.

This is important.

Do not claim that message contents are stored on-chain.

14. PROBLEM SECTION

Headline:

Can You Trust the Sender?

Explain the problem:

Digital communication can be difficult to authenticate.

A recipient may receive a message claiming to come from:

a person

a company

a protocol

a DAO

an organization

But the recipient needs a way to establish:

Who actually sent it?

CHAINMAIL addresses this with cryptographic identity and blockchain-backed verification.

15. HOW CHAINMAIL WORKS

Create a clean four-step visual system.

01 — IDENTITY

Establish a Chainmail identity associated with a wallet.

02 — SIGN

Cryptographically sign communication.

03 — REGISTER

Register the relevant identity or verification information.

04 — VERIFY

Allow the recipient to verify the authenticity of the message.

Visual:

IDENTITY
↓
SIGN
↓
REGISTER
↓
VERIFY

Use animated connection lines and subtle glowing nodes.

16. ORIGINAL CHAINMAIL ARCHITECTURE

Create a technology explanation based on the original repository.

The original repository includes:

PGP

email address registration

PGP fingerprint registration

Ethereum sender address registration

email message registration

email verification

smart contract interaction

Do not falsely claim that these features have all been rebuilt in the new frontend.

Instead explain:

The original Chainmail implementation demonstrates a blockchain-backed email authentication architecture using PGP identities, fingerprints, sender addresses, and registered messages.

Then show the modernized direction:

PGP / Cryptographic Identity
↓
Chainmail Layer
↓
Blockchain Trust
↓
Arc
↓
Verification

17. CORE FEATURES

Create four premium cards.

Cryptographic Identity

Associate communication with a verifiable cryptographic identity.

Message Verification

Verify that a signed message corresponds to the claimed sender.

Blockchain-backed Trust

Use blockchain infrastructure as a verifiable trust layer.

Privacy by Design

Keep private communication data off-chain and use blockchain for verification-related information.

18. IMPORTANT SECURITY LANGUAGE

Do not make technically inaccurate claims.

Do NOT claim:

Every message is encrypted.

unless encryption has actually been implemented.

Do NOT claim:

All email is stored on-chain.

That is not the intended architecture.

Do NOT claim:

Fully decentralized email.

unless the actual system meets that definition.

Instead use:

Cryptographic identity and blockchain-backed message verification.

The original repository uses PGP-based signing and verification. Preserve this concept accurately.

19. ARC SECTION

Create a large section:

Built on Arc

Copy:

CHAINMAIL is designed to bring verifiable communication infrastructure into the Arc ecosystem.

Visual:

CHAINMAIL
↓
Cryptographic Identity
↓
Verification Layer
↓
ARC
↓
On-Chain Trust

Use a minimal technical visual.

Do not fabricate Arc statistics.

Do not fabricate transaction counts.

Do not fabricate contract addresses.

Do not hardcode network parameters without verification.

20. ARC CONFIGURATION

The application must be Arc-ready.

Use environment variables:

VITE_ARC_RPC_URL=
VITE_ARC_CHAIN_ID=
VITE_ARC_EXPLORER_URL=
VITE_CHAINMAIL_CONTRACT_ADDRESS=

Before production deployment, verify the current official Arc configuration.

Do not use old Goerli configuration from the original repository.

The original repository references Ethereum/Goerli-era infrastructure, so treat those values as historical reference only.

Never reuse its private-key configuration.

21. WALLET CONNECTION

MVP wallet functionality:

Connect Wallet

Use a standard EVM wallet connection flow.

Support:

browser wallets

WalletConnect-compatible wallets if appropriate

Never ask for:

seed phrase

private key

secret recovery phrase

Never store private keys.

Never build custodial wallet functionality.

22. CHAINMAIL IDENTITY

After connecting a wallet:

Show:

CHAINMAIL IDENTITY

@username

Wallet
0x...

Network
Arc

Status
✓ Connected

For V1, the identity can simply associate a user-selected Chainmail identifier with the connected wallet.

Do not build a complicated naming protocol unless required.

23. DASHBOARD

Route:

/app

Design:

Dark premium interface matching the landing page.

Sidebar:

Overview

Compose

Verify

Identity

Settings

Top:

CHAINMAIL logo

Arc network status

wallet address

Disconnect

24. DASHBOARD OVERVIEW

Display:

Chainmail Identity

@alice

Wallet
0x1234...5678

Network
Arc

Status
Connected

Verification

Messages Verified
—
Identity Status
Connected

Do not display fake numerical statistics.

Use — until real data exists.

25. COMPOSE MESSAGE

Create:

Compose Message

Recipient
[ @recipient ]

Message
[........................]

[ SIGN MESSAGE ]

When user clicks:

SIGN MESSAGE

Wallet signature request opens.

States:

Ready

Waiting for wallet...

Signing...

Signature created

Verified

Do not call a signature an on-chain transaction.

Wallet signing and blockchain transactions are different.

26. VERIFY MESSAGE

Route:

/app/verify

Interface:

Verify Message

Sender
[ ]

Message
[ ]

Signature
[ ]

Chainmail Identity
[ ]

[ VERIFY ]

Result:

VERIFIED

✓ VERIFIED MESSAGE

Sender
@alice

Wallet
0x...

Signature
Valid

Identity
Verified

Network
Arc

Failure:

✕ VERIFICATION FAILED

The supplied message could not be authenticated.

27. VERIFICATION LOGIC

Separate verification logic from UI.

Suggested structure:

src/
components/
pages/
hooks/
services/
blockchain/
arc.ts
chainmail.ts
verification/
signature.ts
pgp.ts
identity/
identity.ts
types/
utils/

The verification layer should be modular.

This allows PGP verification to be added without rewriting the frontend.

28. PGP SUPPORT

The original Chainmail architecture uses PGP.

The new architecture should leave room for PGP.

Potential future structure:

Wallet Signature +
PGP Signature
↓
Chainmail Verification
↓
Arc

For V1:

Wallet-based message signatures may be the primary web-native authentication mechanism.

Do not display “PGP Verified” unless actual PGP verification is implemented.

If PGP is not implemented:

Display:

PGP Integration — Coming Soon

29. DEMO MODE

Visitors should be able to explore the UI without connecting a wallet.

Create demo mode.

Clearly label demo content:

DEMO

Example:

DEMO

@alice
✓ Verified

Hello from Chainmail.

Do NOT make demo data look like actual blockchain transactions.

Never display fake:

transaction hashes

contract addresses

wallet balances

block numbers

network confirmations

30. OPEN SOURCE PROOF

Create a section:

Open Source Proof

Copy:

CHAINMAIL is inspired by an open-source implementation of blockchain-backed email authentication.

Button:

View GitHub

URL:

https://github.com/zepeng811/chainmail

Show:

Original Chainmail Repository

Do not claim the repository is the new Arc implementation.

Explain:

Original Chainmail
↓
Blockchain Email Authentication
↓
Modern CHAINMAIL
↓
Arc-focused implementation

31. ROADMAP

Use a premium four-stage roadmap.

PHASE 01

Foundation

Website

Wallet connection

Chainmail identity

Message signing

Message verification

Arc integration

Status:

Building

PHASE 02

Private Communication

PGP integration

Encrypted messaging

Secure attachments

Improved identity verification

Status:

Coming Next

PHASE 03

On-Chain Payments

USDC payment requests

Payment links

Invoices

Payment confirmations

Status:

Future

PHASE 04

Agentic Communication

AI agent identities

Agent-to-agent communication

Machine-verifiable messages

Automated payment requests

Status:

Future

No dates.

32. CONTRACT SECTION

Create:

On-Chain Contract

Display:

Contract Address

Coming Soon

When the contract address is configured:

Show:

0x1234...5678

[ COPY ]

[ VIEW ON EXPLORER ]

Only show explorer link when a real address exists.

33. BUY SECTION

Create a small CTA:

Get CHAINMAIL

Button:

Buy

URL:

https://radardex.pro

No tokenomics section.

No fake price.

No fake market data.

34. CTA SECTION

Headline:

Trust Every Message.

Copy:

Communication is evolving. CHAINMAIL adds a verifiable trust layer for the on-chain era.

Buttons:

Launch App

View GitHub

35. FOOTER

Left:

CHAINMAIL logo.

Text:

CHAINMAIL

Verified Communication for the On-Chain Era.

Links:

About

How It Works

Technology

Roadmap

GitHub

Social:

X

GitHub

Additional:

Built on Arc

Powered by @Circle

CA: Coming Soon

Buy:

Buy

→ https://radardex.pro

36. FAVICON

Use the supplied official CHAINMAIL logo as the favicon source.

Generate browser-compatible favicon files from the supplied logo only if necessary.

Required:

favicon.ico
favicon-16x16.png
favicon-32x32.png
apple-touch-icon.png

Do not redesign the logo.

Do not add text to the favicon.

Do not create a different icon.

37. OPEN GRAPH IMAGE

Use the supplied CHAINMAIL banner as the OG image foundation.

Do not generate a different visual identity.

Recommended:

1200 × 630

If the supplied 3:1 banner must be adapted to 1200×630, preserve:

logo

CHAINMAIL name

envelope

lock

neon color palette

core layout

Do not introduce unrelated graphics.

Metadata:

<meta
  property="og:title"
  content="CHAINMAIL — Verified Communication for the On-Chain Era"
/>

<meta
  property="og:description"
  content="Cryptographic identity and blockchain-backed verification for digital communication."
/>

<meta
  property="og:image"
  content="/assets/chainmail-banner.png"
/>

<meta property="og:type" content="website" />

X:

<meta name="twitter:card" content="summary_large_image" />

<meta
  name="twitter:title"
  content="CHAINMAIL — Verified Communication for the On-Chain Era"
/>

<meta
  name="twitter:description"
  content="Cryptographic identity and blockchain-backed verification for digital communication."
/>

<meta
  name="twitter:image"
  content="/assets/chainmail-banner.png"
/>

38. SEO

Title:

CHAINMAIL — Verified Communication for the On-Chain Era

Description:

CHAINMAIL brings cryptographic identity and blockchain-backed verification to digital communication, built on Arc.

Keywords:

Chainmail

blockchain email

Web3 communication

message verification

cryptographic identity

on-chain identity

Arc

blockchain authentication

PGP

secure communication

39. DESIGN SYSTEM

Use:

Typography

Modern geometric sans-serif.

Recommended:

Inter

Geist

Space Grotesk

Headings:

Bold.

Body:

Clean and highly readable.

Avoid decorative fonts.

40. CARD DESIGN

Cards should use:

dark navy/black

thin blue/purple borders

subtle glow

16–24px radius

clean spacing

Do not make every element glow heavily.

Use glow strategically.

41. BACKGROUND

Use:

deep black

deep navy

subtle radial gradients

very subtle grid

network nodes

thin lines

The background should support the content, not overpower it.

Avoid huge animated particle fields.

42. ANIMATION

Use subtle animations:

logo fade-in

section reveal

hover transitions

glowing verification check

signature animation

network line movement

subtle orbital motion

Do not use:

spinning coins

excessive particles

flashing lights

aggressive parallax

excessive 3D

Support:

prefers-reduced-motion

43. RESPONSIVE

Must work perfectly on:

desktop

laptop

tablet

Android

iPhone

Desktop:

Full navigation.

Mobile:

Hamburger menu.

Dashboard mobile:

Bottom navigation:

Overview

Compose

Verify

Identity

Buttons must be touch-friendly.

44. PERFORMANCE

Optimize:

image loading

banner loading

logo loading

fonts

JavaScript

animations

Use lazy loading where appropriate.

Do not load unnecessary libraries.

Do not use heavy 3D libraries.

45. ACCESSIBILITY

Implement:

semantic HTML

alt text

keyboard navigation

visible focus states

sufficient contrast

accessible buttons

accessible forms

Logo alt:

CHAINMAIL

Banner alt:

CHAINMAIL — Verified Communication for the On-Chain Era

46. ERROR STATES

Wallet rejected:

Signature request cancelled.

Wrong network:

Please switch to Arc.

Wallet unavailable:

Connect a compatible wallet to continue.

Verification failed:

Unable to verify this message.

Transaction failed:

The blockchain transaction could not be completed.

Never show fake success.

47. BLOCKCHAIN SECURITY

Never:

ask for private keys

ask for seed phrases

store private keys

expose secrets

hardcode private keys

use private keys from the original repository

reuse demo Anvil accounts

expose development credentials

Use wallet signatures.

Use environment variables for public configuration.

48. ORIGINAL REPOSITORY SECURITY

The original repository contains demo/test configuration and historical Ethereum/Anvil/Goerli setup.

Do NOT import:

private keys

test wallets

demo credentials

old network configuration

into the production frontend.

The repository should only be used as the conceptual and technical reference.

49. TECH STACK

Use:

React

TypeScript

Vite

Tailwind CSS

wagmi

viem

Optional:

shadcn/ui

Lucide icons

Keep the application lightweight.

50. COMPONENT ARCHITECTURE

Suggested:

src/
│
├── components/
│ ├── Navbar.tsx
│ ├── Hero.tsx
│ ├── FeatureCard.tsx
│ ├── HowItWorks.tsx
│ ├── Technology.tsx
│ ├── Roadmap.tsx
│ ├── Footer.tsx
│ └── WalletButton.tsx
│
├── pages/
│ ├── Home.tsx
│ ├── App.tsx
│ ├── Verify.tsx
│ ├── Identity.tsx
│ └── Settings.tsx
│
├── services/
│ ├── blockchain/
│ │ ├── arc.ts
│ │ └── chainmail.ts
│ │
│ ├── verification/
│ │ ├── signature.ts
│ │ └── pgp.ts
│ │
│ └── identity/
│ └── identity.ts
│
├── hooks/
├── types/
└── utils/

Blockchain logic must never be tightly coupled to UI components.

51. ENVIRONMENT VARIABLES

Use:

VITE_ARC_RPC_URL=
VITE_ARC_CHAIN_ID=
VITE_ARC_EXPLORER_URL=
VITE_CHAINMAIL_CONTRACT_ADDRESS=
VITE_CHAINMAIL_X_URL=

If X URL is unknown:

Do not invent one.

Hide the X button until configured, or use a clearly marked placeholder configuration.

52. NO FAKE DATA POLICY

Absolutely no fake:

token price

market cap

liquidity

TVL

holders

transaction volume

contract address

users

messages presented as real

transaction hashes

partnerships

investors

audits

security certifications

Demo data must be labeled:

DEMO

53. IMPORTANT LANGUAGE RULE

Use:

Built on Arc

NOT:

Built for Arc

The supplied branding specifically uses:

BUILT ON ARC

Also use:

Powered by @Circle

exactly where appropriate.

54. PRIMARY BRAND MESSAGE

The website must make the following idea immediately understandable:

CHAINMAIL

Verified Communication for the On-Chain Era.

Supporting message:

Trust the sender. Verify the message.

Three pillars:

IDENTITY

AUTHENTICATION

VERIFICATION

55. FINAL LANDING PAGE ORDER

Use this exact order:

NAVBAR
↓
HERO
↓
TRUST / BRAND PILLARS
↓
THE PROBLEM
↓
WHAT IS CHAINMAIL?
↓
HOW IT WORKS
↓
CORE FEATURES
↓
BUILT ON ARC
↓
TECHNOLOGY
↓
OPEN SOURCE PROOF
↓
ROADMAP
↓
CONTRACT — COMING SOON
↓
CTA
↓
FOOTER

56. FINAL APPLICATION FLOW

LANDING PAGE
↓
LAUNCH APP
↓
CONNECT WALLET
↓
CHAINMAIL IDENTITY
↓
DASHBOARD
↓
SIGN MESSAGE
↓
VERIFY MESSAGE
↓
VERIFIED

This is the MVP.

Do not overbuild the first release.

57. FINAL CHECKLIST

Before completing the project, verify ALL of the following:

BRAND

CHAINMAIL branding is consistent

Supplied logo is used

Supplied banner is used

No logo recreation

No image converted into JSON

No replacement logo

Colors match supplied assets

NAVIGATION

About

How It Works

Technology

Roadmap

GitHub

Buy

Launch App

LINKS

GitHub → https://github.com/zepeng811/chainmail

Buy → https://radardex.pro

X only

No fake social accounts

CONTRACT

CA displays Coming Soon

No fake contract

Configurable contract address

HERO

Supplied banner used directly

No Launch App text inside replacement artwork

No View GitHub text inside replacement artwork

Built on Arc

Powered by @Circle

MVP

Connect wallet

Chainmail identity

Sign message

Verify message

Demo mode

Clear verification status

SECURITY

No private keys

No seed phrases

No hardcoded credentials

No old demo wallets

No fake transactions

TECHNICAL ACCURACY

Original Chainmail repo treated as reference

PGP concept preserved

Arc treated as target blockchain

Old Goerli configuration NOT reused

Message contents NOT claimed to be stored on-chain

Encryption NOT claimed unless actually implemented

PGP verification NOT claimed unless implemented

SEO

Title configured

Description configured

Favicon configured

OG image configured

X card configured

RESPONSIVE

Desktop

Tablet

Mobile

Android

iPhone

FINAL DESIGN DIRECTION

The final website should look like a premium Web3 security/communication infrastructure product.

Think:

Cybersecurity +
Cryptography +
Blockchain +
Communication +
Arc

The supplied CHAINMAIL logo and banner are the primary visual identity.

Do not replace them.

The final impression should be:

CHAINMAIL

Verified Communication for the On-Chain Era.

Trust the sender. Verify the message.

Built on Arc.

Powered by @Circle.

ini link proof tambahan .: https://x.com/jerallaire/status/1762509967980916755

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d5d13366-389c-4600-9bee-72112954a1ce).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
