import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Modal, Row, Col, Card, Button } from 'react-bootstrap'

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    loadMarketplaceItems()
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      <div className="px-2 container">
      <Row xs={1} md={2} lg={10} className="g-4 py-5">
        <h1 style={{ fontSize: "5rem", fontFamily: 'Poppins', textAlign:"left" }}>Pensar global e agir local nunca foi tão real</h1>
      </Row>
      <Row xs={2} md={2} lg={10} className="g-4 py-5">
        <Col key={0} className="overflow-hidden">
          <Card>
            <Card.Img variant="top"  />
            <Card.Body color="secondary">
              <Card.Title>Acompanhe seu impacto</Card.Title>
              <Card.Text>
                Veja como os seus bens digitais estão impactando as causa sociais associadas
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
        <Col key={1} className="overflow-hidden">
          <Card>
            <Card.Img variant="top"  />
            <Card.Body color="secondary">
              <Card.Title>Saiba onde investir</Card.Title>
              <Card.Text>
                Veja as campanhas sociais que estão rolando e garanta sua arte social
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
      </Row>

      </div>
      
      {items.length > 0 ?
        <div className="px-5 container">
          <h1 style={{ fontSize: "5rem", fontFamily: 'Poppins', textAlign:"left" }}>Coleções em destaque</h1>
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
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
                      <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}
export default Home