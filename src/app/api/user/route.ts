import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { privyId, walletAddress, email, displayName } = await request.json();
    if (!privyId) return NextResponse.json({ error: 'Missing privyId' }, { status: 400 });
    const { data, error } = await getSupabaseAdmin().from('yg_users').upsert({ privy_id: privyId, wallet_address: walletAddress || null, email: email || null, display_name: displayName || null, updated_at: new Date().toISOString() }, { onConflict: 'privy_id' }).select().single();
    if (error) throw error;
    return NextResponse.json({ user: data });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}

export async function GET(request: NextRequest) {
  const privyId = request.nextUrl.searchParams.get('privyId');
  if (!privyId) return NextResponse.json({ error: 'Missing privyId' }, { status: 400 });
  const { data, error } = await getSupabaseAdmin().from('yg_users').select('*').eq('privy_id', privyId).single();
  if (error) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user: data });
}
