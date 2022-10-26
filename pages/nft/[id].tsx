import React from 'react';
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';

const NFTDropPage = () => {
	const address = useAddress();
	return (
		<div className='flex h-screen flex-col lg:grid lg:grid-cols-10'>
			{/* left side */}
			<div className='bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4'>
				<div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
					<div className='rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2'>
						<img
							src='https://links.papareact.com/8sg'
							alt=''
							className='w-44 rounded-xl object-cover lg:h-96 lg:w-72'
						/>
					</div>

					<div className='space-y-2 p-5 text-center'>
						<h1 className='text-4xl font-bold text-white'>GT Apes</h1>
						<h2 className='text-xl text-gray-300'>
							A collection of GT Apes who live and breathe in React JS!
						</h2>
					</div>
				</div>
			</div>

			{/* right */}
			<div className='flex flex-1 flex-col p-12 lg:col-span-6'>
				{/* header */}
				<header className='flex items-center justify-between'>
					<h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'>
						The{' '}
						<span className='font-extrabold underline decoration-pink-600/50'>
							GTA
						</span>{' '}
						NFT Marketplace
					</h1>

					<div
					// type='button'
					// title='Connect Wallet'
					// className='rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base'
					>
						<ConnectWallet className='rounded-full bg-rose-400' />
					</div>
				</header>

				<hr className='my-2 border' />

				{/* content */}
				<div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0'>
					<img
						src='https://links.papareact.com/bdy'
						className='w-80 object-cover pb-10 lg:h-40'
						alt=''
					/>

					<h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>
						The GT Ape NFT Drop
					</h1>

					<p className='pt-2 text-xl text-green-500'>13/21 NFTs claimed</p>
				</div>

				{/* mint button */}
				<button className='mt-10 h-16 w-full rounded-full bg-red-600 font-bold text-white'>
					Mint NFT (0.01 ETH)
				</button>
			</div>
		</div>
	);
};

export default NFTDropPage;
