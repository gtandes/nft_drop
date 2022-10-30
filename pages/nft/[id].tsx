import React from 'react';
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';
import { GetServerSideProps } from 'next';
import { imageBuilder, sanityClient } from '../../sanity';
import { Collection } from '../../typings';
import Link from 'next/link';

interface Props {
	collection: Collection;
}

const NFTDropPage = ({ collection }: Props) => {
	const address = useAddress();
	return (
		<div className='flex flex-col h-screen lg:grid lg:grid-cols-10'>
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
				<header className='flex items-center justify-between'>
					<Link href={'/'}>
						<h1 className='text-xl cursor-pointer w-52 font-extralight sm:w-80'>
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

					<p className='pt-2 text-xl text-green-500'>13/21 NFTs claimed</p>
				</div>

				{/* mint button */}
				<button className='w-full h-16 mt-10 font-bold text-white bg-red-600 rounded-full'>
					Mint NFT (0.01 ETH)
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
