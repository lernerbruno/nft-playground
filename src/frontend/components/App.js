import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home.js'
import CreateSogoNFT from './CreateSogoNFT.js'
import CreateSogoFund from './CreateSogoFund.js'
import CreateSocialProject from './CreateSocialProject.js'
import SocialProject from './SocialProject.js'
import SocialProjects from './SocialProjects.js'
import MyListedItems from './MyListedItems.js'
import MyPurchases from './MyPurchases.js'
import SogoAbi from '../contractsData/Sogo.json'
import SogoAddress from '../contractsData/Sogo-address.json'
import SogoNFTAbi from '../contractsData/SogoNFT.json'
import SogoNFTAddress from '../contractsData/SogoNFT-address.json'
import SocialProjectFactoryAddress from '../contractsData/SocialProjectFactory-address.json'
import SocialProjectFactoryAbi from '../contractsData/SocialProjectFactory.json'
import { useState } from 'react'
import { ethers } from "ethers"
import { useNavigate, useHistory } from "react-router-dom";
import { Spinner, Col, Row, Card, Button } from 'react-bootstrap'
import './App.css';

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [sogo, setSogo] = useState({})
  const [socialProjectFactory, setSocialProjectFactory] = useState({})
  
  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    loadContracts(signer)
  }
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const sogo = new ethers.Contract(SogoAddress.address, SogoAbi.abi, signer)
    setSogo(sogo)
    const nft = new ethers.Contract(SogoNFTAddress.address, SogoNFTAbi.abi, signer)
    setNFT(nft)
    const socialProjectFactory = new ethers.Contract(SocialProjectFactoryAddress.address, SocialProjectFactoryAbi.abi, signer)
    setSocialProjectFactory(socialProjectFactory)
    setLoading(false)
  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                {/* <Spinner animation="border" style={{ display: 'flex' }} />
                <p className='mx-3 my-0'>Awaiting Metamask Connection...</p> */}
              <div className="px-2 container">
                <h1 className="normal-txt" style={{ fontSize: "80px", fontFamily: 'Aktiv Grotesk Ex', textAlign:"left", width:'70%' }}>A evolução do investimento social</h1>
                <h1 className="normal-txt" style={{ fontSize: "22px", fontFamily: 'Aktiv Grotesk Ex', textAlign:"left", width:'55%' }}>Doe para projetos sociais e acompanhe seu impacto em tempo real, com facilidade e transparência.</h1>
                <div style={{display: 'flex', alignItems: 'left', justifyContent: 'left', paddingTop: '20px'}}>
                  <Button style={{color:'#0D0D0D', borderColor:'#B197FC', backgroundColor: '#B197FC', align:'left'}} onClick={web3Handler}>Comece agora</Button>
                </div>
                
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home sogo={sogo} nft={nft} socialProjectFactory={socialProjectFactory} />
              } />
              <Route path="/projects" element={
                <SocialProjects socialProjectFactory={socialProjectFactory} />
              }/>
              <Route path="/projects/:orgId" element={
                <SocialProject nft={nft} sogo={sogo} socialProjectFactory={socialProjectFactory}/>
              }/>
              <Route path="/create-sogo-nft" element={
                <CreateSogoNFT sogo={sogo} nft={nft} socialProjectFactory={socialProjectFactory} />
              } />
              <Route path="/create-sogo-fund" element={
                <CreateSogoFund socialProjectFactory={socialProjectFactory} sogo={sogo} sogoNFT={nft} />
              } />
              <Route path="/my-listed-items" element={
                <MyListedItems marketplace={sogo} nft={nft} account={account} />
              } />
              <Route path="/create-project" element={
                <CreateSocialProject socialProjectFactory={socialProjectFactory} />
              } />
              <Route path="/my-purchases" element={
                <MyPurchases sogo={sogo} nft={nft} account={account} />
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
