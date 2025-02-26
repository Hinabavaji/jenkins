import React from "react";
import Layout from "@/utilities/layout";
import { Container, Card, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import PermissionModal from "./addUser";

const UserTable = () => {
    const [loading, setLoading] = useState(false);
    const [UserDetails, setUserDetails] = useState([
        { Name: "John Doe", Username: "johndoe", email: "johndoe@example.com", role: "Admin", group: "Group 1", status: "Active", severity: 1 },
        { Name: "Jane Smith", Username: "janesmith", email: "janesmith@example.com", role: "User", group: "Group 2", status: "Inactive", severity: 3 },
        { Name: "Michael Brown", Username: "michaelbrown", email: "michaelbrown@example.com", role: "Manager", group: "Group 3", status: "Active", severity: 2 },
        { Name: "Emily Davis", Username: "emilydavis", email: "emilydavis@example.com", role: "Admin", group: "Group 1", status: "Inactive", severity: 4 },
        { Name: "Sarah Wilson", Username: "sarahwilson", email: "sarahwilson@example.com", role: "User", group: "Group 4", status: "Active", severity: 5 },
    ]);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [eventsearchQuery, setEventSearchQuery] = useState('');
  
      const filteredUsersDetails = UserDetails.filter((event) =>
          event.Name?.toLowerCase().includes(eventsearchQuery.toLowerCase()) ||
          event.email?.toLowerCase().includes(eventsearchQuery.toLowerCase()) ||
          event.role?.toLowerCase().includes(eventsearchQuery.toLowerCase()) ||
          event.group?.toString().includes(eventsearchQuery.toLowerCase()) ||
          event.status?.toString().includes(eventsearchQuery)
      );
 

    const handlePermissionButtonClick = () => {
        setShowPermissionModal(true); 
    };

    const handleClosePermissionModal = () => {
        setShowPermissionModal(false); 
    };
    return (
        <Layout>
            <div className="d-flex justify-content-end ms-1" style={{ right: '40px', zIndex: 2, marginBottom: '12px',left:'auto' }}>
                <Button variant="" size="md" className="me-3 py-1" style={{ width:'130px',backgroundColor: '#FF1100', color: '#ffffff' }} onClick={handlePermissionButtonClick}>
                    + User
                </Button>
            </div>

            <Container fluid style={{ backgroundColor: "", overflow: "hidden" }}>
                <Card style={{  backgroundColor: "#FFFFFF", overflow: 'clip', boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)' }}
                >
                    <Card.Body style={{ backgroundColor: "white" }}>
                        <Row className="align-items-center mb-3">
                            <Col xs={12} md={6}>
                                <h5 className="fw m-0">Users</h5>
                            </Col>
                            <Col xs={12} md={6} className="d-flex justify-content-md-end mt-2 mt-md-0">
                                <div className="position-relative" style={{ width: "100%", maxWidth: "250px" }}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search users..."
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
                        <div className="sticky-top bg-light text-dark p-2 rounded-top" style={{ zIndex: 2, top: 0 }}>
                            <Row className="fw-bold text-center align-items-center gx-1">
                                <Col xs={3} sm={3} md={2} className="py-1">Name</Col>
                                <Col xs={3} sm={3} md={2} className="py-1">User name</Col>
                                <Col xs={3} sm={3} md={2} className="py-1">Email</Col>
                                <Col xs={3} sm={3} md={2} className="py-1">Role</Col>
                                <Col xs={3} sm={3} md={2} className="py-1">Group</Col>
                                <Col xs={3} sm={3} md={2} className="py-1">Status</Col>
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
                            {Array.isArray(filteredUsersDetails) && filteredUsersDetails.length > 0 ? (
                                filteredUsersDetails.map((events, index) => (
                                    <Row
                                        key={index}
                                        className="text-center align-items-center"
                                        style={{
                                            margin: 0,
                                            borderBottom: "1px solid #F6F6F6",
                                            cursor: "pointer",
                                            transition: "background-color 0.2s",
                                            
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.backgroundColor = "#E9ECEF")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.backgroundColor = "transparent")
                                        }
                                    >
                                        <Col xs={3} sm={3} md={2} className="py-1 text-truncate">
                                            {events.Name}
                                        </Col>
                                        <Col xs={3} sm={3} md={2} className="py-1">{events.Username || "N/A"}</Col>
                                        <Col xs={3} sm={3} md={2} className="py-1">
                                        {events.email || "N/A"}
                                        </Col>
                                        <Col xs={3} sm={3} md={2} className="py-1">{events.role || "N/A"}</Col>
                                        <Col xs={3} sm={3} md={2} className="py-1">{events.group}</Col>
                                        <Col xs={3} sm={3} md={2} className="py-1">{events.status} </Col>
                                    </Row>
                                ))
                            ) : (
                                <p className="text-center mt-2 text-muted">No users found.</p>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </Container>

            <PermissionModal
                show={showPermissionModal}
                handleClose={handleClosePermissionModal}
            />
        </Layout>


    )
}

export default UserTable