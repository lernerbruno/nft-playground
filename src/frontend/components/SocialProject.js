import { useState, useEffect} from 'react'
import {useParams } from 'react-router-dom'; 
import { Row, Col, Card, Button } from 'react-bootstrap'
import ProjectBanner from './ProjectBanner';
import { Tab, Tabs, Box } from '@mui/material'

const SocialProject = ({ sogo, nft, socialProjectFactory }) => {
  const [allValues, setAllValues] = useState({
    loading: true,
    proj: {},
    socialTokens: [],
    confirmPassword: '',
    donationCount: 0
  });
  let { projId } = useParams();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  const loadSocialProject = async() => {
    const projName = await socialProjectFactory.getProjectName(projId)
    const projPurpose = await socialProjectFactory.getProjectPurpose(projId)
    const projDescription = await socialProjectFactory.getProjectDescription(projId)
    const projBalance = await socialProjectFactory.getProjectBalance(projId)
    const donors = await socialProjectFactory.getDonors(projId)
    const donationsAmounts = await socialProjectFactory.getDonationsAmounts(projId)
    const projAddress = await socialProjectFactory.getProjectContract(projId)
    
    const _proj = {
      name: projName,
      purpose: projPurpose,
      description: projDescription,
      balance: projBalance,
      donors: donors,
      donationsAmounts: donationsAmounts,
      address: projAddress
    }
    
    loadSocialTokens(_proj)
    
  }

  const loadSocialTokens = async (_proj) => {
    // Load all unsold items 
    const projTokens = await sogo.getProjectTokens(_proj.address)
    let socialTokens = []
    for (let i = 1; i <= projTokens.length; i++) {
      const item = await sogo.socialTokens(i)
      if (!item.sold) {
        const uri = await nft.tokenURI(item.itemId)
        const name = JSON.parse(uri)["name"]
        const description = JSON.parse(uri)["description"]
        // use uri to fetch the nft metadata stored on ipfs 
        // const response = await fetch(uri)
        // const metadata = await response.json()
        
        const totalPrice = await sogo.getTotalPrice(item.itemId)
        socialTokens.push({
          totalPrice,
          name: name,
          description: description,
          itemId: item.itemId,
          seller: item.seller,
          // name: metadata.name,
          // description: metadata.description,
          image: '/assets/polvo_placeholder.png'
        })
      }
    }
    setAllValues(prevAllValues => ({...prevAllValues, proj: _proj}))
    setAllValues(prevAllValues => ({...prevAllValues, socialTokens: socialTokens}))
    setAllValues(prevAllValues => ({...prevAllValues, loading: false})) 
  }

  const buySocialToken = async (socialToken) => {
    await (await sogo.purchaseSocialToken(socialToken.itemId, { value: socialToken.totalPrice })).wait()
    loadSocialTokens()
  }
  
  useEffect(() => {
    loadSocialProject()
    }, [])
  if (allValues.loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    
    <div className="flex justify-center">
      
        <div className="px-5 container">
          <ProjectBanner socialProjectFactory={socialProjectFactory}/>
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
              {tabIndex === 0 && allValues.socialTokens && allValues.socialTokens.length > 0 && (
                <div>
                <Row xs={1} md={2} lg={4} className="g-4 py-5">
                  <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" }}>Explore doações e recompensas</h6>
                </Row>
                <Row xs={1} md={2} lg={4} className="g-4 py-5">
                  {allValues.socialTokens.map((socialToken, idx) => {
                    return (
                    <Col key={idx} className="overflow-hidden">
                      <Card onClick={() => {buySocialToken(socialToken)}} style={{ cursor: "pointer" }}>
                        <Card.Title className="card-title">Doe R${(socialToken.totalPrice/10e17)*1400*10e17}  </Card.Title>
                        <Card.Body color="primary">
                          <Card.Img src={socialToken.image} style={{ width:'200px', height:'200px'}}/>
                          <Card.Text>{socialToken.description}</Card.Text>
                        </Card.Body>
                        <Card.Footer>
                          <Row xs={2} md={2} lg={2}>
                            <Button className='button-primary' style={{width:'70%'}}><Card.Text variant='primary'> Comprar Token </Card.Text></Button>
                          </Row>
                        </Card.Footer>
                      </Card>
                    </Col>
                    
                  )})}  
                </Row>
                </div>
                
              )}
              
              {tabIndex === 3 && allValues.proj.donors && allValues.proj.donors.length > 0 &&
                <div>
                  <h6 className="normal-txt" style={{ fontSize: "3rem", fontFamily: 'Poppins', textAlign:"left" }}>Doações</h6>  <br/>
                  <Row xs={2} md={2} lg={2} className="g-4 py-2">
                    <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" }}>Endereço do Doador</h6>
                    <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"right" }}>Valor doado</h6> 
                  </Row>
                  {allValues.proj.donors.map((donorAddress, idx) => (
                     <Row xs={2} md={2} lg={2} className="g-4 py-2">
                      <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" }}>{donorAddress}</h6>
                      <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"right" }}>{allValues.proj.donationsAmounts[idx].toString()/10e17} ETH</h6> 
                     </Row>
                    
                  ))}
                </div> 
              }
              {tabIndex === 3 && allValues.proj.donors && allValues.proj.donors.length == 0 &&
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