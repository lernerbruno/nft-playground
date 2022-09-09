import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const CreateSogoNFT = ({ sogo, nft, organizationFactory }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [orgAddress, setOrgAddress] = useState('')
  const [orgs, setOrgs] = useState([])

  const loadOrganizations = async () => {
    const orgCount = await organizationFactory.getOrgCount()
    let orgs = []
    for (let i = 0; i < orgCount; i++) {
      const orgName = await organizationFactory.getOrganizationName(i)
      const orgPurpose = await organizationFactory.getOrganizationPurpose(i)
      const orgDescription = await organizationFactory.getOrganizationDescription(i)
      const orgBalance = await organizationFactory.getOrganizationBalance(i)
      const orgAddress = await organizationFactory.getOrganizationContract(i)

      orgs.push({
        name: orgName,
        purpose: orgPurpose,
        description: orgDescription,
        balance: orgBalance,
        address: orgAddress
      })
    }
    setOrgs(orgs)
  }

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    console.log(file.name)
    
    if (typeof file !== 'undefined') {
      try {
        // const result = await client.add(file)
        // console.log(result)
        setImage(`${file.name}`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  const createNFT = async () => {
    console.log(image, price, name, description, orgAddress)
    if (!image || !price || !name || !description || !orgAddress) return
    try{
      console.log(image, price, name, description, orgAddress)
      mintThenList(JSON.stringify({image, price, name, description}))
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (hash) => {
    const uri = `${hash}`
    console.log(uri)
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(sogo.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await sogo.makeSogoToken(nft.address, id, listingPrice, orgAddress)).wait()
  }

  useEffect(() => {
    loadOrganizations();
  }, [])
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Nome" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Descrição" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Preço em ETH" />
              
              { orgs.length > 0 &&
                <Form.Select onChange={(e) => setOrgAddress(e.target.value)} size="lg" required as="dropdown" placeholder="Escolha a ONG beneficiada  " >
                { orgs.map((org, idx) => (
                  <option value={org.address}>{org.name}</option> 
                  ))}
                </Form.Select>
              }
              
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Publicar NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateSogoNFT