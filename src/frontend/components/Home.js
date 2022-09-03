import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Modal, Row, Col, Card, Button } from 'react-bootstrap'
import ProgressBar from 'react-bootstrap/ProgressBar';

const Home = ({ sogo, nft, organization }) => {

  const [loading, setLoading] = useState(true)
  const [orgName, setOrgname] = useState('')
  const [funds, setFunds] = useState([])
  const [fundCount, setFundCount] = useState(0)
  // const loadMarketplaceItems = async () => {
  //   // Load all unsold items
  //   const itemCount = await sogo.itemCount()
  //   console.log(itemCount)
  //   setItemCount(itemCount)
    
  //   let items = []
  //   for (let i = 1; i <= itemCount; i++) {
  //     const item = await sogo.items(i)
  //     if (!item.sold) {
  //       // get uri url from nft contract
  //       const uri = await nft.tokenURI(item.tokenId)
  //       const imagePath = JSON.parse(uri.substring(6))["image"]
        
  //       // use uri to fetch the nft metadata stored on ipfs 
  //       // const response = await fetch(uri)
  //       // const metadata = await response.json()
  //       // get total price of item (item price + fee)
  //       const totalPrice = await sogo.getTotalPrice(item.itemId)
  //       // Add item to items array
  //       items.push({
  //         totalPrice,
  //         itemId: item.itemId,
  //         seller: item.seller,
  //         // name: metadata.name,
  //         // description: metadata.description,
  //         image: `assets/${imagePath}`
  //       })
  //     }
  //   }
  //   setLoading(false)
  //   setItems(items)
  // }

  const loadSogoFunds = async () => {
    // Load all unsold items
    const fundsCount = await sogo.fundsCount()
    setFundCount(fundsCount)
    
    let funds = []
    for (let i = 1; i <= fundsCount; i++) {
      const fund = await sogo.sogoFunds(i)
      console.log(fund.fundName)
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


  // const buyMarketItem = async (item) => {
  //   await (await sogo.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
  //   loadMarketplaceItems()
  // }

  useEffect(() => {
    loadSogoFunds();
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      
        <div className="px-5 container">
          <Row xs={1} md={2} lg={10} className="g-4 py-5">
            <img src='assets/planeta.png' style={{ width:'100px', height:'52px'}}></img>
            
            {/* <h7 style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"left" }}>Participe das ações do TETO através da compra de artes digitais</h7> */}
            
          </Row>
          <Row xs={1} md={2} lg={10} className="g-4 py-5">
            <h1 style={{ fontSize: "5rem", fontFamily: 'Poppins', textAlign:"left", width:'75%' }}>Construa 4 casas em Jardim Gramacho</h1> 
          </Row>
          <Row xs={1} md={2} lg={10} className="g-4 py-5">
            {/* <h1 style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left", width:'10%' }}> {parseInt(itemCount['_hex'], 16)} Items </h1>  */}
            <h1 style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left", width:'10%' }}> R$ 100.000 Total Sold </h1> 
            <ProgressBar animated style={{textAlign:"right", width:'80%', margin: 'auto' }} now={60} label={`60%`}/>
          </Row>
          {/* {funds.length > 0 ?
            <Row xs={1} md={2} lg={4} className="g-4 py-5">
              {funds.map((fund, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card>
                    <Card.Img variant="top" src={item.image} />
                    <Card.Body color="secondary">
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        {item.description}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div className='d-grid'>
                        <Button onClick={() => {}} variant="primary" size="lg">
                          Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
                
              ))}
              </Row>
                : (
            <main style={{ padding: "1rem 0" }}>
              <h2>No listed assets</h2>
            </main>
          )} */}
        </div>
        
    </div>
  );
}
export default Home