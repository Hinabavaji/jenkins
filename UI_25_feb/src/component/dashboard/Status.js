
import axios from "axios";
import { Row, Col, Card, Tooltip, OverlayTrigger } from "react-bootstrap";
import { motion } from "framer-motion";
import { ASSETS_STATUS } from "@/utilities/api";
import React, { useEffect, useState } from "react";

export default function Status({ token, refreshInterval }) {
    useEffect(() => {
        if (!token) return;
        assetsStatus(token);
        const interval = setInterval(() => {
            assetsStatus(token);
        }, refreshInterval);
        return () => clearInterval(interval);
    }, [token, refreshInterval]);

    const assetsStatus = async (storedToken) => {
        try {
            const response = await axios.get(ASSETS_STATUS, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            if (response.status === 200) {
                const assets = response.data;
                console.log('status', assets);
                setSeverityCounts({
                    IT_Device: assets.assets || 0,
                    Active_IT_device: assets.active || 0,
                    Inactive_IT_device: assets.inactive || 0,
                    Resolved: assets.resolved_events || 0,
                    Unresolved: assets.unresolved_events || 0,
                });
                console.log('status', assets);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const [severityCounts, setSeverityCounts] = useState({
        IT_Device: 0,
        Active_IT_device: 0,
        Inactive_IT_device: 0,
        Resolved: 0,
        Unresolved: 0,
    });

    const severityColors = {
        IT_Device: "#EBFBF2",
        Active_IT_device: "#F7F3FE",
        Inactive_IT_device: "#FEF6F0",
        Resolved: "#FDFDE9",
        Unresolved: "#EFF9FF",
    };

    const severityDescriptions = {
        IT_Device: "Routers, Switches, Firewalls, Access Points (APs), Servers etc.",
        Active_IT_device: "Network-connected device that is currently operational and involved in processing, transmitting, or managing data within the network.",
        Inactive_IT_device: "Devices that are not network-connected.",
        Resolved: "Alerts for issues like high traffic, network congestion, or device malfunctions.",
        Unresolved: "Notifications triggered based on network activity or system behavior.",
    };

    return (
        <>
            <Col xs={12} md={8} lg={6} className="mx-auto">
                <div
                    className="border p-3 mb-3"
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                        maxWidth: "100%",
                        minHeight: "280px",
                        overflow: "hidden",
                    }}
                >
                    <Row className="gx-4 gy-4">
                        {Object.entries(severityCounts).map(([severity, count], index) => (
                            <Col 
                                xs={12} sm={6} md={4} lg={4} key={severity} 
                                className="d-flex justify-content-center"
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.05 }} 
                                    transition={{ duration: 0.3 }}
                                    className="w-100" 
                                >
                                    <Card
                                        style={{
                                            backgroundColor: severityColors[severity],
                                            color: "#333333",
                                            textAlign: "left",
                                            borderRadius: "8px",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            height: "100%", 
                                            border: "none",
                                            padding: "0.8rem",
                                            position: "relative",
                                            display: "flex",  
                                            flexDirection: "column",  
                                        }}
                                    >
                                        <Card.Body style={{ paddingBottom: "1.5rem", flexGrow: 1 }}>
                                            <div 
                                                style={{
                                                    position: "absolute",
                                                    top: "8px",
                                                    right: "12px",
                                                    fontSize: "2.5rem",
                                                    color: "#333333",
                                                    display: "flex",
                                                    alignItems: "center",  
                                                }}
                                            >
                                                {count}
                                            </div>

                                            <div>
                                                <h5
                                                    className="card-title"
                                                    style={{
                                                        marginBottom: "15px",
                                                        textAlign: "left",
                                                        fontSize: "1.4rem",
                                                    }}
                                                >
                                                    {severity.replace(/_/g, " ")}
                                                </h5>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id={`tooltip-${severity}`}>
                                                        {severityDescriptions[severity]}
                                                    </Tooltip>}
                                                >
                                                    <p
                                                        style={{
                                                            fontSize: "0.75rem",
                                                            color: "#999999",
                                                            margin: "0",
                                                            lineHeight: "1.3",
                                                            textAlign: "left",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            fontSize: "15px",
                                                            wordWrap: "break-word", 
                                                            overflowWrap: "break-word",
                                                            whiteSpace: "normal", 
                                                            maxHeight: "calc(100% - 50px)",
                                                            paddingRight: "5px", 
                                                        }}
                                                    >
                                                        {severityDescriptions[severity]}
                                                    </p>
                                                </OverlayTrigger>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Col>
        </>
    );
}





