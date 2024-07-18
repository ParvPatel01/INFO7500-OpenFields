import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'


const Profile = () => {
    const account = useAccount()
    const { connectors, connect, error } = useConnect()
    const { disconnect } = useDisconnect()

    return (
        <div className="personal">
            <h2>Account</h2>
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
                {connectors.map((connector) => (
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
    );
}

export default Profile;