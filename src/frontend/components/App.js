import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home.js'
import Create from './Create.js'
import MyListedItems from './MyListedItems.js'
import MyPurchases from './MyPurchases.js'
import MarketplaceAbi from '../contractsData/Marketplace.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import { useState } from 'react'
import { ethers } from "ethers"
import { useNavigate } from "react-router-dom";
import { Spinner, Col, Row, Card, Button } from 'react-bootstrap'

import './App.css';

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})
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
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    setNFT(nft)
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
            <Row xs={2} md={2} lg={2} className="g-2 py-5">
              <h1 style={{ fontSize: "5rem", fontFamily: 'Poppins', textAlign:"left" }}>Pensar global e agir local nunca foi tão real</h1>
              {/* <img src='planeta.gif' className="Home-logo" /> */}
            </Row>
            <Row xs={2} md={2} lg={10} className="g-4 py-5">
              <Col key={0} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Explore projetos</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      Nossas ONGs parceiras registram seus projeto e vendem participação no seu progresso atraves da compra de tokens.
                      Comprando um token, você segue o projeto e recebe o reconhecimento em forma de arte.
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => {}} variant="primary" size="lg">
                        Compre e Suporte
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
              <Col key={1} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Acompanhe seu impacto</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      Veja como os projetos que você apoiou evoluiram e como sua colaboração foi importante. E use seus tokens para interagir com a comunidade
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => {}} variant="primary" size="lg">
                        Veja seu portfolio
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>

            </div>
    
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home marketplace={marketplace} nft={nft} />
              } />
              <Route path="/create" element={
                <Create marketplace={marketplace} nft={nft} />
              } />
              <Route path="/my-listed-items" element={
                <MyListedItems marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/my-purchases" element={
                <MyPurchases marketplace={marketplace} nft={nft} account={account} />
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
