import {
    Link,
    useNavigate
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
// import market from './market.png'

const Navigation = ({ web3Handler, account }) => {
    const navigate = useNavigate();
    return (
        <Navbar className="color-nav" expand="lg">
            <Container>
                <Navbar.Brand onClick={() => {navigate('/')}} style={{cursor:'pointer'}} href="">
                    <img src='assets/logoSogo.png' style={{ width:'100px', height:'52px'}}></img>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto" >
                        <Nav.Link style={{color:'#0D0D0D'}} as={Link} to="/projects">Explore Projetcts</Nav.Link>
                        <Nav.Link style={{color:'#0D0D0D'}} as={Link} to="/create-sogo-nft">Create Sogo NFT</Nav.Link>
                        {/* <Nav.Link style={{color:'#0D0D0D'}} as={Link} to="/create-sogo-fund">Create Sogo Fund</Nav.Link> */}
                        <Nav.Link style={{color:'#0D0D0D'}} as={Link} to="/create-project">Create Project</Nav.Link>
                        <Nav.Link style={{color:'#0D0D0D'}} as={Link} to="/my-purchases">My Purchases</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button style={{color:'#0D0D0D', borderColor:'#0D0D0D'}} onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;