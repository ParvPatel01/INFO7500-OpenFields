import abi from '../ABIs/ContractABI_V3.json';
import * as React from 'react'
import { type BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import MarketImgViewer from './MarketImgViewer';
import { useEffect } from 'react';
import { NFT } from '../Model/NFTModel';
import { Box, Button, Divider } from '@mui/material';
import { cyan } from '@mui/material/colors';

interface Props {
    address: `0x${string}`;
}

export function MintNFT({ address }: Props) {
    const TOKEN_CONTRACT_ADDRESS = "0xC5143a2451fA6986Bf7Fb7bF1Ac468C6d9d6A43f";
    const ALCHEMY_API_KEY = "yijbugyKIC6e1IbQEhQed_QC-IDlwnLL";
    const CONTRACT_ADDRESS = "0xC5143a2451fA6986Bf7Fb7bF1Ac468C6d9d6A43f";
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    const [nfts, setNfts] = React.useState<NFT[]>([]);
    const { data: hash, error, isPending, writeContract } = useWriteContract()

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const tokenURI = formData.get('tokenURI') as string
        const tokenId = formData.get('tokenId') as string;

        writeContract({
            address: TOKEN_CONTRACT_ADDRESS,
            abi,
            functionName: 'mint',
            args: [address, tokenId, tokenURI],
        })
    }

    useEffect(() => {
        fetch(`https://eth-sepolia.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getNFTsForContract?contractAddress=${CONTRACT_ADDRESS}&withMetadata=true`, options)
            .then(response => response.json())
            .then(response => {
                console.log(response.nfts);
                const nftData = response.nfts.map((data: any) => ({
                    name: data.name,
                    symbol: data.symbol,
                    tokenId: data.tokenId,
                    tokenUri: data.tokenUri,
                    imgUrl: data.raw.metadata.image
                }));
                setNfts(nftData);
            })
            .catch(err => console.error(err));
    }, []);

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                <h2>Mint Here</h2>
                <form style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10 }} onSubmit={submit} className="mint-form">
                    <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }} >
                        {/* <input name="address" placeholder="0xA0Cf…251e" required /> */}
                        <input style={{width: '15vw',padding: 10, border: '1px solid #00838f', color: 'white', backgroundColor: '#181818', borderRadius: '5px'}} name="tokenURI" placeholder="Enter image IPFS URL" required className="mint-input" />
                        <input style={{width: '15vw',padding: 10, border: '1px solid #00838f', color: 'white', backgroundColor: '#181818', borderRadius: '5px'}} name="tokenId" placeholder="Enter tokenId" required className="mint-input" />
                        <Button sx={{borderColor: cyan[800], color: cyan[800]}} variant="outlined" className="nft-buy-button" type="submit" disabled={isPending} >{isPending ? 'Confirming...' : 'Mint NFT'}</Button>
                    </Box>
                    <Box>
                        {hash && <div>Transaction Hash: {hash}</div>}
                        {isConfirming && <div>Waiting for confirmation...</div>}
                        {isConfirmed && <div>Transaction confirmed.</div>}
                        {error && (
                            <div>Error: {(error as BaseError).shortMessage || error.message}</div>
                        )}
                    </Box>
                </form>
            </Box>
            <Divider />
            <MarketImgViewer isMarket={false} nft={nfts} contractAddress={CONTRACT_ADDRESS} buyerAddress={''} />
        </Box>
    )
} 