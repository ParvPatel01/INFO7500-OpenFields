import { Box } from "@mui/material";
import { MintNFT } from "./MintNFT";
import { useLocation } from "react-router-dom";

const Mint = () => {
    const location = useLocation();
    const accountStatus: any = location.state.status;
    const address: any = location.state.address;
    console.log(location);
    return (
        <Box sx={{display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', columnGap: 2}}>
            <h1>Mint</h1>
            {/* {account.status === 'connected' && <MintERC20 tokenContractAddress={TOKEN_CONTRACT_ADDRESS} />} */}
            {accountStatus === 'connected' && <MintNFT address={address}/>}
            
        </Box>
    );
}

export default Mint;