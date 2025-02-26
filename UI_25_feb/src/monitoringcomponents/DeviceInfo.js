import React, { useState, useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import { ADDDEVICE } from '@/utilities/api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import { useRouter } from "next/router";
export default function DeviceInfo() {
    const [token, setToken] = useState('');
    const [deviceSearch, setDeviceSearch] = useState('');
    const [deviceDetails, setDeviceDetails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState('');
    const [previousPage, setPreviousPage] = useState('');
       const router = useRouter();
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
        fetchDevicedetails(1, pageSize, storedToken);
    }, [pageSize, token]);
    const fetchDevicedetails = async (page = 1, size = 10, storedToken) => {
        setLoading(true);
        const url = `${ADDDEVICE}?page=${page}&page_size=${size}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            if (response.status === 200) {
                const { results, count, next, previous } = response.data;
                setDeviceDetails(results || []);
                setTotalCount(count);
                setNextPage(next);
                setPreviousPage(previous);
                setCurrentPage(page);
                setTotalPages(Math.ceil(count / size));
            }
        } catch (error) {
            console.error("Error fetching device details:", error);
            setDeviceDetails([]);
        } finally {
            setLoading(false);
        }
    };
    const getPageSizes = (totalCount) => {
        const sizes = [];
        const increment = 5;
        for (let i = 10; i <= totalCount; i += increment) {
            sizes.push(i);
        }
        if (!sizes.includes(totalCount)) {
            sizes.push(totalCount);
        }
        return sizes;
    };
    const handleRowClick = (id) => {
        localStorage.setItem('id', id);
        router.push(`monitoring/${id}`)
    }
    return (
        <>
            <div className="section Device">
                <Row>
                    <Row className="align-items-center mb-3 mt-3">
                        <Col xs={12} md={6}>
                            <h5 className="fw-bold m-0">Monitor Assets</h5>
                        </Col>
                        <Col xs={12} md={6} className="d-flex justify-content-md-end mt-2 mt-md-0">
                            <div className="position-relative " style={{ width: "100%", maxWidth: "250px" }}>
                                <Form.Control
                                    type="text"
                                    placeholder="Search Device..."
                                    className="form-control-sm"
                                    value={deviceSearch}
                                    onChange={(e) => setDeviceSearch(e.target.value)}
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
                            <Col xs={12} sm={4} md={2} className="py-1">Name</Col>
                            <Col xs={6} sm={2} md={2} className="py-1">Host Name</Col>
                            <Col xs={6} sm={3} md={2} className="py-1">IP Address</Col>
                            <Col xs={6} sm={2} md={3} className="py-1">MAC</Col>
                            <Col xs={6} sm={2} md={1} className="py-1">Device Type</Col>
                            <Col xs={6} sm={2} md={2} className="py-1">Status</Col>
                        </Row>
                    </div>
                    <div className="table-container" style={{
                        overflowY: "auto",
                        overflowX: "auto",
                        height: "calc(100% - 120px)",
                        backgroundColor: "white",
                        borderRadius: "0 0 10px 10px",
                    }}>
                        {Array.isArray(deviceDetails) && deviceDetails.length > 0 ? (
                            deviceDetails.map((device, index) => (
                                <Row
                                    key={index}
                                    className="text-center align-items-center"
                                    style={{
                                        margin: 0,
                                        borderBottom: "1px solid #F6F6F6",
                                        transition: "background-color 0.2s",
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleRowClick(device.id)}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor = '#E9ECEF')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor = 'transparent')
                                    } 
                                    >
                                    <Col xs={12} sm={4} md={2} className="py-1">{device.name}</Col>
                                    <Col xs={6} sm={2} md={2} className="py-1">{device.hostname}</Col>
                                    <Col xs={6} sm={3} md={2} className="py-1">{device.ip_address}</Col>
                                    <Col xs={6} sm={2} md={3} className="py-1">MAC Address</Col>
                                    <Col xs={6} sm={2} md={1} className="py-1">{device.device_type}</Col>
                                    <Col xs={6} sm={2} md={2} className="py-1"><span
                                        style={{ color: device.status ? "#16a34a" : "#dc2626" }}
                                    >
                                        {device.status ? "Active" : "Inactive"}
                                    </span></Col>
                                </Row>
                            ))
                        ) : (
                            <p className="text-center mt-2 text-muted">No Assets found.</p>
                        )}
                        {Array.isArray(deviceDetails) && deviceDetails.length > 0 ? (
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
                                    {Array.from({ length: Math.min(10, totalPages) }, (_, idx) => {
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
                </Row >
            </div >
        </>
    )
}