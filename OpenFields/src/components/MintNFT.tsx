import abi from '../ABIs/ContractABI_V3.json';
import * as React from 'react'
import { type BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi' 
import { MarketImgViewer } from './MarketImgViewer';

interface Props {
  address: `0x${string}`;
}

export function MintNFT( {address}:Props ) {
    const TOKEN_CONTRACT_ADDRESS = "0x812047A71cF17020b1c7e17dfA94e5EDD8Ba7916";
  
  const { data: hash, error, isPending, writeContract } = useWriteContract() 
  
  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    const formData = new FormData(e.target as HTMLFormElement) 
    const tokenURI = formData.get('tokenURI') as string
    const price = formData.get('price') as string; // 获取价格输入 
    
    writeContract({ 
      address: TOKEN_CONTRACT_ADDRESS, 
      abi, 
      functionName: 'createToken', 
      args: [tokenURI, price], 
    }) 
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    })

  return (
    <>
    <h2>Mint Here</h2>
    <form onSubmit={submit} className="mint-form">
      {/* <input name="address" placeholder="0xA0Cf…251e" required /> */}
      <input name="tokenURI" placeholder="Enter image IPFS URL" required className="mint-input"/>
      <input name="price" placeholder="Enter NFT Price in Tokens" required className="mint-input" type="number" min="0"/>
      <button type="submit" disabled={isPending} >{isPending ? 'Confirming...' : 'Mint NFT'}</button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>} 
      {isConfirmed && <div>Transaction confirmed.</div>} 
      {error && ( 
        <div>Error: {(error as BaseError).shortMessage || error.message}</div> 
      )}
    </form>
    {/* <DisplayNFTs address={address} contractAddress={contractAddress} isConfirmed={isConfirmed}/> */}
    </>
  )
} 