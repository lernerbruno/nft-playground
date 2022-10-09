import { useState, useEffect, useRef } from 'react'
import { withRouter, useParams } from 'react-router-dom'; 
import { ethers } from "ethers"
import { Modal, Row, Col, Card, Button } from 'react-bootstrap'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Tab, Tabs, Box } from '@mui/material'

const ProjectBanner = ({ organizationFactory }) => {
  const [allValues, setAllValues] = useState({
    loading: true,
    org: {},
    sogoTokens: [],
    confirmPassword: '',
    donationCount: 0
  });
  const [tabIndex, setTabIndex] = useState(0);
  let { orgId } = useParams();

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
    setAllValues(prevAllValues => ({...prevAllValues, org: _org}))
    setAllValues(prevAllValues => ({...prevAllValues, loading: false})) 
    
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
        <Row xs={2} md={2} lg={2} className="g-4 py-5">
            <Col style={{width: '70%'}}>
            <h6 className="normal-txt" style={{ fontSize: "4rem", fontFamily: 'Poppins', textAlign:"left" }}>{allValues.org && allValues.org.name}</h6> <br/>
            <h6 className="normal-txt" style={{ width:'70%', fontSize: "2rem", fontFamily: 'Poppins', textAlign:"left" }}>{allValues.org && allValues.org.description}</h6>  
            </Col>
            <Col style={{width: '30%'}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="Arrecadação" value={0}/>
                        <Tab label="Metas" value={1}/>
                    </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                    {tabIndex === 0 && (
                    <Row xs={2} md={2} lg={2} className="g-4 py-5">
                        <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" }}>{allValues.org.balance && allValues.org.balance.toString()/10e17} ETH arrecadados</h6> <br/>
                        <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"right" }}>28%</h6> <br/>
                    </Row>
                    )}
                    {tabIndex === 1 && (
                    <Row xs={2} md={2} lg={2} className="g-4 py-5">
                    </Row>
                    )}
                </Box>
                <Button className='button-primary' style={{float:"right"}} onClick={() => {donate()}} size="sm">
                    Doe e Apoie
                </Button>
            </Col>
        </Row>
  );
}
export default ProjectBanner