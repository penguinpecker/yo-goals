import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { privyId, goalId, type, amount, txHash, status, metadata } = await request.json();
    if (!privyId || !type) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const { data: user } = await getSupabaseAdmin().from('yg_users').select('id').eq('privy_id', privyId).single();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const { data, error } = await getSupabaseAdmin().from('yg_transactions').insert({ user_id: user.id, goal_id: goalId || null, type, amount: amount || null, tx_hash: txHash || null, chain_id: 8453, status: status || 'confirmed', metadata: metadata || {} }).select().single();
    if (error) throw error;
    return NextResponse.json({ transaction: data });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}

export async function GET(request: NextRequest) {
  const privyId = request.nextUrl.searchParams.get('privyId');
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
  if (!privyId) return NextResponse.json({ error: 'Missing privyId' }, { status: 400 });
  const { data: user } = await getSupabaseAdmin().from('yg_users').select('id').eq('privy_id', privyId).single();
  if (!user) return NextResponse.json({ transactions: [] });
  const { data } = await getSupabaseAdmin().from('yg_transactions').select('*, yg_goals (name, illustration)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(limit);
  return NextResponse.json({ transactions: data || [] });
}
