import React from "react";
import { Col, Row, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'react-toastify/dist/ReactToastify.css';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const TopListeners = () => {
    const [loading, setLoading] = useState(false);
    const [ListenersDetails, setListenersDetails] = useState([
        {
            id: 1,
            event_name: 'Asset 1',
            ip: '192.168.1.1',
            host: 'Host A',
            severity: 3,
            timestamp: '2025-02-20T10:30:00Z',
            bytesTransmission: '850MB',
            bytesReceiving: '680MB',
          },
          {
            id: 2,
            event_name: 'Asset 2',
            ip: '192.168.1.2',
            host: 'Host B',
            severity: 2,
            timestamp: '2025-02-21T14:00:00Z',
            bytesTransmission: '277MB',
            bytesReceiving: '180MB',
          },
          {
            id: 3,
            event_name: 'Asset 3',
            ip: '192.168.1.3',
            host: 'Host C',
            severity: 1,
            timestamp: '2025-02-21T16:00:00Z',
            bytesTransmission: '250MB',
            bytesReceiving: '180MB',
          },
    ]);
    const [eventsearchQuery, setEventSearchQuery] = useState('');

    const filteredListenersDetails = ListenersDetails.filter((event) =>
      event.host?.toLowerCase().includes(eventsearchQuery.toLowerCase()) ||
      event.event_name?.toLowerCase().includes(eventsearchQuery.toLowerCase()) ||
      event.ip?.toString().includes(eventsearchQuery)
    );



    return (
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
                {/* Header with Search Bar */}
                <Row className="align-items-center mb-3">
                    <Col xs={12} md={6}>
                        <h5 className="fw m-0">Top 10 assets Listeners(download)</h5>
                    </Col>
                    <Col xs={12} md={6} className="d-flex justify-content-md-end mt-2 mt-md-0">
                        <div className="position-relative " style={{ width: "100%", maxWidth: "250px" }}>
                            <Form.Control
                                type="text"
                                placeholder="Search assets..."
                                className="form-control-sm"
                                value={eventsearchQuery}
                                onChange={(e) => setEventSearchQuery(e.target.value)}
                                style={{ borderRadius: "5px", paddingLeft: "35px" }}
                            />
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="position-absolute"
                                style={{
                                    left: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#1E1E1E",
                                }}
                            />
                        </div>
                    </Col>
                </Row>

                {/* Sticky Table Header */}
                <div className="sticky-top bg-light text-dark p-2 rounded-top" style={{ zIndex: 2, top: 0 }}>
                    <Row className="fw-bold text-center align-items-center gx-1">
                        <Col xs={12} sm={4} md={2} className="py-1">Asset</Col>
                        <Col xs={6} sm={2} md={2} className="py-1">IP</Col>
                        <Col xs={6} sm={2} md={2} className="py-1">Host</Col>
                        <Col xs={12} sm={4} md={3} className="py-1">Bytes Transmission</Col>
                        <Col xs={12} sm={4} md={3} className="py-1">Bytes Receiving</Col>
                    </Row>
                </div>

                {loading && (
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                <div className="table-container" style={{
                    overflowY: "auto",
                    overflowX: "auto",
                    height: "calc(100% - 120px)",
                    backgroundColor: "white",
                    borderRadius: "0 0 10px 10px",
                }}>
                    {Array.isArray(filteredListenersDetails) && filteredListenersDetails.length > 0 ? (
                        filteredListenersDetails.map((events, index) => (
                            <Row
                                key={index}
                                className="text-center align-items-center"
                                style={{
                                    margin: 0,
                                    borderBottom: "1px solid #F6F6F6",
                                    // cursor: "pointer",
                                    transition: "background-color 0.2s",
                                }}
                             
                            >
                                <Col xs={12} sm={4} md={2} className="py-1 text-truncate">
                                    {events.event_name}
                                </Col>
                                <Col xs={6} sm={2} md={2} className="py-1">{events.ip || "N/A"}</Col>
                                <Col xs={6} sm={2} md={2} className="py-1">  {events.host||'N/A'} </Col>
                                <Col xs={12} sm={4} md={3} className="py-1">{events.bytesTransmission || "N/A"}</Col>
                                <Col xs={12} sm={4} md={3} className="py-1">{events.bytesReceiving}</Col>
                            </Row>
                        ))
                    ) : (
                        <p className="text-center mt-2 text-muted">No listeners found.</p>
                    )}
                </div>
            </div>
        </Col>
    )
}

export default TopListeners;