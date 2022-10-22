import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home.js'
import CreateSogoNFT from './CreateSogoNFT.js'
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
import { Row, Col, Button } from 'react-bootstrap'
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

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
      window.location.reload(false);
    })

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
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
          <Navigation connectWallet={web3Handler} account={account} />
        </>
        <div>
          {loading ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '800px' }}>
                <div className="px-2 container">
                  <h1 className="normal-txt" style={{ fontSize: "80px", fontFamily: 'Aktiv Grotesk Ex', textAlign:"left", width:'70%' }}>A plataforma de Filantropia colaborativa</h1>
                  <h1 className="normal-txt" style={{ fontSize: "22px", fontFamily: 'Aktiv Grotesk Ex', textAlign:"left", width:'55%' }}>Nosso objetivo é ajudar você a contribuir com sua causa da forma mais efetiva e transparente possível</h1>
                  <div style={{display: 'flex', alignItems: 'left', justifyContent: 'left', paddingTop: '20px'}}>
                    <Button className='button-primary' onClick={web3Handler}>Comece agora</Button>
                    <Button className='button-secondary' onClick={web3Handler}>Cadastre seu Projeto</Button>
                  </div>
                </div>
              </div>
              <div className="px-1 container">
                <h1 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Aktiv Grotesk Ex', textAlign:"center", width:'100%' }}>Junte-se a 4,000+ empresas promovendo a filantropia com a Sogo</h1>
                <img src='assets/descomplica.svg'  style={{padding: '10px'}} />
                <img src='assets/rjz.svg' style={{padding: '10px'}} />
                <img src='assets/descomplica.svg'  style={{padding: '10px'}} />
                <img src='assets/rjz.svg' style={{padding: '10px'}} />
                <img src='assets/descomplica.svg'  style={{padding: '10px'}} />
                <img src='assets/rjz.svg' style={{padding: '10px'}} />
                <img src='assets/descomplica.svg'  style={{padding: '10px'}} />
                <img src='assets/rjz.svg' style={{padding: '10px'}} />
              </div>
              &nbsp; 
              
              <div className="px-1 container" style={{display: 'flex', paddingTop: '30px', backgroundColor: '#53389E', borderRadius: '10px'}}>
                <Row xs={2} md={2} lg={2}>
                  <Col style={{alignSelf: 'center', width:'70%'}}>
                    <h6 className="normal-txt" style={{ fontSize: "2rem", fontFamily: 'Poppins', color: '#FFFFFF'}}>Super Funder</h6>  
                    <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', color: '#FFFFFF'}}>Super recompensas para doações acima de R$500</h6> 
                  </Col>
                </Row>
              </div>
              &nbsp; 

              <div className="px-1 container" style={{display: 'flex', paddingTop: '30px', backgroundColor: '#53389E', borderRadius: '10px'}}>
                <Row xs={2} md={2} lg={2}>
                  <Col style={{alignSelf: 'center', width:'70%'}}>
                    <h6 className="normal-txt" style={{ fontSize: "2rem", fontFamily: 'Poppins', color: '#FFFFFF'}}>Bold Funder</h6>  
                    <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', color: '#FFFFFF'}}>Recompensas para doações a partir de R$200</h6> 
                  </Col>
                </Row>
              </div>
              &nbsp; 

              <div className="px-1 container" style={{display: 'flex', paddingTop: '30px', backgroundColor: '#53389E', borderRadius: '10px'}}>
                <Row xs={2} md={2} lg={2}>
                  <Col style={{alignSelf: 'center', width:'70%'}}>
                    <h6 className="normal-txt" style={{ fontSize: "2rem", fontFamily: 'Poppins', color: '#FFFFFF'}}>Light Funder</h6>  
                    <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', color: '#FFFFFF'}}>Recompensas colaborativas para doações até R$100</h6> 
                  </Col>
                </Row>
              </div>
              &nbsp; 
              <div className="px-1 container" style={{display: 'flex', paddingTop: '30px', backgroundColor: '#FFFFFF'}}>
                <Row xs={2} md={2} lg={2}>
                  <Col style={{alignSelf: 'center', width:'70%'}}>
                    <h6 className="normal-txt" style={{ fontSize: "2rem", fontFamily: 'Poppins'}}>Ajudando o Brasil a alcançar os objetivos de desenvolvimento social</h6>  
                    <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins'}}>Junte-se a outros 1000+ doadores já sendo parte da mudança</h6> 
                  </Col>
                  <img src='assets/sdgs.svg'  style={{width:'30%'}} />
                </Row>
              </div>
              &nbsp; 

              

            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home socialProjectFactory={socialProjectFactory} />
              } />
              <Route path="/projects" element={
                <SocialProjects socialProjectFactory={socialProjectFactory} />
              }/>
              <Route path="/projects/:projId" element={
                <SocialProject nft={nft} sogo={sogo} socialProjectFactory={socialProjectFactory} account={account}/>
              }/>
              <Route path="/create-sogo-nft" element={
                <CreateSogoNFT sogo={sogo} nft={nft} socialProjectFactory={socialProjectFactory} account={account}/>
              } />
              <Route path="/my-listed-items" element={
                <MyListedItems marketplace={sogo} nft={nft} account={account} />
              } />
              <Route path="/create-project" element={
                <CreateSocialProject socialProjectFactory={socialProjectFactory} account={account}/>
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
