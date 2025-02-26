import Layout from "@/utilities/layout";
import React, { useState } from "react";
import { Card, CardBody, Col, Container, Row } from "react-bootstrap";
import { Tab, Nav } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";
import SBC from "@/configcomponents/SBC";
import Device from "@/configcomponents/Device";
import AddSBC from "@/configcomponents/AddSBC";
import AddDevice from "@/configcomponents/AddDevice";
import { ToastContainer } from 'react-toastify';

const ConfigurationPage = () => {
    const [key, setKey] = useState('sbc');
    const [activeTab, setActiveTab] = useState('sbc');
    const [load, setLoad] = useState(0);
    return (
        <div>
            <Head>
                <title>EOG Resources Inc</title>
                <meta name="description" content="EOG Resources Inc" />
                <link rel="icon" href="/eog.ico" />
            </Head>
            <Layout>
                <ToastContainer autoClose={1000} />
                <Container fluid style={{ backgroundColor: "#FFFFFF" }}>
                    <Row>
                        <Col className="mb-2">
                            <Card style={{ top: '20px', backgroundColor: "#FFFFFF", overflow: 'clip', boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)' }}>
                                <CardBody style={{ backgroundColor: "#FFFFFF" }}>
                                    <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                            <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} style={{ width: '30%' }}>
                                                <Nav.Item style={{ flex: 3, textAlign: 'center', fontWeight: 'bold' }}>
                                                    <Nav.Link
                                                        eventKey="sbc"
                                                        style={{
                                                            color: activeTab === "sbc" ? "white" : "black",
                                                            backgroundColor: activeTab === "sbc" ? "#FF1100" : "transparent"
                                                        }}
                                                    >
                                                        SBC Configuration
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item style={{ flex: 3, textAlign: 'center', fontWeight: 'bold' }}>
                                                    <Nav.Link
                                                        eventKey="addDevice"
                                                        style={{
                                                            color: activeTab === "addDevice" ? "white" : "black",
                                                            backgroundColor: activeTab === "addDevice" ? "#FF1100" : "transparent"
                                                        }}
                                                    >
                                                        Device Configuration
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                            {activeTab === 'sbc'? < AddSBC setLoad={setLoad}/> : <AddDevice setLoad={setLoad}/>}
                                        </div>
                                    </Tab.Container>
                                     <SBC activeTab={activeTab} loader={load} />
                                    <Device activeTab={activeTab} loader={load}/>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Layout>
        </div>
    );
}
export default ConfigurationPage;