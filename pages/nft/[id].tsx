import React, { useEffect, useState } from 'react';
import { ConnectWallet, useAddress, useContract } from '@thirdweb-dev/react';
import { GetServerSideProps } from 'next';
import { imageBuilder, sanityClient } from '../../sanity';
import { Collection } from '../../typings';
import Link from 'next/link';
import { BigNumber } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
	collection: Collection;
}

const NFTDropPage = ({ collection }: Props) => {
	const address = useAddress();
	const [claimedSupply, setclaimedSupply] = useState<number>(0);
	const [totalSupply, settotalSupply] = useState<BigNumber>();
	const [priceInEth, setpriceInEth] = useState<string>('');
	const [loading, setloading] = useState<boolean>(true);
	const nftDrop = useContract(
		'0xd076fCCC570A6590A1F873CC08624daf750AE20E',
		'nft-drop',
	).contract;

	useEffect(() => {
		if (!nftDrop) return;

		const fetchNFTDropData = async () => {
			setloading(true);

			const claimed = await nftDrop.getAllClaimed();
			const total = await nftDrop.totalSupply();

			setclaimedSupply(claimed.length);
			settotalSupply(total);
			setloading(false);
		};

		const fetchPrice = async () => {
			const claimConditions = await nftDrop.claimConditions.getAll();
			setpriceInEth(claimConditions?.[0].currencyMetadata.displayValue);
		};

		fetchNFTDropData();
		fetchPrice();
	}, [nftDrop]);

	const mintNFT = () => {
		if (!nftDrop || !address) return;

		const quantity = 1; //how many unique NFTs user wants to claim

		setloading(true);

		const notification = toast.loading('Minting...', {
			style: {
				background: 'white',
				color: 'green',
				fontWeight: 'bolder',
				fontSize: '17px',
				padding: '20px',
			},
		});

		nftDrop
			.claimTo(address, quantity)
			.then(async (tx) => {
				const receipt = tx[0].receipt; //transaction receipt
				const claimedTokenID = tx[0].id; // ID of the NFT claimed
				const claimedNFTData = await tx[0].data(); //all data from the claimed NFT

				toast('HOORAY! You successfully minted!', {
					duration: 8000,
					style: {
						background: 'green',
						color: 'white',
						fontWeight: 'bolder',
						fontSize: '17px',
						padding: '20px',
					},
				});

				// console.log(receipt);
				// console.log(claimedTokenID);
				// console.log(claimedNFTData);
			})
			.catch((err) => {
				console.log(err);

				toast('Woops! Something went wrong..', {
					style: {
						background: 'red',
						color: 'white',
						fontWeight: 'bolder',
						fontSize: '17px',
						padding: '20px',
					},
				});
			})
			.finally(() => {
				setloading(false);
				toast.dismiss(notification);
			});
	};

	return (
		<div className='flex flex-col h-screen lg:grid lg:grid-cols-10'>
			<Toaster position='top-right' />

			{/* left side */}
			<div className='bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4'>
				<div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
					<div className='p-2 rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600'>
						<img
							src={imageBuilder(collection.previewImage).url()}
							alt=''
							className='object-cover w-44 rounded-xl lg:h-96 lg:w-72'
						/>
					</div>

					<div className='p-5 space-y-2 text-center'>
						<h1 className='text-4xl font-bold text-white'>
							{collection.nftCollectionName}
						</h1>
						<h2 className='text-xl text-gray-300'>{collection.description}</h2>
					</div>
				</div>
			</div>

			{/* right */}
			<div className='flex flex-col flex-1 p-12 lg:col-span-6'>
				{/* header */}
				<header className='flex items-center justify-center sm:justify-between'>
					<Link href={'/'}>
						<h1 className='hidden text-xl cursor-pointer w-52 font-extralight sm:block sm:w-80'>
							The{' '}
							<span className='font-extrabold underline decoration-pink-600/50'>
								GTA
							</span>{' '}
							NFT Marketplace
						</h1>
					</Link>

					<div
					// type='button'
					// title='Connect Wallet'
					// className='px-4 py-2 text-xs font-bold text-white rounded-full bg-rose-400 lg:px-5 lg:py-3 lg:text-base'
					>
						<ConnectWallet />
					</div>
				</header>

				<hr className='my-2 border' />

				{/* content */}
				<div className='flex flex-col items-center flex-1 mt-10 space-y-6 text-center lg:justify-center lg:space-y-0'>
					<img
						src={imageBuilder(collection.mainImage).url()}
						className='object-cover pb-10 w-80 lg:h-40'
						alt=''
					/>

					<h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>
						{collection.title}
					</h1>

					{loading ? (
						<p className='pt-2 text-xl text-red-500 animate-pulse'>
							Loading Supply Count...
						</p>
					) : (
						<p className='pt-2 text-xl text-green-500'>
							{claimedSupply} / {totalSupply?.toString()} NFTs claimed
						</p>
					)}

					{loading && (
						<img
							src='https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif'
							className='object-contain h-80 w-80'
						/>
					)}
				</div>

				{/* mint button */}
				<button
					disabled={
						loading || claimedSupply === totalSupply?.toNumber() || !address
					}
					className='w-full h-16 mt-10 font-bold text-white bg-red-600 rounded-full disabled:bg-gray-400'
					onClick={mintNFT}>
					{loading ? (
						<>Loading...</>
					) : claimedSupply === totalSupply?.toNumber() ? (
						<>Sold Out</>
					) : !address ? (
						<>Connect Wallet to Mint</>
					) : (
						<span className='font-bold'>Mint NFT ({priceInEth} ETH)</span>
					)}
				</button>
			</div>
		</div>
	);
};

export default NFTDropPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const query = `*[_type == "collection" && slug.current == $id][0]{
  _id,
  title,
  address,
  description,
  nftCollectionName,
  mainImage{
      asset
  },
  previewImage{
      asset
  },
  slug{
      current
  },
  creator-> {
    _id,
    name,
    address,
    slug{
       current
    },
  },
 }`;

	const collection = await sanityClient.fetch(query, { id: params?.id });

	if (!collection) {
		return { notFound: true };
	}

	return { props: { collection } };
};
