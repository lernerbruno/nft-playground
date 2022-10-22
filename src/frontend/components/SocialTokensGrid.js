import { useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { Slider } from '@mui/material'
import { ethers } from "ethers"

const SocialTokensGrid = ({ socialTokens, buySocialToken }) => {
  const [allValues, setAllValues] = useState({
    priceFilter: [0, 10000],
    loading: true,
    value: 0
  });

  const handlePriceFilter =  (_, newValue) => {
    setAllValues(prevAllValues => ({...prevAllValues, priceFilter: newValue}))
  }

  const valueText = (value) => {
    return `R$ ${value}`
  }

  const loadTokens = () => {
    let maxPrice = 0
    socialTokens.map((socialToken, _) => {
        if (socialToken.totalPrice > maxPrice) {
            maxPrice = ethers.utils.formatEther(socialToken.totalPrice)*1400
            console.log(maxPrice)
        }
    })
    setAllValues(prevAllValues => ({...prevAllValues, priceFilter: [0, maxPrice]}))
    setAllValues(prevAllValues => ({...prevAllValues, loading: false}))
  }
    
  useEffect(() => {
    loadTokens()
    }, [])
  if (allValues.loading) return (
    <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
    </main>
  )
  return (
    <div>
        <Row xs={4} md={4} lg={4} className="g-4 py-1">
            <Col>
                <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"center",}}>Valor da doação</h6>  
                <Slider
                    value={allValues.priceFilter}
                    onChange={handlePriceFilter}
                    valueLabelDisplay="auto"
                    getAriaValueText={valueText}
                />
            </Col>
            
        </Row>
        <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {socialTokens.map((socialToken, idx) => {
            return socialToken.totalPrice > allValues.priceFilter[0] 
            // && socialToken.totalPrice < allValues.priceFilter[1] 
            && (
            <Col key={idx} className="overflow-hidden">
              <Card onClick={() => {buySocialToken(socialToken)}} style={{ cursor: "pointer" }}>
                <Card.Title className="card-title">Doe R${(socialToken.totalPrice/10e17)*1400*10e17}  </Card.Title>
                <Card.Body color="primary">
                  {socialToken.sold ? (
                    <div>
                      <Card.Img src={socialToken.image} style={{ width:'200px', height:'200px', opacity:'20%'}}/>
                      <Card.Text> Token Sold</Card.Text>
                    </div>
                  ) : 
                  ( <div>
                      <Card.Img src={socialToken.image} style={{ width:'200px', height:'200px'}}/>
                      <Card.Text> Description:  {socialToken.description}</Card.Text>
                    </div>
                  )}
                   
                </Card.Body>
                <Card.Footer>
                  <Row xs={2} md={2} lg={2}>
                    <Button disabled={socialToken.sold} onClick={() => {buySocialToken(socialToken)}} className='button-primary' style={{width:'70%'}}><Card.Text variant='primary'> Comprar Token </Card.Text></Button>
                  </Row>
                </Card.Footer>
              </Card>
            </Col>
            
          )})}  
        </Row>
    </div>
  );
}
export default SocialTokensGrid