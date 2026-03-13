# YO Goals

**Goal-based DeFi savings with AI-optimized multi-vault strategies on Base.**

Built for [Hack with YO: Designing Smart DeFi Savings](https://dorahacks.io/hackathon/yo/detail) — DoraHacks / YO Labs.

---

## What is YO Goals?

YO Goals is the first goal-based savings app in DeFi. Users create savings goals (trip, emergency fund, new laptop), set a risk tolerance, and the AI builds a multi-vault strategy across YO Protocol vaults that automatically earns yield.

The user never needs to understand vaults, ERC-4626, or yield farming. They just save.

### How It Works

1. **Create a goal** — Name it, set a target, pick a deadline, choose risk tolerance (Conservative / Balanced / Growth)
2. **AI builds your strategy** — Allocates across yoUSD, yoETH, yoBTC based on your risk profile and timeline
3. **Deposit** — One tap deposits, automatically split across vaults by strategy weights
4. **Earn** — YO Protocol auto-rebalances underlying pools for optimal risk-adjusted yield
5. **Withdraw** — Get principal + 90% of yield. 10% fee on profit only (funds the AI engine)

---

## Architecture

```
USER (goal-based UX)
  │
  ▼
YoGoals.sol (Base mainnet)
  │  Creates goals with multi-vault allocations
  │  Splits deposits across YO vaults by weight
  │  Collects 10% yield fee on withdrawal
  │  Supports rebalancing to new strategies
  │
  ├──→ yoUSD (0x0000000f2eB9f69274678c76222B35eEc7588a65)
  ├──→ yoETH (0x3a43aec53490cb9fa922847385d82fe25d0e9de7)
  └──→ yoBTC (0xbCbc8cb4D1e8ED048a6276a5E94A3e952660BcbC)
         │
         ▼
    YO Protocol (ERC-4626 vaults)
    Auto-rebalances across Morpho, Aave, Pendle, etc.
    Risk-rated by Exponential.fi

STRATEGY ENGINE
  │  Generates optimal allocations per goal
  │  Free for in-app users
  │  x402-gated API for external agents ($0.01/call)
  │
  └──→ Treasury USDC funds x402 API costs
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, TypeScript |
| Styling | Tailwind CSS + Metio Design System |
| Wallet | wagmi v2, RainbowKit, WalletConnect |
| YO SDK | @yo-protocol/core, @yo-protocol/react |
| State | Zustand (persisted) |
| Smart Contract | Solidity 0.8.24, OpenZeppelin, Hardhat |
| Chain | Base mainnet (8453) |
| AI/API | Next.js API routes, x402 protocol |
| Icons | Lucide React + custom SVG illustrations |

---

## YO SDK Integration

YO Goals deeply integrates the YO Protocol SDK:

- **`@yo-protocol/react` hooks** — `useVaultState`, `usePreviewDeposit`, `useUserPosition`, `useVaults` for real-time vault data
- **ERC-4626 deposits** — `deposit(assets, receiver)` called on each vault per allocation weight
- **ERC-4626 redeems** — `redeem(shares, receiver, owner)` with profit-based fee calculation
- **Multi-vault strategies** — Each goal allocates across 1-5 YO vaults simultaneously
- **Live onchain transactions** — Real deposits/redeems on Base mainnet

### Smart Contract: `YoGoals.sol`

Production Solidity contract targeting live YO vault addresses:

```solidity
function createGoal(name, target, deadline, risk, asset, vaults[], weights[])
function deposit(goalId, amount)     // Splits across vaults by weight
function withdraw(goalId)            // 10% fee on yield only
function withdrawPartial(goalId, %)  // Proportional withdrawal
function rebalance(goalId, newVaults[], newWeights[])
```

---

## x402 Integration

YO Goals uses [x402](https://x402.org) (Coinbase's HTTP payment protocol) as a server-side infrastructure layer:

- **Users pay nothing for AI advice** — it's free inside the app
- **External AI agents pay $0.01 USDC per request** via x402 to access the strategy API
- **Treasury funds API costs** from the 10% yield fee collected on withdrawals
- The app is both a consumer product AND an infrastructure API for the agent economy

```
POST /api/advisor
  → In-app: Free, returns strategy recommendation
  → External: HTTP 402 → pay $0.01 USDC on Base → returns strategy
```

---

## Business Model

```
User deposits → AI splits across YO vaults → Yield accrues
                                                    │
                                              On withdrawal:
                                              90% yield → User
                                              10% yield → Treasury
                                                    │
                                              Treasury funds:
                                              • x402 API costs
                                              • AI inference
                                              • Protocol operations
```

Principal is NEVER touched. Fee is only on profit.

---

## Design System

Derived from [Metio-Mobile](https://github.com/penguinpecker/Metio-Mobile):

- **Orange `#F26F21`** primary, **Lavender `#938EF2`** secondary
- **`#D9D9D9`** gray background, **`#CCFF00`** YO green accent
- **Brutalist hard shadows** — `3px 3px 0px #080808`, no blur
- **900-weight uppercase headers** with letter-spacing
- **Pill buttons** with black borders
- **Lucide icons** + custom SVG goal illustrations (no emojis)
- **Logo**: Typographic YO mark with multi-vault fill bands inside the O

---

## Setup

```bash
# Install
npm install

# Set environment variables
cp .env.example .env
# Fill in: WC_PROJECT_ID, DEPLOYER_PRIVATE_KEY, TREASURY_ADDRESS

# Run dev server
npm run dev

# Deploy contract to Base
npx hardhat compile
npx hardhat run scripts/deploy.js --network base
```

---

## Project Structure

```
yo-goals/
├── contracts/
│   └── YoGoals.sol          # Multi-vault strategy contract
├── scripts/
│   └── deploy.js            # Base mainnet deployment
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Dashboard
│   │   ├── globals.css       # Metio-derived styles
│   │   ├── providers.tsx     # Wagmi + RainbowKit + YO
│   │   └── api/advisor/      # x402-gated strategy API
│   ├── components/
│   │   ├── Logo.tsx          # Multi-vault fill YO mark
│   │   ├── GoalIllustration.tsx  # Custom SVG illustrations
│   │   ├── ui.tsx            # Core Metio-style components
│   │   └── index.ts
│   ├── constants/
│   │   ├── theme.ts          # Design tokens
│   │   └── contracts.ts      # Addresses + strategy presets
│   ├── hooks/
│   │   └── useContract.ts    # Contract interaction hooks
│   └── lib/
│       ├── abi.ts            # Contract ABIs
│       ├── strategy.ts       # AI strategy engine
│       ├── store.ts          # Zustand goal store
│       └── wagmi.ts          # Wagmi config
├── hardhat.config.js
├── package.json
└── README.md
```

---

## Judging Criteria Alignment

| Criteria (Weight) | How YO Goals Addresses It |
|---|---|
| **UX Simplicity (30%)** | Users never see vaults or ERC-4626. They see goals, progress rings, and "Add Funds." Risk slider replaces vault picker. |
| **Creativity & Growth (30%)** | First goal-based DeFi savings app. Multi-vault strategies. x402 API for agent economy. $200B+ TradFi market pattern brought to DeFi. |
| **Quality of Integration (20%)** | Multi-vault deposits, redeems, rebalancing across yoUSD/yoETH/yoBTC. Custom contract + SDK hooks. Deepest possible integration. |
| **Risk & Trust (20%)** | AI matches risk to timeline. Transparent vault allocations. Exponential.fi ratings shown. Fee only on profit. |

---

## Team

Built by [penguinpecker](https://github.com/penguinpecker)

---

## License

MIT
