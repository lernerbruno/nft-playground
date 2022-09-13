import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom';
import { Modal, Row, Col, Card, Button } from 'react-bootstrap'
import ProgressBar from 'react-bootstrap/ProgressBar';

const Home = ({ sogo, nft, organizationFactory }) => {

  const [loading, setLoading] = useState(true)
  const [orgs, setOrgs] = useState([])
  const [funds, setFunds] = useState([])
  const [orgCount, setOrgCount] = useState(0)
  const [totalDonated, setTotalDonated] = useState(0)
  const navigate = useNavigate();

  const loadOrganizations = async () => {
    const orgCount = await organizationFactory.getOrgCount()
    setOrgCount(orgCount.toString())
    const totalDonated = await organizationFactory.getTotalDonated()
    setTotalDonated(totalDonated)
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
    setLoading(false)
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

  const navigateToOrganizations = async () => {
    navigate('/organizations')
  }
  const navigateToCreateOrg = async () => {
    navigate('/create-organization')
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
            <h6 className="normal-txt" style={{ fontSize: "6rem", fontFamily: 'Poppins', textAlign:"center", color:'#F6EFEA' }}>a evolução do investimento social</h6>  
          </Row>
          <Row xs={1} md={1} lg={1} className="g-4 py-5">
            <h3 className="normal-txt" style={{ fontSize: "3rem", fontFamily: 'Poppins', textAlign:"center" }}>{totalDonated.toString()/10e17} ETH doados para {orgCount} projetos sociais</h3>
          </Row>
          <Row xs={2} md={2} lg={2} className="g-2 py-5">
              <Col key={0} className="overflow-hidden">
                <Card onClick={() => navigateToOrganizations()} style={{ cursor: "pointer" }}>
                  <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Explore Projetos</Card.Title>
                  <Card.Body color="secondary">  
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" }}>
                      Vamos descobrir o que está sendo feito para nosso país prosperar, e vamos fazer parte disso!
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col key={1} className="overflow-hidden">
                <Card onClick={() => navigateToCreateOrg()} style={{ cursor: "pointer" }}>
                <Card.Title style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"center" }}>Publique seu Projeto</Card.Title>
                  <Card.Body color="secondary">
                    <Card.Text style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" }}>
                      Publique sua organização social na nossa plataforma para receber recursos e atenção da sua comunidade
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          
          {/* <Row xs={1} md={2} lg={10} className="g-4 py-5">
            <ProgressBar animated style={{textAlign:"right", width:'80%', margin: 'auto' }} now={60} label={`60%`}/>
          </Row> */}
        </div>
        
    </div>
  );
}
export default Home