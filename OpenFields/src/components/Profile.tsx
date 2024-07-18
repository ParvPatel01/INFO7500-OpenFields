import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Avatar } from '@mui/material';
import { cyan } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';

interface ProfileProps {
    account: any;
    connectors: any;
    connect: any;
    error: any;
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
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const { account, connectors, connect, error, disconnect } = props;

    return (
        <React.Fragment>
            <Box sx={{ m: 2, flexGrow: 0, display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={handleClickOpen}>
                <Avatar sx={{ width: '8em', height: '3em', borderRadius: 1, bgcolor: cyan[800], cursor: 'pointer' }}>
                    <PersonIcon />
                </Avatar>
            </Box>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Account
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <div className="personal">
                        <div className='account'>
                            <div className='account-info'>
                                status: {account.status}
                                <br />
                                addresses: {JSON.stringify(account.addresses)}
                                <br />
                                chainId: {account.chainId}
                            </div>

                            {account.status === 'connected' && (
                                <button className="disconnect" type="button" onClick={() => disconnect()}>
                                    Disconnect
                                </button>
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
                            <div>{error?.message}</div>
                        </div>}
                    </div>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment>
    );
}