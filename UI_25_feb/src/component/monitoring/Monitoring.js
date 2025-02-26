import Layout from "@/utilities/layout";
import React, { useState } from "react";
import { Card, CardBody, Col, Container, Row } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";
import DeviceInfo from "@/monitoringcomponents/DeviceInfo";

const MonitoringPage = () => {
    return (
        <div>
            <Head>
                <title>EOG Resources Inc</title>
                <meta name="description" content="EOG Resources Inc" />
                <link rel="icon" href="/eog.ico" />
            </Head>
            <Layout>
                <Container fluid style={{ backgroundColor: "#FFFFFF" }}>
                    <Row>
                        <Col className="mb-2">
                            <Card style={{ top: '20px', backgroundColor: "#FFFFFF", overflow: 'clip', boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)' }}>
                                <CardBody style={{ backgroundColor: "#FFFFFF" }}>
                                    <DeviceInfo />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Layout>
        </div>
    );
}
export default MonitoringPage;