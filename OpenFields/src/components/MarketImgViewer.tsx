import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { NFT } from '../Model/NFTModel';



export default function MarketImgViewer(props: any) {
  return (
    <Box sx={{ width: '100vw', height: '50vh', overflowY: 'scroll' }}>
      <ImageList variant="masonry" cols={5} gap={8}>
        {props.nft.map((item: NFT) => (
          <ImageListItem sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1em',
          }} key={item.tokenId}>
            {item.imgUrl === undefined ? <div>Image not found</div> : <img
                style={{height: '15em', width: '15em', borderRadius: '10px'}}
              src={item.imgUrl}
              alt={item.name}
              loading="lazy"
            />}
            <ImageListItemBar position="below" sx={{fontSize: '2em', fontWeight: 800}} title={`${item.name} #${item.tokenId}`}  />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}