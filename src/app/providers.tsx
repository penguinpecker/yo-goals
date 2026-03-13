'use client';

import { ReactNode } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
// IMPORTANT: import WagmiProvider from @privy-io/wagmi, NOT from wagmi
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { wagmiConfig } from '@/lib/wagmi';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#F26F21',
          logo: undefined, // We render our own logo
        },
        // Login methods: email, phone, Google, MetaMask, etc.
        loginMethods: ['email', 'google', 'wallet'],
        // Default chain
        defaultChain: base,
        supportedChains: [base],
        // Embedded wallet — creates a wallet for email/social users automatically
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
