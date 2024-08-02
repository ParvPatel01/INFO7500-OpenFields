import  { useState, useEffect } from 'react';
import { NFT } from '../Model/NFTModel';
import MarketImgViewer from './MarketImgViewer';
import  Box  from '@mui/material/Box';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';


const Market = () => {
    const ALCHEMY_API_KEY = "yijbugyKIC6e1IbQEhQed_QC-IDlwnLL";
    const CONTRACT_ADDRESS = "0xC5143a2451fA6986Bf7Fb7bF1Ac468C6d9d6A43f";
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    const [nfts, setNfts] = useState<NFT[]>([]);
    const location = useLocation();
    const buyerAddress: string = location.state.address;

    useEffect(() => {
        fetch(`https://eth-sepolia.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getNFTsForContract?contractAddress=${CONTRACT_ADDRESS}&withMetadata=true`, options)
            .then(response => response.json())
            .then(response => {
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

    return (
        <Box className="personal" sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} >
            <h2 style={{marginTop: '10px'}}>{`All NFTs (Contract: ${CONTRACT_ADDRESS})`}</h2>
            <Box className='nft-gallery' sx={{mt: 2}}>
                {nfts.length > 0 ? (
                    <MarketImgViewer isMarket={true} nft={nfts} contractAddress={CONTRACT_ADDRESS} buyerAddress={buyerAddress}/>
                ) : (
                    <Typography variant='h3'>No NFTs found</Typography>
                )}
            </Box>
        </Box>
    );
}

export default Market;