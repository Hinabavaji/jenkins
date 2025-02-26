import React, { useState, useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import { SBCDETAILS } from '@/utilities/api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { X } from "lucide-react";

const Backdrop = () => {
    return <div className="backdrop"></div>;
};
export default function SBC({ activeTab, loader }) {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [deviceDetails, setDeviceDetails] = useState([]);
    const [editsbcName, seteditSbcName] = useState('');
    const [devices, setDevices] = useState(deviceDetails);
    const [editSbcIP, seteditSbcIP] = useState('');
    const [editSbcHostName, SeteditSbcHostName] = useState('');
    const [editSbcDeviceType, SeteditSbcDeviceType] = useState('');
    const [editSbcFloor, SeteditSbcFloor] = useState('');
    const [editSbcDesc, SeteditSbcDesc] = useState('')
    const [editSbcID, seteditSbcID] = useState('');
    const [editSBCPopupOpen, seteditSBCPopupOpen] = useState(false);
    const [sbcDetails, setsbcDetails] = useState([]);
    const [currentPageSBC, setCurrentPageSBC] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [pageSizeSBC, setPageSizeSBC] = useState(5);
    const [totalPagesSBC, setTotalPagesSBC] = useState(1);
    const [totalCountSBC, setTotalCountSBC] = useState(0);
    const [nextPageSBC, setNextPageSBC] = useState(null);
    const [previousPageSBC, setPreviousPageSBC] = useState(null);
    const [sbcSearch, setSBCSearch] = useState('');

    const notify = (message, type) => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'info':
                toast.info(message);
                break;
            case 'warn':
                toast.warn(message);
                break;
            default:
                toast(message);
                break;
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        fetchSBCdetails(1, pageSize, storedToken);
    }, [loader])

    const fetchSBCdetails = async (page = 1, size = 5, storedToken) => {
        setLoading(true);
        const url = `${SBCDETAILS}?page=${page}&page_size=${size}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            if (response.status === 200) {
                const { results, count, next, previous } = response.data;
                setsbcDetails(results || []);
                setTotalCountSBC(count);
                setNextPageSBC(next);
                setPreviousPageSBC(previous);
                setCurrentPageSBC(page);
                setTotalPagesSBC(Math.ceil(count / size));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setsbcDetails([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatusSBC = async (deviceId, currentStatus) => {
        setLoading(true)
        const storedToken = localStorage.getItem('token');
        const payload = {
            status: !currentStatus
        }
        try {
            const url = `http://172.30.129.145:8000/api/sbcs/${deviceId}/`;
            const response = await axios.put(url, payload, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            if (response.status === 200) {
                notify('Status updated successfully', 'Success')
                setDevices(devices.map(device =>
                    device.id === deviceId ? { ...device, status: !currentStatus } : device
                ));
                fetchSBCdetails(1, pageSize, storedToken);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setLoading(false);
        }
    };
    const EditSBCPopupOpen = async (id) => {
        setLoading(true)
        const storedToken = localStorage.getItem('token');
        try {
            const url = `http://172.30.129.145:8000/api/sbcs/${id}/`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            const device = response.data;
            seteditSBCPopupOpen(true);
            seteditSbcName(device.name);
            seteditSbcIP(device.ip_address);
            SeteditSbcHostName(device.hostname);
            SeteditSbcDeviceType(device.device_type_and_version);
            SeteditSbcFloor(device.floor);
            SeteditSbcDesc(device.description);
            seteditSbcID(device.id)
        }
        catch (error) {
            console.error('Error fetching device details:', error);
        } finally {
            setLoading(false);
        }
    }
    const EditSBCPopupClose = () => {
        setLoading(false)
        seteditSBCPopupOpen(false)
        seteditSbcName("");
        seteditSbcIP("");
        SeteditSbcHostName("");
        SeteditSbcDeviceType("");
        SeteditSbcFloor("");
        SeteditSbcDesc("");
    }
    const handleSBCUpdate = async () => {
        setLoading(true)
        const storedToken = localStorage.getItem('token');
        const id = editSbcID;
        const payload = {
            name: editsbcName,
            ip_address: editSbcIP,
            hostname: editSbcHostName,
            device_type_and_version: editSbcDeviceType,
            floor: editSbcFloor,
            description: editSbcDesc,
        };
        try {
            const url = `http://172.30.129.145:8000/api/sbcs/${id}/`;
            const response = await axios.put(url, payload, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            notify('SBC details updated successfully', 'sucess')
            EditSBCPopupClose();
            fetchSBCdetails(1, pageSize, storedToken);
        } catch (error) {
            notify('Failed to update SBC details', 'error')
            console.error('Error updating device:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleSBCDelete = async (id) => {
        setLoading(true)
        const storedToken = localStorage.getItem('token');
        try {
            const url = `http://172.30.129.145:8000/api/sbcs/${id}/`;
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            if (response.status === 204) {
                notify('SBC deteted successfully', 'sucess')
            }
            fetchSBCdetails(1, pageSize, storedToken);
        }
        catch {
            notify('Failed to delete the record', 'error')
        } finally {
            setLoading(false);
        }
    }
    const getPageSizes = (totalCount) => {
        const sizes = [];
        const increment = 5;
        for (let i = 5; i <= totalCount; i += increment) {
            sizes.push(i);
        }
        if (!sizes.includes(totalCount)) {
            sizes.push(totalCount);
        }
        return sizes;
    };
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
        fetchSBCdetails(1, pageSize, storedToken);
    }, [pageSize])
    return (
        <>
            {(editSBCPopupOpen) && <Backdrop />}

            {activeTab === 'sbc' && (
                <div className="section SBC">
                    <Row>
                        <Row className="align-items-center mb-3 mt-3">
                            <Col xs={12} md={6}>
                                <h5 className="fw-bold m-0">SBC List</h5>
                            </Col>
                            <Col xs={12} md={6} className="d-flex justify-content-md-end mt-2 mt-md-0">
                                <div className="position-relative " style={{ width: "100%", maxWidth: "250px" }}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search SBC..."
                                        className="form-control-sm"
                                        value={sbcSearch}
                                        onChange={(e) => setSBCSearch(e.target.value)}
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
                                <Col xs={6} sm={2} md={1} className="py-1">Location</Col>
                                <Col xs={6} sm={2} md={3} className="py-1">Device Type</Col>
                                <Col xs={6} sm={2} md={1} className="py-1">Status</Col>
                                <Col xs={12} sm={3} md={1} className="py-1">Actions</Col>
                            </Row>
                        </div>
                        {/* {loading && (
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )} */}
                        <div className="table-container" style={{
                            overflowY: "auto",
                            overflowX: "auto",
                            height: "calc(100% - 120px)",
                            backgroundColor: "white",
                            borderRadius: "0 0 10px 10px",
                        }}>
                            {Array.isArray(sbcDetails) && sbcDetails.length > 0 ? (
                                sbcDetails.map((device, index) => (
                                    <Row
                                        key={index}
                                        className="text-center align-items-center"
                                        style={{
                                            margin: 0,
                                            borderBottom: "1px solid #F6F6F6",
                                            transition: "background-color 0.2s"
                                        }}>
                                        <Col xs={12} sm={4} md={2} className="py-1">{device.name}</Col>
                                        <Col xs={6} sm={2} md={2} className="py-1">{device.hostname}</Col>
                                        <Col xs={6} sm={3} md={2} className="py-1">{device.ip_address}</Col>
                                        <Col xs={6} sm={2} md={1} className="py-1">{device.floor}</Col>
                                        <Col xs={6} sm={2} md={3} className="py-1">{device.device_type_and_version}</Col>
                                        <Col xs={6} sm={2} md={1} className="py-1"><a href="#"
                                            style={{ color: device.status ? "#16a34a" : "#dc2626" }}
                                            className="cursor-pointer hover:underline"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleStatusSBC(device.id, device.status);
                                            }}
                                        >
                                            {device.status ? "Enabled" : "Disabled"}
                                        </a></Col>
                                        <Col xs={12} sm={3} md={1}><button
                                            className="btn btn-sm ms-2"
                                            onClick={() => EditSBCPopupOpen(device.id)}
                                        >
                                            <img src="/Edit Icon.png" />
                                        </button>
                                            <button className="btn  btn-sm ms-2" onClick={() => handleSBCDelete(device.id)}>
                                                <img src="/Delete Icon.png" />
                                            </button></Col>
                                    </Row>
                                ))
                            ) : (
                                <p className="text-center mt-2 text-muted">No SBC found.</p>
                            )}
                        </div>
                        {Array.isArray(sbcDetails) && sbcDetails.length > 0 ? (
                        <div className="d-flex justify-content-between align-items-center mt-5">
                                    <div className="d-flex align-items-center">
                                        <label htmlFor="pageSize" className="me-2">
                                            Page Size:
                                        </label>
                                        <select
                                            id="pageSize"
                                            value={pageSizeSBC}
                                            onChange={(e) => {
                                                const newSize = parseInt(e.target.value);
                                                setPageSizeSBC(newSize);
                                                fetchSBCdetails(1, newSize, token);
                                            }}
                                        >
                                            {getPageSizes(totalCountSBC).map((size) => (
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
                                            onClick={() => fetchSBCdetails(currentPageSBC - 1, pageSizeSBC, token)}
                                            disabled={currentPageSBC <= 1 || loading}
                                            className="rounded-0 mx-4"
                                        >
                                            Previous
                                        </Button>
                                        {Array.from({ length: Math.min(5, totalPagesSBC) }, (_, idx) => {
                                            const pageNumber = Math.max(1, currentPageSBC - 4) + idx;
                                            if (pageNumber > totalPagesSBC) return null;
                                            return (
                                                <Button
                                                    key={idx}
                                                    style={{backgroundColor:"#ff1100", borderColor: "#ff1100"}}
                                                    size="sm"
                                                    className="mx-1"
                                                    onClick={() =>
                                                        fetchSBCdetails(pageNumber, pageSizeSBC, token)
                                                    }
                                                >
                                                    {pageNumber}
                                                </Button>
                                            );
                                        })}
                                        <Button
                                            variant="dark"
                                            size="sm"
                                            onClick={() => fetchSBCdetails(currentPageSBC + 1, pageSizeSBC, token)}
                                            disabled={currentPageSBC >= totalPagesSBC || loading}
                                            className="rounded-0 mx-4"
                                        >
                                            Next
                                        </Button>
                                    </div> 
                                </div>
                                ):(<></>)}
                </Row >
                </div >
            )
            }
            {
                editSBCPopupOpen && (
                    <Modal show={editSBCPopupOpen} onHide={EditSBCPopupClose} centered size="lg">
                        <Modal.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="modal-title">Edit SBC</h5>
                                <Button variant="light" className="border-0 p-2" onClick={EditSBCPopupClose}>
                                    <X size={24} />
                                </Button>
                            </div>
                            <div className="p-4" style={{ backgroundColor: "#F8F8F8", borderRadius: "8px" }}>
                                <Form>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editsbcName}
                                                onChange={(e) => seteditSbcName(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Label>Model and Version</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editSbcDeviceType}
                                                onChange={(e) => SeteditSbcDeviceType(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <Form.Label>Host Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editSbcHostName}
                                                onChange={(e) => SeteditSbcHostName(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Label>Location (Floor)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editSbcFloor}
                                                onChange={(e) => SeteditSbcFloor(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <Form.Label>IP Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editSbcIP}
                                                onChange={(e) => seteditSbcIP(e.target.value)}
                                                placeholder="Enter IP address"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editSbcDesc}
                                                onChange={(e) => SeteditSbcDesc(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </Form>
                            </div>
                            <div className="d-flex justify-content-end align-items-right mt-2">
                                <Button
                                    style={{ backgroundColor: "#ff1100", borderColor: "#ff1100", color: "#fff", padding: "8px 16px", fontSize: "14px" }}
                                    onClick={handleSBCUpdate}
                                >
                                    Update
                                </Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                )
            }
        </>
    )
}