import { Box } from "@mui/material";
import { MintNFT } from "./MintNFT";
import { useLocation } from "react-router-dom";

const Mint = () => {
    const location = useLocation();
    const accountStatus: any = location.state.status;
    console.log(location);
    return (
        <Box sx={{display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', columnGap: 2}}>
            <h1>Mint</h1>
            {/* {account.status === 'connected' && <MintERC20 tokenContractAddress={TOKEN_CONTRACT_ADDRESS} />} */}
            {accountStatus === 'connected' && <MintNFT address="0x1234567890123456789012345678901234567890"/>}
            
        </Box>
    );
}

export default Mint;