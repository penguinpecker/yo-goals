// IMPORTANT: import createConfig from @privy-io/wagmi, NOT from wagmi
import { createConfig } from '@privy-io/wagmi';
import { base } from 'viem/chains';
import { http } from 'wagmi';

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
});
