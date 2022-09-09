import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home.js'
import CreateSogoNFT from './CreateSogoNFT.js'
import CreateSogoFund from './CreateSogoFund.js'
import CreateOrganization from './CreateOrganization.js'
import SocialOrg from './SocialOrg.js'
import Organizations from './Organizations.js'
import MyListedItems from './MyListedItems.js'
import MyPurchases from './MyPurchases.js'
import SogoAbi from '../contractsData/Sogo.json'
import SogoAddress from '../contractsData/Sogo-address.json'
import SogoNFTAbi from '../contractsData/SogoNFT.json'
import SogoNFTAddress from '../contractsData/SogoNFT-address.json'
import OrganizationFactoryAddress from '../contractsData/OrganizationFactory-address.json'
import OrganizationFactoryAbi from '../contractsData/OrganizationFactory.json'
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
  const [organizationFactory, setOrganizationFactory] = useState({})
  
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
    const organizationFactory = new ethers.Contract(OrganizationFactoryAddress.address, OrganizationFactoryAbi.abi, signer)
    setOrganizationFactory(organizationFactory)
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
            <Row xs={1} md={1} lg={1} className="g-2 py-5">
              <h1 style={{ fontSize: "4rem", fontFamily: 'Poppins', textAlign:"center" }}>Seja a mudança que você quer ver no mundo e receba seu desconto no IR </h1>
              <h1 style={{ fontSize: "5rem", fontFamily: 'Poppins', textAlign:"center", paddingTop: '50px' }}>R$ 234.877.437,20</h1>
              <h1 style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Valor total doado</h1>
            </Row>
            <Row xs={3} md={3} lg={3} className="g-4 py-5">
              <Col key={0} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Doe diretamente</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      Escolha uma de nossas milhares de organizações cadastradas para receber uma doação de qualquer valor
                    </Card.Text>
                  </Card.Body>
                  {/* <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => {}} variant="primary" size="lg">
                        Explorar Campanhas Sociais
                      </Button>
                    </div>
                  </Card.Footer> */}
                </Card>
              </Col>
              <Col key={1} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Explore Fundos comunitários</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      Caso você não saiba qual organização doar, temos fundos com objetivos bem definidos e uma curadoria de organizações que receberam o beneficio e atuarão no impacto
                    </Card.Text>
                  </Card.Body>
                  {/* <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => {}} variant="primary" size="lg">
                        Veja seu portfolio
                      </Button>
                    </div>
                  </Card.Footer> */}
                </Card>
              </Col>
              <Col key={2} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Explore projetos NFT</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      Também temos venda de artes digitais e outros tipos de tokens que beneficiam organizações de maneiras criativas
                    </Card.Text>
                  </Card.Body>
                  {/* <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => {}} variant="primary" size="lg">
                        Explorar Campanhas Sociais
                      </Button>
                    </div>
                  </Card.Footer> */}
                </Card>
              </Col>
            </Row>
            <Row xs={1} md={1} lg={1} className="g-2 py-5">
              <h1 style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Explore Fundos comunitários</h1>
            </Row>
            <Row xs={4} md={7} lg={10} className="g-2 py-5">
            <Col key={0} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Fundo RJZ</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      O Fundo RJZ é um Changemaker e um fundo de endowment privado que fomenta e promove causas sociais, e faz parte de 3 áreas de mudança  da Sogo: Educação, Saúde e Assistência Social.
                    </Card.Text>
                  </Card.Body>
                  
                </Card>
              </Col>
              <Col key={1} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Fundo Covid</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      Juntamos organizações que estão focada no combate a covid aos mais necessitados.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col key={2} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Fundo Ucrânia</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      Juntamos as organizações que mais estão ajudando a resistência ucraniana
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row xs={1} md={1} lg={1} className="g-2 py-5">
              <h1 style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Explore Organizações</h1>
            </Row>
            <Row xs={4} md={7} lg={10} className="g-2 py-5">
            <Col key={0} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>TETO</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      Uma organização mundial focada na criação de casas emergenciais em locais de risco
                    </Card.Text>
                  </Card.Body>
                  
                </Card>
              </Col>
              <Col key={1} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Projeto Futuro</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      Financiamento da faculdade para pessoas necessitadas
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col key={2} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Dança Rocinha</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      Atividades de dança na comunidade da Rocinha
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row xs={1} md={1} lg={1} className="g-2 py-5">
              <h1 style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Explore Projetos NFT</h1>
            </Row>
            <Row xs={4} md={7} lg={10} className="g-2 py-5">
            <Col key={0} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>TETO</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      Uma organização mundial focada na criação de casas emergenciais em locais de risco
                    </Card.Text>
                  </Card.Body>
                  
                </Card>
              </Col>
              <Col key={1} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Projeto Futuro</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      Financiamento da faculdade para pessoas necessitadas
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col key={2} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Body color="secondary" style={{height: '17rem'}}>
                    <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Dança Rocinha</Card.Title>
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" ,  paddingTop:'60px'}}>
                      Atividades de dança na comunidade da Rocinha
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            </div>
    
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home sogo={sogo} nft={nft} organizationFactory={organizationFactory} />
              } />
              <Route path="/organizations" element={
                <Organizations sogo={sogo} nft={nft} organizationFactory={organizationFactory} />
              }/>
              <Route path="/organizations/:orgId" element={
                <SocialOrg nft={nft} sogo={sogo} organizationFactory={organizationFactory}/>
              }/>
              <Route path="/create-sogo-nft" element={
                <CreateSogoNFT sogo={sogo} nft={nft} organizationFactory={organizationFactory} />
              } />
              <Route path="/create-sogo-fund" element={
                <CreateSogoFund organizationFactory={organizationFactory} sogo={sogo} sogoNFT={nft} />
              } />
              <Route path="/my-listed-items" element={
                <MyListedItems marketplace={sogo} nft={nft} account={account} />
              } />
              <Route path="/create-organization" element={
                <CreateOrganization organizationFactory={organizationFactory} />
              } />
              <Route path="/my-purchases" element={
                <MyPurchases marketplace={sogo} nft={nft} account={account} />
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
