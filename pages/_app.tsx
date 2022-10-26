import '../styles/globals.css';
import type { AppProps } from 'next/app';
// import { ChainId } from '@thirdweb-dev/sdk';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

const activeChainId = ChainId.Goerli;

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThirdwebProvider desiredChainId={activeChainId}>
			<Component {...pageProps} />
		</ThirdwebProvider>
	);
}
