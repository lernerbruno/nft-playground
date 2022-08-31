import { useState } from 'react'
// import { ethers } from "hardhat"
import { Row, Form, Button } from 'react-bootstrap'
// import { create as ipfsHttpClient } from 'ipfs-http-client'
// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const CreateSogoCommunity = ({ sogo, sogoNFT }) => {
    const [beneficiaries, setBeneficiaries] = useState([])
    // const [projectLogo, setProjectLogo] = useState('')
    const [purpose, setPurpose] = useState('')
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
//   const uploadToIPFS = async (event) => {
//     event.preventDefault()
//     const file = event.target.files[0]
//     if (typeof file !== 'undefined') {
//       try {
//         const result = await client.add(file)
//         console.log(result)
//         // setProjectLogo(`https://ipfs.infura.io/ipfs/${result.path}`)
//       } catch (error){
//         console.log("ipfs image upload error: ", error)
//       }
//     }
//   }

  const CreateSogoCommunity = async () => {
    if (!purpose || !name  || !description || !beneficiaries) return
    try{
    //   const SocialProject = await ethers.getContractFactory("SocialProject");
    //   const socialProject = await SocialProject.deploy(orgName, symbol, projName);
    
    //   mintThenList(result)
        console.log(purpose,name,description,beneficiaries);
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }

//   const mintThenList = async (result) => {
//     const uri = `https://ipfs.infura.io/ipfs/${result.path}`
//     // mint nft 
//     await(await nft.mint(uri)).wait()
//     // get tokenId of new nft 
//     const id = await nft.tokenCount()
//     // approve marketplace to spend nft
//     await(await nft.setApprovalForAll(marketplace.address, true)).wait()
//     // add nft to marketplace
//     const listingPrice = ethers.utils.parseEther(price.toString())
//     await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
//   }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setPurpose(e.target.value)} size="lg" required as="textarea" placeholder="Purpose" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />

              {/* Maybe do in another page */}
              <Form.Select onChange={(e) => setBeneficiaries(e.target.value)} size="lg" required as="dropdown" placeholder="Select beneficary NGOs" >
                <option value="1">TETO</option>
                <option value="2">Casa Funk Brasil</option>
                <option value="3">Projeto Futuro</option>
              </Form.Select>
              
              <div className="d-grid px-0">
                <Button onClick={CreateSogoCommunity} variant="primary" size="lg">
                  Create Sogo Community
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateSogoCommunity