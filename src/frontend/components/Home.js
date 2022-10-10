import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom';
import { Modal, Row, Col} from 'react-bootstrap'
import ProgressBar from 'react-bootstrap/ProgressBar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Home = ({ sogo, nft, socialProjectFactory }) => {

  const [loading, setLoading] = useState(true)
  const [orgs, setOrgs] = useState([])
  const [funds, setFunds] = useState([])
  const [orgCount, setOrgCount] = useState(0)
  const [totalDonated, setTotalDonated] = useState(0)
  const navigate = useNavigate();

  const loadSocialProjects = async () => {
    const orgCount = await socialProjectFactory.getSocialProjectsCount()
    setOrgCount(orgCount.toString())
    const totalDonated = await socialProjectFactory.getTotalDonated()
    setTotalDonated(totalDonated)
    let orgs = []
    for (let i = 0; i < orgCount; i++) {
      const orgName = await socialProjectFactory.getProjectName(i)
      const orgPurpose = await socialProjectFactory.getProjectPurpose(i)
      const orgDescription = await socialProjectFactory.getProjectDescription(i)
      const orgBalance = await socialProjectFactory.getProjectBalance(i)
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

  const navigateToSocialProjects = async () => {
    navigate('/projects')
  }
  const navigateToCreateOrg = async () => {
    navigate('/create-project')
  }

  useEffect(() => {
    loadSocialProjects();
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
            <h6 className="normal-txt" style={{ fontSize: "6rem", fontFamily: 'Poppins', textAlign:"center",}}>a evolução do investimento social</h6>  
          </Row>
          <Row xs={1} md={1} lg={1} className="g-4 py-5">
            <h3 className="normal-txt" style={{ fontSize: "3rem", fontFamily: 'Poppins', textAlign:"center" }}>{totalDonated.toString()/10e17} ETH doados para {orgCount} projetos sociais</h3>
          </Row>
          <Row xs={2} md={2} lg={2} className="g-2 py-5">
              <Col key={0} className="overflow-hidden" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Card sx={{ maxWidth: 500, minHeight: 200 }} onClick={() => navigateToSocialProjects()} style={{ cursor: "pointer" }}>
                  <CardContent>
                    <Typography sx={{ fontSize: '2rem' }} color="text.primary" gutterBottom>
                        Explore Projetos
                    </Typography>
                    <Typography sx={{ fontSize: '1rem' }} color="text.secondary" gutterBottom>
                    Vamos descobrir o que está sendo feito para nosso país prosperar, e vamos fazer parte disso!
                    </Typography>
                  </CardContent>
                </Card>
              </Col>
              <Col key={1} className="overflow-hidden" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Card sx={{ maxWidth: 500, minHeight: 200 }} onClick={() => navigateToCreateOrg()} style={{ cursor: "pointer" }}>
                  <CardContent>
                    <Typography sx={{ fontSize: '2rem' }} color="text.primary" gutterBottom>
                      Publique seu Projeto
                    </Typography>
                    <Typography sx={{ fontSize: '1rem' }} color="text.secondary" gutterBottom>
                    Publique sua organização social na nossa plataforma para receber recursos e atenção da sua comunidade
                    </Typography>
                  </CardContent>
                </Card>
              </Col>
            </Row>
        </div>
        
    </div>
  );
}
export default Home