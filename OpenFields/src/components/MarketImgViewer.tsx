import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { NFT } from '../Model/NFTModel';
import { MarketPriceBtn } from './MarketPriceBtn';
import { Dialog } from '@mui/material';



export default function MarketImgViewer(props: any) {
  const [open, setOpen] = React.useState(false);
  const [imgUrlDiv, setImgUrlDiv] = React.useState("");

  const handleClickOpen = (url: string) => {
    setImgUrlDiv(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box >
      <ImageList cols={4} gap={8}>
        {props.nft.map((item: NFT) => (

          <ImageListItem sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mt: '1em',
          }} key={item.tokenId}>
            {item.imgUrl === undefined ? <div>Image not found</div> : <img onClick={() => handleClickOpen(item.imgUrl)}
              style={{ height: '15em', width: '15em', borderRadius: '10px' }}
              src={item.imgUrl}
              alt={item.name}
              loading="lazy"
            />}
            <ImageListItemBar position="below" sx={{ fontSize: '2em', fontWeight: 800 }} title={`${item.name} #${item.tokenId}`} />
            {
              props.isMarket &&
              <MarketPriceBtn tokenId={item.tokenId} contractAddress={props.contractAddress} buyerAddress={props.buyerAddress} />
            }
          </ImageListItem>
        ))}
      </ImageList>
      <Dialog open={open} onClose={handleClose} sx={{ width: "100%", height: "100%", borderRadius: 'none' }}>
        <img src={imgUrlDiv} alt="image" />
      </Dialog>
    </Box>
  );
}