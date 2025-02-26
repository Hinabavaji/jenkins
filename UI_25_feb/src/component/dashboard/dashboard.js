import Layout from "@/utilities/layout";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import Status from "@/component/dashboard/Status";
import DateandTime from "@/component/dashboard/DateandTime";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import EventsTable from "@/component/dashboard/EventsTable";
import GeoMaps from "./geoMaps";
import TopListeners from "./topListeners";
import TopTalkers from "./topTalkers";


const Dashboard = () => {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [refInt, setRefInt] = useState(null);
    const [buttonId, setButtonId] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
        if (!storedToken) {
            router.push(`/login`);
        }
        setRefInt(300000);
    }, [])
    const refreshInterval = (index, id) => {
        setButtonId(index);
        let interval = null;
        switch (id) {
            case 0:
                interval = 60000; // 1 minute
                break;
            case 1:
                interval = 300000; // 5 minutes
                break;
            case 2:
                interval = 600000; // 10 minutes
                break;
            case 3:
                interval = 1800000; // 30 minutes
                break;
            case 4:
                interval = 3600000; // 1 hour
                break;
            case 5:
                interval = 21600000; // 6 hours
                break;
            case 6:
                interval = 43200000; // 12 hours
                break;
            default:
                interval = null;
        }
        setRefInt(interval);
    };
    const dropdownItems = [
        { label: '1 minute', value: 0 },
        { label: '5 minutes', value: 1 },
        { label: '10 minutes', value: 2 },
        { label: '30 minutes', value: 3 },
        { label: '1 hour', value: 4 },
        { label: '6 hours', value: 5 },
        { label: '12 hours', value: 6 },
    ];
    return (
        <Layout>
            <ToastContainer autoClose={1000} />
            <Col className="mb-2">
                    <Card style={{ height: '90vh', backgroundColor: "#EDEDED", overflow: 'auto' }}>
                        <CardBody style={{ overflow: 'auto', backgroundColor: "white" }}>
                            <div className="section">
                                <Row style={{ paddingBottom: "0.5%" }}>
                                    <Col md={6} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div>
                                            <DropdownButton key="DropdownButton"
                                                id={"dropdown-button-drop-DropdownButton"} size="sm"
                                                variant="secondary"
                                                title="Refresh Interval"
                                            >
                                                {dropdownItems.map((item, index) => (
                                                    <Dropdown.Item
                                                        key={index}
                                                        active={index === buttonId}
                                                        onClick={() => refreshInterval(index, item.value)}
                                                    >
                                                        {item.label}
                                                    </Dropdown.Item>
                                                ))}
                                            </DropdownButton>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="section">
                                <Row>
                                    {/* Status Component */}
                                    <Status token={token} refreshInterval={refInt} />
                                    {/* date component */}
                                    <DateandTime token={token} refreshInterval={refInt} />
                                    {/* geo Map component */}
                                    <GeoMaps />
                                </Row>
                            </div>
                            
                            <div className="section">
                                <Row>
                                    {/* Status Component */}
                                    < TopListeners />
                                    {/* date component */}
                                    <TopTalkers />
                               
                                </Row>
                            </div>
                            <div className="section">
                                <div>
                                    <Row>
                                        {/* Event Table Component */}
                                        <EventsTable token={token} refreshInterval={refInt} />
                                    </Row>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
        </Layout>
    )
}
export default Dashboard;