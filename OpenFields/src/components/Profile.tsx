import * as React from 'react';
import {
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import abi from "../ABIs/ContractABI_V3.json";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Avatar } from '@mui/material';
import { cyan } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';

interface ProfileProps {
    account: any;
    connectors: any;
    connect: any;
    profileError: any;
    disconnect: any;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function Profile(props: ProfileProps) {
    const CONTRACT_ADDRESS = "0xC5143a2451fA6986Bf7Fb7bF1Ac468C6d9d6A43f";

    const { data: hash, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({hash});

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const { account, connectors, connect, profileError, disconnect } = props;
    const {data: balanceData} = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "balanceOf",
        args: [account.address],
    });

    
    const approve = () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            functionName: "approve",
            args: [account.address, 1],
        });
    }

    const transfer = () => {
        console.log('transfer');
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            functionName: "transferFrom",
            args: [account.address, account.address, 1],
        });
    }

    return (
        <React.Fragment>
            <Box sx={{ m: 2, flexGrow: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleClickOpen}>
                <Avatar sx={{ width: '8em', height: '3em', borderRadius: 1, bgcolor: cyan[800], cursor: 'pointer' }}>
                    <PersonIcon />
                </Avatar>
            </Box>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2, bgcolor: cyan[800], color: 'white' }} id="customized-dialog-title">
                    Account
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'white',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ p: 2, bgcolor: '#292828', color: 'white' }} dividers>
                    <div className="personal">
                        <div className='account'>
                            <div className='account-info'>
                                status: {account.status}
                                <br />
                                addresses: {JSON.stringify(account.addresses)}
                                <br />
                                chainId: {account.chainId}
                                <br />
                                balance: {balanceData && balanceData.toString()}
                            </div>

                            {account.status === 'connected' && (
                                <div>
                                    <button className="disconnect" type="button" onClick={() => disconnect()}>
                                        Disconnect
                                    </button>
                                    <button className='transfer' type='button' onClick={() => {approve() }}>
                                        Approve
                                    </button>
                                    {hash && <div>Transaction Hash: {hash}</div>}
                                    {isConfirming && <div>Waiting for confirmation...</div>}
                                    {isConfirmed && 
                                        <div>
                                            Transaction confirmed. 
                                            <button className='transfer' type='button' onClick={() => {transfer()}}>
                                                Transfer
                                            </button>    
                                        </div>}
                                </ div>
                            )}
                        </div>

                        {account.status !== 'connected' && <div>
                            <h2>Connect</h2>
                            {connectors.map((connector: any) => (
                                <button
                                    key={connector.uid}
                                    onClick={() => connect({ connector })}
                                    type="button"
                                    className="connector"
                                >
                                    {connector.name}
                                </button>
                            ))}
                            {/* <div>{status}</div> */}
                            <div>{profileError?.message}</div>
                        </div>}
                    </div>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment>
    );
}