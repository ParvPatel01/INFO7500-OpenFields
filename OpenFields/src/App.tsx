import Profile from './components/Profile';
import './index.css';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

function App() {
  const account = useAccount();
  const { connectors, connect, error } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <>
      <Header account={account} />
      <Profile account={account} connectors={connectors} connect={connect} error={error} disconnect={disconnect} />
      <Outlet />
    </>
  )
}

export default App
