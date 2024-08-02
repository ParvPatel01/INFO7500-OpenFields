import {
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import abi from "../ABIs/ContractABI_V3.json";
import erc20abi from "../ABIs/ERC20ABI.json";
import { useEffect, useState } from "react";
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import React from "react";
import { cyan, green } from '@mui/material/colors';
import { Button } from "@mui/material";
const TOKEN_CONTRACT_ADDRESS = "0x49fBFE1517b34D9eFd01F9e37A9400B2e00AA376";

interface Props {
    tokenId: string;
    contractAddress: `0x${string}`;
    buyerAddress?: `0x${string}`;
}

interface State extends SnackbarOrigin {
    open: boolean;
}

export function MarketPriceBtn({
    tokenId,
    contractAddress,
    buyerAddress,
}: Props) {
    const {
        data: symbol,
        error,
        isPending,
    } = useReadContract({
        address: contractAddress,
        abi,
        functionName: "symbol",
    });

    // if is sold
    const [isSold, setIsSold] = useState(false);
    const [owner, setOwner] = useState<string>('');

    // error alert
    const [state, setState] = React.useState<State>({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;
    const [errorMessage, SetErrorMessage] = useState("");

    const displayPrice = `1 ${symbol}`;
    const approvePrice = `${('0' + 0n).toString()}000000000000000000`;

    // if (isPending) return <div>Loading...</div>;

    if (error) return <div>Error: {error.shortMessage || error.message}</div>;

    const {
        data: hash,
        writeContract,
    } = useWriteContract();

    const approve = () => {
        writeContract({
            address: TOKEN_CONTRACT_ADDRESS,
            abi: abi,
            functionName: "approve",
            args: [contractAddress, tokenId],
        });
    }

    const transfer = () => {
        if (owner === buyerAddress) {
            setState({
                open: true,
                vertical: 'top',
                horizontal: 'center'
            });
            SetErrorMessage("error occurred: owner is buyer");
            return;
        }
        writeContract({
            address: contractAddress,
            abi: abi,
            functionName: "transferOwnership",
            args: [owner],
        });
        setState({
            open: true,
            vertical: 'top',
            horizontal: 'center'
        });
        SetErrorMessage("success");
    };

    const buyNFT = async () => {
        const data = await fetchNFTOwner();
        setOwner(data.owners[0]);
        if (owner === buyerAddress) {
            setState({
                open: true,
                vertical: 'top',
                horizontal: 'center'
            });
            SetErrorMessage("error occurred");
            return;
        }
        approve();
    }

    const handleClose = () => {
        setState({
            open: false,
            vertical: 'top',
            horizontal: 'center'
        });
    }

    // confirm approval
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({hash});

    useEffect(() => {
        if (isSold) {
		} else {
			if (isConfirmed) {
				transfer();
				setIsSold(true);
			}
		}
    }, [isConfirmed]);

    // check owner
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    const ALCHEMY_API = "yijbugyKIC6e1IbQEhQed_QC-IDlwnLL";

    async function fetchNFTOwner() {
        try {
            const response = await fetch(`https://eth-sepolia.g.alchemy.com/nft/v3/${ALCHEMY_API}/getOwnersForNFT?contractAddress=${contractAddress}&tokenId=${tokenId}`, options);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    }

    return (
        <>
            {isPending ? (
                <Button variant="outlined" className="nft-buy-button" disabled>
                    Loading... | Buy
                </Button>
            ) :
                displayPrice === `0 ${symbol}` ? (<Button className="nft-buy-button">
                    Not for sale
                </Button>) : isConfirming
                            ? (<Button sx={{bgcolor: "rgba(129, 199, 132, 0.5)", borderColor: green[300], color: green[300], cursor: 'wait'}} variant="outlined" className="nft-buy-button">...Confirming</Button>)
                            : isConfirmed
                                ? (<Button sx={{bgcolor: "rgba(76, 175, 80, 0.5)", borderColor: green[500], color: green[500], cursor: 'wait'}} variant="outlined" className="nft-buy-button" >Confirmed</Button>)
                                : isSold 
                                    ? (<Button sx={{bgcolor: "rgba(77, 208, 225, 0.5)", borderColor: cyan[300], color: cyan[300], cursor: 'not-allowed'}} variant="outlined" className="nft-buy-button" onClick={() => {fetchNFTOwner()}} >Sold!</Button>)
                                    : (<Button sx={{borderColor: cyan[800], color: cyan[800]}} variant="outlined" className="nft-buy-button" onClick={buyNFT}>{`${displayPrice} | Buy`}</Button>)
            }

            {
                open && <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={open}
                    onClose={handleClose}
                    autoHideDuration={3000}
                    message={errorMessage}
                    key={vertical + horizontal}
                />
            }
        </>
    );
}
