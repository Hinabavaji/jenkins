import Layout from "@/utilities/layout"
import { useState } from "react";
import { Container,Row,Card,Col,CardBody,FormGroup,Form } from "react-bootstrap";
const Alerts =()=>{
    const [AlertDetails,setAlertDetails]=useState([])
    return(
        <Layout>
            <Container fluid style={{ backgroundColor: "#FFFFFF" }}>
                <Row>
                    <Col className="mb-2">
                        <Card style={{ top: '20px', backgroundColor: "#FFFFFF", overflow: 'clip', boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)' }}>
                            <CardBody style={{ backgroundColor: "#FFFFFF" }}>
                                <Row className="align-items-center mb-3">
                                    <Col xs={12} md={6} className="d-flex align-items-center">
                                        <p className="p-2 mb-0 me-3" style={{ whiteSpace: 'nowrap' }}>
                                            Alerts:
                                        </p>
                                        <Form.Group className="d-flex">
                                            <Form.Check
                                                type="checkbox"
                                                label="Network Traffic"
                                                // checked={isWindows}
                                                // onChange={() => handleCheckboxChange("windows")}
                                                className="me-3"
                                            />
                                            <Form.Check
                                                type="checkbox"
                                                label="Trace Route"
                                                className="me-3"
                                            // checked={isLinux}
                                            // onChange={() => handleCheckboxChange("linux")}
                                            />
                                            <Form.Check
                                                type="checkbox"
                                                label="Change Detection"
                                            // checked={isLinux}
                                            // onChange={() => handleCheckboxChange("linux")}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="sticky-top bg-light text-dark p-2 rounded-top" style={{ zIndex: 2, top: 0 }}>
                                    <Row className="fw-bold text-center align-items-center gx-1">
                                        <Col xs={12} sm={4} md={2} className="py-1">Name</Col>
                                        <Col xs={6} sm={2} md={2} className="py-1">Severity</Col>
                                        <Col xs={6} sm={3} md={2} className="py-1">Device</Col>
                                        <Col xs={6} sm={2} md={1} className="py-1">Conditions</Col>
                                        <Col xs={6} sm={2} md={1} className="py-1"> Type</Col>
                                        <Col xs={6} sm={2} md={2} className="py-1">Fired Time</Col>
                                        <Col xs={6} sm={2} md={1} className="py-1">Resolved Time</Col>
                                    </Row>
                                </div>
                                <div className="table-container" style={{
                            overflowY: "auto",
                            overflowX: "auto",
                            height: "calc(100% - 120px)",
                            backgroundColor: "white",
                            borderRadius: "0 0 10px 10px",
                        }}>
                             {Array.isArray(AlertDetails) && AlertDetails.length > 0 ? (
                                                            AlertDetails.map((device, index) => (
                                                                <Row
                                                                    key={index}
                                                                    className="text-center align-items-center"
                                                                    style={{
                                                                        margin: 0,
                                                                        borderBottom: "1px solid #F6F6F6",
                                                                        transition: "background-color 0.2s"
                                                                    }}>
                                                                    <Col xs={12} sm={4} md={1} className="py-1">{device.name}</Col>
                                                                    <Col xs={6} sm={2} md={1} className="py-1">{device.hostname}</Col>
                                                                    <Col xs={6} sm={3} md={2} className="py-1">{device.ip_address}</Col>
                                                                    <Col xs={6} sm={2} md={2} className="py-1">MAC Address</Col>
                                                                    <Col xs={6} sm={2} md={1} className="py-1">{device.device_type}</Col>
                                                                    <Col xs={12} sm={3} md={1}><button
                                                                        className="btn btn-sm ms-2"
                                                                    >
                                                                        <img src="/Edit Icon.png" />
                                                                    </button>
                                                                        <button className="btn  btn-sm ms-2" 
                                                                       >
                                                                            <img src="/Delete Icon.png" />
                                                                        </button></Col>
                                                                </Row>
                                                            ))
                                                        ) : (
                                                            <p className="text-center mt-2 text-muted">No Alerts found.</p>
                                                        )}
                                                         {Array.isArray(AlertDetails) && AlertDetails.length > 0 ? (
                            <div className="d-flex justify-content-between align-items-center mt-5">
                                <div className="d-flex align-items-center">
                                    <label htmlFor="pageSize" className="me-2">
                                        Page Size:
                                    </label>
                                    <select
                                        id="pageSize"
                                        value={pageSize}
                                        onChange={(e) => {
                                            const newSize = parseInt(e.target.value);
                                            setPageSize(newSize);
                                            fetchDevicedetails(1, newSize, token);
                                        }}
                                    >
                                        {getPageSizes(totalCount).map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="d-flex align-items-center">
                                    <Button
                                        variant="dark"
                                        size="sm"
                                        onClick={() => fetchDevicedetails(currentPage - 1, pageSize, token)}
                                        disabled={currentPage <= 1 || loading}
                                        className="rounded-0 mx-4"
                                    >
                                        Previous
                                    </Button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                                        const pageNumber = Math.max(1, currentPage - 4) + idx;
                                        if (pageNumber > totalPages) return null;
                                        return (
                                            <Button
                                                key={idx}
                                                style={{ backgroundColor: "#ff1100", borderColor: "#ff1100" }}
                                                size="sm"
                                                className="mx-1"
                                                onClick={() =>
                                                    fetchDevicedetails(pageNumber, pageSize, token)
                                                }
                                            >
                                                {pageNumber}
                                            </Button>
                                        );
                                    })}
                                    <Button
                                        variant="dark"
                                        size="sm"
                                        onClick={() => fetchDevicedetails(currentPage + 1, pageSize, token)}
                                        disabled={currentPage >= totalPages || loading}
                                        className="rounded-0 mx-4"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        ) : (<></>)}
                                                    </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    )
}

export default Alerts;