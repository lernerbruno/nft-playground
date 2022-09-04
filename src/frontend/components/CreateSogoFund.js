import { useState } from 'react'
// import { ethers } from "hardhat"
import { Row, Form, Button } from 'react-bootstrap'
// import { create as ipfsHttpClient } from 'ipfs-http-client'
// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const CreateSogoFund = ({ organizationFactory, sogo, sogoNFT }) => {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [initialDonation, setInitialDonation] = useState(0)
  const [purpose, setPurpose] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const CreateSogoFund = async () => {
    if (!purpose || !name  || !description || !beneficiaries || !initialDonation) return
    try{
        
        const orgAccount = await organizationFactory.ongAccount
        
        console.log(await (await sogo.makeSogoFund('0x5fc8d32690cc91d4c39d9d3abcbd16989f875707', initialDonation, name)).wait())
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setPurpose(e.target.value)} size="lg" required as="textarea" placeholder="Purpose" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setInitialDonation(e.target.value)} size="lg" required as="textarea" placeholder="Initial Donation (ETH)" />

              {/* Maybe do in another page */}
              <Form.Select onChange={(e) => setBeneficiaries(e.target.value)} size="lg" required as="dropdown" placeholder="Select beneficary NGOs" >
                <option value="1">TETO</option>
                <option value="2">Casa Funk Brasil</option>
                <option value="3">Projeto Futuro</option>
              </Form.Select>
              
              <div className="d-grid px-0">
                <Button onClick={CreateSogoFund} variant="primary" size="lg">
                  Create Sogo Fund
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateSogoFund