import { useState } from 'react'
import { Row, Form, Button } from 'react-bootstrap'

const CreateOrganization = ({ organizationFactory }) => {
    const [purpose, setPurpose] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const DeployOrganization = async () => {
        if (!purpose || !name  || !description) return
        try{
            await(await organizationFactory.createOrganization(name)).wait()
        } catch(error) {
            console.log("Error creating Organization: ", error)
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
                
                <div className="d-grid px-0">
                <Button onClick={DeployOrganization} variant="primary" size="lg">
                    Deploy Organization
                </Button>
                </div>
            </Row>
            </div>
        </main>
        </div>
    </div>
    );
}

export default CreateOrganization