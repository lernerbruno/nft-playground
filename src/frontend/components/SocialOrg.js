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
          <Row xs={1} md={1} lg={1} className="g-4 py-5">
            <h7 style={{ fontSize: "4rem", fontFamily: 'Poppins', textAlign:"left" }}>{org && org.name}</h7>  
          </Row>
        </div>
        
    </div>
  );
}
export default SocialOrg