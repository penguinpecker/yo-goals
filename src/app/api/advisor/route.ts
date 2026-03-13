// ─── /api/advisor — AI Strategy Advisor ──────────────────────
//
// FREE for in-app users (called from frontend directly)
// x402-GATED for external agents/apps ($0.01 USDC per call)
//
// The x402 middleware would wrap this route in production.
// For the hackathon demo, we show both paths:
//   - Internal calls: no payment, returns advice
//   - External calls: x402 payment required, returns same advice
//
// Treasury USDC funds the x402 payments server-side.

import { NextRequest, NextResponse } from 'next/server';
import { generateStrategy, analyzeRebalance, type Strategy } from '@/lib/strategy';
import type { RiskLevel } from '@/constants/theme';

interface AdvisorRequest {
  action: 'generate' | 'rebalance' | 'analyze';
  // For 'generate':
  riskLevel?: RiskLevel;
  depositAsset?: 'USD' | 'ETH' | 'BTC';
  targetAmount?: number;
  deadlineMonths?: number;
  // For 'rebalance':
  currentAllocations?: Array<{
    vault: string;
    weight: number;
    apy: number;
    color: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: AdvisorRequest = await request.json();

    // Check if this is an external x402 request
    const isExternal = request.headers.get('x-source') === 'external';
    const paymentHeader = request.headers.get('x-payment');

    // In production: verify x402 payment for external requests
    // For hackathon demo: log the intent
    if (isExternal && !paymentHeader) {
      return NextResponse.json({
        error: 'Payment required',
        protocol: 'x402',
        amount: '0.01',
        currency: 'USDC',
        network: 'base',
        message: 'External API access requires x402 payment. In-app usage is free.',
      }, {
        status: 402,
        headers: {
          'X-Payment-Required': JSON.stringify({
            amount: '10000', // 0.01 USDC in 6 decimals
            currency: 'USDC',
            network: 'eip155:8453',
            receiver: process.env.TREASURY_ADDRESS || '0x0000000000000000000000000000000000000000',
          }),
        },
      });
    }

    // ─── GENERATE STRATEGY ─────────────────────────────────
    if (body.action === 'generate') {
      const strategy = generateStrategy({
        riskLevel: body.riskLevel ?? 1,
        depositAsset: body.depositAsset ?? 'USD',
        targetAmount: body.targetAmount ?? 1000,
        deadlineMonths: body.deadlineMonths ?? 12,
      });

      return NextResponse.json({
        success: true,
        strategy,
        meta: {
          source: isExternal ? 'x402' : 'internal',
          timestamp: Date.now(),
        },
      });
    }

    // ─── REBALANCE ANALYSIS ────────────────────────────────
    if (body.action === 'rebalance' && body.currentAllocations) {
      const advice = analyzeRebalance(
        body.currentAllocations as any,
        body.riskLevel ?? 1,
        body.deadlineMonths ?? 12,
      );

      return NextResponse.json({
        success: true,
        advice,
        meta: {
          source: isExternal ? 'x402' : 'internal',
          timestamp: Date.now(),
        },
      });
    }

    // ─── PORTFOLIO ANALYSIS ────────────────────────────────
    if (body.action === 'analyze') {
      // In production: fetch real vault data from YO API
      // For hackathon: return AI-style analysis
      return NextResponse.json({
        success: true,
        analysis: {
          summary: 'Your portfolio is well-diversified across YO vaults. ' +
            'The current allocation aligns with your risk tolerance.',
          suggestions: [
            {
              type: 'rebalance',
              description: 'Consider shifting 10% from yoBTC to yoUSD for higher stable yield.',
              impact: 'Potential +$80 additional yield over 12 months',
            },
          ],
          overallHealth: 'good',
        },
        meta: {
          source: isExternal ? 'x402' : 'internal',
          timestamp: Date.now(),
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (err) {
    console.error('Advisor API error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// GET endpoint for health check / info
export async function GET() {
  return NextResponse.json({
    service: 'YO Goals AI Advisor',
    version: '1.0.0',
    pricing: {
      inApp: 'free',
      external: '$0.01 USDC per request via x402',
      network: 'Base (eip155:8453)',
    },
    endpoints: {
      generate: 'POST /api/advisor { action: "generate", riskLevel, depositAsset, targetAmount, deadlineMonths }',
      rebalance: 'POST /api/advisor { action: "rebalance", currentAllocations, riskLevel, deadlineMonths }',
      analyze: 'POST /api/advisor { action: "analyze" }',
    },
  });
}
