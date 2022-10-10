import { useState, useEffect } from 'react'
import {
    BrowserRouter as Router,
    useNavigate,
    Routes,
    Route
  } from "react-router-dom";
import { Row, Col, Card} from 'react-bootstrap'

const SocialProjects = ({ socialProjectFactory }) => {

  const [loading, setLoading] = useState(true)
  const [projs, setProjs] = useState([])
  const navigate = useNavigate();

  const loadSocialProjects = async () => {
    const projCount = await socialProjectFactory.getSocialProjectsCount()
    let projs = []
    for (let i = 0; i < projCount; i++) {
      const projName = await socialProjectFactory.getProjectName(i)
      const projPurpose = await socialProjectFactory.getProjectPurpose(i)
      const projDescription = await socialProjectFactory.getProjectDescription(i)
      const projBalance = await socialProjectFactory.getProjectBalance(i)
      projs.push({
        name: projName,
        purpose: projPurpose,
        description: projDescription,
        balance: projBalance
      })
    }
    setProjs(projs)
  }

  const navigateToProject = async(e, idx) => {
    navigate(`/projects/${idx}`)
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
            <h6 className="normal-txt" style={{ fontSize: "4rem", fontFamily: 'Poppins', textAlign:"left"}}>Explore como você pode contribuir para o bem ao seu redor</h6>  
          </Row>
          {/* <Row xs={1} md={2} lg={10} className="g-4 py-5">
            <ProgressBar animated style={{textAlign:"right", width:'80%', margin: 'auto' }} now={60} label={`60%`}/>
          </Row> */}
          {projs.length > 0 ?
            <Row xs={1} md={2} lg={4} className="g-4 py-5">
              {projs.map((proj, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card onClick={event => navigateToProject(event, idx)} style={{ cursor: "pointer" }}>
                    <Card.Body color="secondary">
                      <Card.Title>{proj.name}</Card.Title>
                      <Card.Text>
                         {proj.balance.toString()/10e17} ETH recebido 
                      </Card.Text>
                      <Card.Text>
                        Propósito: {proj.purpose} 
                      </Card.Text>
                      <Card.Text>
                        Descrição: {proj.description} 
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                
              ))}
            </Row>
                : (
            <main style={{ padding: "1rem 0" }}>
              <h2>No Social Project deployed</h2>
            </main>
          )}
        </div>
    </div>
  );
}
export default SocialProjects