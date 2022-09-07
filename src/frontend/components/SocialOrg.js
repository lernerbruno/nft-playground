import { useState, useEffect } from 'react'
import { withRouter, useParams } from 'react-router-dom'; 
import { ethers } from "ethers"
import { Modal, Row, Col, Card, Button } from 'react-bootstrap'
import ProgressBar from 'react-bootstrap/ProgressBar';

const SocialOrg = ({ organizationFactory }) => {

  const [loading, setLoading] = useState(true)
  const [org, setOrg] = useState({})
  const [orgCount, setOrgCount] = useState(0)
  let { orgId } = useParams();

  const loadOrg = async() => {
    const orgName = await organizationFactory.getOrganizationName(orgId)
    const orgPurpose = await organizationFactory.getOrganizationPurpose(orgId)
    const orgDescription = await organizationFactory.getOrganizationDescription(orgId)
    const orgBalance = await organizationFactory.getOrganizationBalance(orgId)
    setOrg({
        name: orgName,
        purpose: orgPurpose,
        description: orgDescription,
        balance: orgBalance
    })
  }

  const donate = async() => {
    await(await organizationFactory.donateToOrganization(orgId, ethers.utils.parseEther('1'), { value: ethers.utils.parseEther('1') })).wait()
  }
  
  useEffect(() => {
    loadOrg()
    setLoading(false)
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      
        <div className="px-5 container">
          <Row xs={2} md={2} lg={2} className="g-4 py-5">
            <h7 style={{ fontSize: "4rem", fontFamily: 'Poppins', textAlign:"left" }}>{org && org.name}</h7>  
            <Col key={0} className="overflow-hidden">
              <h7 style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" }}>Total Arrecadado</h7><br/>
              <h7 style={{ fontSize: "3rem", fontFamily: 'Poppins', textAlign:"left" }}>R$ {org.balance && org.balance.toString()}</h7> <br/>
              <Button className='button-primary' onClick={() => {donate()}} size="sm">
                Doe e Apoie
              </Button>
            </Col>
            
          </Row>
        </div>
        
    </div>
  );
}
export default SocialOrg