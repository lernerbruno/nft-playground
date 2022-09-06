import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom';
import { Modal, Row, Col, Card, Button } from 'react-bootstrap'
import ProgressBar from 'react-bootstrap/ProgressBar';

const Home = ({ sogo, nft, organizationFactory }) => {

  const [loading, setLoading] = useState(true)
  const [orgs, setOrgs] = useState([])
  const [funds, setFunds] = useState([])
  const [orgCount, setOrgCount] = useState(0)
  const navigate = useNavigate();

  const loadOrganizations = async () => {
    const orgCount = await organizationFactory.getOrgCount()
    setOrgCount(orgCount)
    let orgs = []
    for (let i = 0; i < orgCount; i++) {
      const orgName = await organizationFactory.getOrganizationName(i)
      const orgPurpose = await organizationFactory.getOrganizationPurpose(i)
      const orgDescription = await organizationFactory.getOrganizationDescription(i)
      const orgBalance = await organizationFactory.getOrganizationBalance(i)
      orgs.push({
        name: orgName,
        purpose: orgPurpose,
        description: orgDescription,
        balance: orgBalance
      })
    }
    setOrgs(orgs)
  }

  // const loadMarketplaceItems = async () => {
  //   // Load all unsold items
  //   const itemCount = await sogo.itemCount()
  //   console.log(itemCount)
  //   setItemCount(itemCount)
    
    // let items = []
    // for (let i = 1; i <= itemCount; i++) {
    //   const item = await sogo.items(i)
    //   if (!item.sold) {
    //     // get uri url from nft contract
    //     const uri = await nft.tokenURI(item.tokenId)
    //     const imagePath = JSON.parse(uri.substring(6))["image"]
        
    //     // use uri to fetch the nft metadata stored on ipfs 
    //     // const response = await fetch(uri)
    //     // const metadata = await response.json()
    //     // get total price of item (item price + fee)
    //     const totalPrice = await sogo.getTotalPrice(item.itemId)
    //     // Add item to items array
    //     items.push({
    //       totalPrice,
    //       itemId: item.itemId,
    //       seller: item.seller,
    //       // name: metadata.name,
    //       // description: metadata.description,
    //       image: `assets/${imagePath}`
    //     })
    //   }
    // }
    // setLoading(false)
    // setItems(items)
  // }

  const loadSogoFunds = async () => {
    // Load all unsold items
    // console.log(await sogo.fundsCount())
    const fundsCount = await sogo.fundsCount()
    // setFundCount(fundsCount)
    
    let funds = []
    for (let i = 1; i <= fundsCount; i++) {
      const fund = await sogo.sogoFunds(i)
      
      // // get uri url from nft contract
      // const uri = await nft.tokenURI(item.tokenId)
      // const imagePath = JSON.parse(uri.substring(6))["image"]
      
      // use uri to fetch the nft metadata stored on ipfs 
      // const response = await fetch(uri)
      // const metadata = await response.json()
      // get total price of item (item price + fee)
      const totalDonations = 
      // Add item to items array
      funds.push({
        fundName: fund.fundName,
        totalDonations: fund.totalValue,
        // seller: item.seller,
        // // name: metadata.name,
        // // description: metadata.description,
        // image: `assets/${imagePath}`
      })
    
    }
    setLoading(false)
    setFunds(funds)
  }

  // const loadPage = async () => {
  //   loadMarketplaceItems()
  //   loadSocialOrganizations()
  //   setLoading(false)
  // }

  // const loadSocialOrganizations = async () => {
  //   const tokenCount = await socialOrganization.tokenCount()
  //   let tokens = []
  //   const orgName = await socialOrganization.name()
  //   setOrgname(orgName)
  //   // for (let i = 1; i <= tokenCount; i++) {
  //   //   const item = await socialOrganization.tokens(i)
  //   //   if (!item.sold) {
  //   //     // get uri url from nft contract
  //   //     const uri = await nft.tokenURI(item.tokenId)
  //   //     // use uri to fetch the nft metadata stored on ipfs 
  //   //     const response = await fetch(uri)
  //   //     const metadata = await response.json()
  //   //     // get total price of item (item price + fee)
  //   //     const totalPrice = await marketplace.getTotalPrice(item.itemId)
  //   //     // Add item to items array
  //   //     items.push({
  //   //       totalPrice,
  //   //       itemId: item.itemId,
  //   //       seller: item.seller,
  //   //       name: metadata.name,
  //   //       description: metadata.description,
  //   //       image: metadata.image
  //   //     })
  //   //   }
  //   // }
  // }

  const navigateToOrg = async(e) => {
    navigate(0)
  }

  // const buyMarketItem = async (item) => {
  //   await (await sogo.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
  //   loadMarketplaceItems()
  // }

  useEffect(() => {
    loadOrganizations();
    setLoading(false);
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      
        <div className="px-5 container">
          <Row xs={1} md={1} lg={1} className="g-4 py-5">
            <h7 style={{ fontSize: "4rem", fontFamily: 'Poppins', textAlign:"left" }}>Explore como você pode contribuir para o bem ao seu redor</h7>  
          </Row>
          {/* <Row xs={1} md={2} lg={10} className="g-4 py-5">
            <ProgressBar animated style={{textAlign:"right", width:'80%', margin: 'auto' }} now={60} label={`60%`}/>
          </Row> */}
          {orgs.length > 0 ?
            <Row xs={1} md={2} lg={4} className="g-4 py-5">
              {orgs.map((org, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card onClick={navigateToOrg} style={{ cursor: "pointer" }}>
                    {/* <Card.Img variant="top" src={org.name} /> */}
                    <Card.Body color="secondary">
                      <Card.Title>{org.name}</Card.Title>
                      <Card.Text>
                        R$ {org.balance.toString(10)} recebido 
                      </Card.Text>
                      <Card.Text>
                        Propósito: {org.purpose} 
                      </Card.Text>
                      <Card.Text>
                        Descrição: {org.description} 
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                
              ))}
              </Row>
                : (
            <main style={{ padding: "1rem 0" }}>
              <h2>No organizations deployed</h2>
            </main>
          )}
        </div>
        
    </div>
  );
}
export default Home