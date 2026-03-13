import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { privyId, name, illustration, targetAmount, deadline, riskLevel, depositAsset, allocations, onchainGoalId } = body;
    if (!privyId || !name || !targetAmount || !deadline) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const { data: user } = await getSupabaseAdmin().from('yg_users').select('id').eq('privy_id', privyId).single();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const { data: goal, error: goalError } = await getSupabaseAdmin().from('yg_goals').insert({ user_id: user.id, onchain_goal_id: onchainGoalId || null, name, illustration: illustration || 'travel', target_amount: targetAmount, deadline, risk_level: riskLevel ?? 1, deposit_asset: depositAsset || 'ETH' }).select().single();
    if (goalError) throw goalError;
    if (allocations && allocations.length > 0) {
      const rows = allocations.map((a: any) => ({ goal_id: goal.id, vault_id: a.vault, weight_bps: a.weight }));
      await getSupabaseAdmin().from('yg_allocations').insert(rows);
    }
    return NextResponse.json({ goal });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}

export async function GET(request: NextRequest) {
  const privyId = request.nextUrl.searchParams.get('privyId');
  if (!privyId) return NextResponse.json({ error: 'Missing privyId' }, { status: 400 });
  const { data: user } = await getSupabaseAdmin().from('yg_users').select('id').eq('privy_id', privyId).single();
  if (!user) return NextResponse.json({ goals: [] });
  const { data: goals } = await getSupabaseAdmin().from('yg_goals').select('*, yg_allocations (*)').eq('user_id', user.id).eq('active', true).order('created_at', { ascending: false });
  return NextResponse.json({ goals: goals || [] });
}

export async function PATCH(request: NextRequest) {
  try {
    const { goalId, onchainGoalId, active } = await request.json();
    if (!goalId) return NextResponse.json({ error: 'Missing goalId' }, { status: 400 });
    const updates: any = { updated_at: new Date().toISOString() };
    if (onchainGoalId !== undefined) updates.onchain_goal_id = onchainGoalId;
    if (active !== undefined) updates.active = active;
    const { data, error } = await getSupabaseAdmin().from('yg_goals').update(updates).eq('id', goalId).select().single();
    if (error) throw error;
    return NextResponse.json({ goal: data });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
