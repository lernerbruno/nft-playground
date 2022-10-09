import { useState, useEffect, useRef } from 'react'
import { withRouter, useParams } from 'react-router-dom'; 
import { ethers } from "ethers"
import { Modal, Row, Col, Card, Button } from 'react-bootstrap'
import ProgressBar from 'react-bootstrap/ProgressBar';
import ProjectBanner from './ProjectBanner';
import { Tab, Tabs, Box } from '@mui/material'

const SocialProject = ({ sogo, nft, organizationFactory }) => {
  const [allValues, setAllValues] = useState({
    loading: true,
    org: {},
    sogoTokens: [],
    confirmPassword: '',
    donationCount: 0
  });
  let { orgId } = useParams();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };
  const loadOrg = async() => {
    const orgName = await organizationFactory.getOrganizationName(orgId)
    const orgPurpose = await organizationFactory.getOrganizationPurpose(orgId)
    const orgDescription = await organizationFactory.getOrganizationDescription(orgId)
    const orgBalance = await organizationFactory.getOrganizationBalance(orgId)
    const donors = await organizationFactory.getDonors(orgId)
    const donationsAmounts = await organizationFactory.getDonationsAmounts(orgId)
    const orgAddress = await organizationFactory.getOrganizationContract(orgId)
    
    const _org = {
      name: orgName,
      purpose: orgPurpose,
      description: orgDescription,
      balance: orgBalance,
      donors: donors,
      donationsAmounts: donationsAmounts,
      address: orgAddress
    }

    loadSogoArts(_org)
  }

  const loadSogoArts = async (_org) => {
    // Load all unsold items 
    const orgTokens = await sogo.getOrgTokens(_org.address)
    let sogoTokens = []
    for (let i = 1; i <= orgTokens.length; i++) {
      const item = await sogo.sogoArts(i)
      if (!item.sold) {
        // get uri url from nft contract
        
        const uri = await nft.tokenURI(item.tokenId)
        const name = JSON.parse(uri)["name"]
        const description = JSON.parse(uri)["description"]
        // console.log(imagePath)
        // use uri to fetch the nft metadata stored on ipfs 
        // const response = await fetch(uri)
        // const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await sogo.getTotalPrice(item.SogoArtId)
        // Add item to items array 

        sogoTokens.push({
          totalPrice,
          name: name,
          description: description,
          itemId: item.SogoArtId,
          seller: item.seller,
          // name: metadata.name,
          // description: metadata.description,
          image: '/assets/polvo_placeholder.png'
        })
      }
    }
    setAllValues(prevAllValues => ({...prevAllValues, org: _org}))
    setAllValues(prevAllValues => ({...prevAllValues, sogoTokens: sogoTokens}))
    setAllValues(prevAllValues => ({...prevAllValues, loading: false})) 
  }

  const buySogoArt = async (sogoToken) => {
    await (await sogo.purchaseSogoArt(sogoToken.itemId, { value: sogoToken.totalPrice })).wait()
    loadSogoArts()
  }

  const donate = async() => {
    console.log(ethers.utils.parseEther('1.01'))
    await(await organizationFactory.donateToOrganization(orgId, ethers.utils.parseEther('1'), { value: ethers.utils.parseEther('1') })).wait()
    loadOrg()
  }
  
  useEffect(() => {
    loadOrg()
    }, [])
  if (allValues.loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    
    <div className="flex justify-center">
      
        <div className="px-5 container">
          <ProjectBanner organizationFactory={organizationFactory}/>
          <Tabs value={tabIndex} onChange={handleTabChange}>
              <Tab label="Como apoiar" value={0}/>
              <Tab label="O Projeto" value={1}/>
              <Tab label="Impacto" value={2}/>
              <Tab label="Apoiadores" value={3}/>
          </Tabs>
          <Box sx={{ padding: 2 }}>
              {tabIndex === 0 && (
              <Row xs={3} md={3} lg={3} className="g-4 py-5" style={{ height:'500px' }}>
                  <Card onClick={() => {}} style={{ cursor: "pointer", width:'33%', height:'100%' }}>
                    <Card.Body color="primary">
                      <Card.Text>Light Funder</Card.Text>
                      <Card.Text style={{textAlign: "left"}}>Doações menores,</Card.Text>
                      <Card.Text style={{textAlign: "left"}}>Recompensas singelas</Card.Text>
                    </Card.Body>
                  </Card>
                  <Card onClick={() => {}} style={{ cursor: "pointer", width:'33%', height:'100%' }}>
                    <Card.Body color="primary">
                      <Card.Text>Bold Funder</Card.Text>
                    </Card.Body>
                  </Card>
                  <Card onClick={() => {}} style={{ cursor: "pointer", width:'33%', height:'100%' }}>
                    <Card.Body color="primary">
                      <Card.Text>Super Funder</Card.Text>
                    </Card.Body>
                  </Card>
              </Row>
              )}
              {tabIndex === 0 && allValues.sogoTokens && allValues.sogoTokens.length > 0 && (
                <Row xs={1} md={2} lg={4} className="g-4 py-5">
                  {allValues.sogoTokens.map((sogoToken, idx) => {
                    return (
                    <Col key={idx} className="overflow-hidden">
                      <Card onClick={() => {buySogoArt(sogoToken)}} style={{ cursor: "pointer" }}>
                        <Card.Title>{sogoToken.name}</Card.Title>
                        <Card.Body color="primary">
                          <Card.Img src={sogoToken.image} style={{ width:'200px', height:'200px'}}/>
                          <Card.Text>{sogoToken.description}</Card.Text>
                        </Card.Body>
                        <Card.Footer>
                          <Card.Text variant='primary'> Compre por {sogoToken.totalPrice/10e17} ETH </Card.Text>
                        </Card.Footer>
                      </Card>
                    </Col>
                    
                  )})}  
              </Row>
              )}
              
              {tabIndex === 3 && allValues.org.donors && allValues.org.donors.length > 0 &&
                <div>
                  <h6 className="normal-txt" style={{ fontSize: "3rem", fontFamily: 'Poppins', textAlign:"left" }}>Doações</h6>  <br/>
                  <Row xs={2} md={2} lg={2} className="g-4 py-2">
                    <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" }}>Endereço do Doador</h6>
                    <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"right" }}>Valor doado</h6> 
                  </Row>
                  {allValues.org.donors.map((donorAddress, idx) => (
                     <Row xs={2} md={2} lg={2} className="g-4 py-2">
                      <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" }}>{donorAddress}</h6>
                      <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"right" }}>{allValues.org.donationsAmounts[idx].toString()/10e17} ETH</h6> 
                     </Row>
                    
                  ))}
                </div> 
              }
              {tabIndex === 3 && allValues.org.donors && allValues.org.donors.length == 0 &&
                <div>
                  No donation
                </div>
              }
          </Box>
        </div>
        
    </div>
  );
}
export default SocialProject