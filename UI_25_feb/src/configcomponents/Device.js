import React, { useState, useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import { ADDDEVICE, SBC_DROPDOWN } from '@/utilities/api';
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
export default function Device({ activeTab, loader }) {
    const [token, setToken] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [deviceDetails, setDeviceDetails] = useState([]);
    const [SBCList, setSBCList] = useState([]);
    const [editPopupOpen, seteditPopupOpen] = useState(false);
    const [editDeviceName, setEditDeviceName] = useState('');
    const [editDeviceType, setEditDeviceType] = useState('');
    const [editHostName, setEditHostName] = useState('');
    const [editCompany, setEditCompany] = useState('');
    const [editDeviceIP, setEditDeviceIP] = useState('');
    const [editTags, setEditTags] = useState('');
    const [editNetworkEnabled, setEditNetworkEnabled] = useState(false);
    const [editHopByHop, setEditHopByHop] = useState(false);
    const [editChangeDetection, setEditChangeDetection] = useState(false);
    const [editSBC, setEditSBC] = useState('');
    const [editID, seteditID] = useState('');
    const [editClasstags, setEditClasstags] = useState('');
    const [editTargettags, setEditTargettags] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [devices, setDevices] = useState(deviceDetails);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState('');
    const [previousPage, setPreviousPage] = useState('');
    const [deviceSearch, setDeviceSearch] = useState('');
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
        if (storedToken) {
            setToken(storedToken);
        }
        fetchDevicedetails(1, pageSize, storedToken);
    }, [pageSize, token]);
    const fetchDevicedetails = async (page = 1, size = 5, storedToken) => {
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
        for (let i = 5; i <= totalCount; i += increment) {
            sizes.push(i);
        }
        if (!sizes.includes(totalCount)) {
            sizes.push(totalCount);
        }
        return sizes;
    };
    const handleDelete = async (id) => {
        setLoading(true)
        const storedToken = localStorage.getItem('token');
        try {
            const url = `http://172.30.129.145:8000/api/hosts/${id}/`;
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            if (response.status === 204) {
                notify('Record deleted successfully', 'sucess')
            }
            fetchDevicedetails(1, pageSize, storedToken);
        }
        catch {
            notify('Failed to delete the record', 'error')
        } finally {
            setLoading(false);
        }
    }
    const EditPopupOpen = async (id) => {
        setLoading(true);
        setShowModal(true);
        const storedToken = localStorage.getItem('token');
        try {
            const url = `http://172.30.129.145:8000/api/hosts/${id}/`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            const device = response.data;
            setEditDeviceName(device.name);
            setEditDeviceType(device.device_type);
            setEditHostName(device.hostname);
            setEditCompany(device.company);
            setEditDeviceIP(device.ip_address);
            setEditTags(device.tags.data);
            setEditNetworkEnabled(device.network_enabled);
            setEditHopByHop(device.hop_by_hop_enabled);
            setEditChangeDetection(device.change_detection_enabled);
            setEditSBC(device.sbc.name);
            seteditID(device.id);
            setEditClasstags(device.tags.class)
            setEditTargettags(device.tags.target)
            setLatitude(device.latitude)
            setLongitude(device.longitude)
        } catch (error) {
            console.error('Error fetching device details:', error);
        } finally {
            setLoading(false);
        }
    };
    const EditPopupClose = () => {
        setLoading(false);
        setEditDeviceName("");
        setEditDeviceType("");
        setEditHostName("");
        setEditCompany("");
        setEditDeviceIP("");
        setEditTags("");
        setEditNetworkEnabled("");
        setEditHopByHop("");
        setEditChangeDetection("");
        setEditSBC("");
        setEditClasstags("");
        setEditTargettags("");
        setLatitude('');
        setLongitude('');
        seteditPopupOpen(false);
    }
    const handleUpdate = async () => {
        setLoading(true)
        const storedToken = localStorage.getItem('token');
        const id = editID;
        const payload = {
            name: editDeviceName,
            ip_address: editDeviceIP,
            hostname: editHostName,
            device_type: editDeviceType,
            company: editCompany,
            sbc: {
                name:editSBC
            },
            tags: {
                class: editClasstags,
                target: editTargettags
            },
            network_enabled: editNetworkEnabled,
            change_detection_enabled: editChangeDetection,
            hop_by_hop_enabled: editHopByHop,
            status: true,
        };
        try {
            const url = `http://172.30.129.145:8000/api/hosts/${id}/`;
            const response = await axios.put(url, payload, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            notify('device updated successfully', 'sucess')
            setShowModal(false);
            fetchDevicedetails(1, pageSize, storedToken);
            EditPopupClose();
        } catch (error) {
            notify('Failed to update Device details', 'error')
            console.error('Error updating device:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (deviceId, currentStatus) => {
        setLoading(true)
        const storedToken = localStorage.getItem('token');
        const payload = {
            status: !currentStatus
        }
        try {
            const url = `http://172.30.129.145:8000/api/hosts/${deviceId}/`;
            const response = await axios.put(url, payload, {

                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            if (response.status === 200) {
                notify('Status updated successfully', 'sucess')
                setDevices(devices.map(device =>
                    device.id === deviceId ? { ...device, status: !currentStatus } : device
                ));
                fetchDevicedetails(1, pageSize, storedToken);
            }
        } catch (error) {
            notify('error while updating the status', 'error')
            console.error("Failed to update status:", error);
        } finally {
            setLoading(false);
        }
    };
    const FetchSBClist = async () => {
        setLoading(true)
        const storedToken = localStorage.getItem('token');
        try {
            const response = await axios.get(SBC_DROPDOWN, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            if (response.status === 200) {
                const sbclist = response.data.map(item => ({ id: item.id, name: item.name }));
                setSBCList(sbclist)
            }
        }
        catch {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
            const storedToken = localStorage.getItem('token');
            fetchDevicedetails(1, pageSize, storedToken);
        }, [loader])
    return (
        <>
            {(editPopupOpen) && <Backdrop />}
            {activeTab === 'addDevice' && (
                <div className="section Device">
                    <Row>
                        <Row className="align-items-center mb-3 mt-3">
                            <Col xs={12} md={6}>
                                <h5 className="fw-bold m-0">Device List</h5>
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
                                <Col xs={12} sm={4} md={1} className="py-1">Name</Col>
                                <Col xs={6} sm={2} md={1} className="py-1">Host Name</Col>
                                <Col xs={6} sm={3} md={2} className="py-1">IP Address</Col>
                                <Col xs={6} sm={2} md={2} className="py-1">MAC</Col>
                                <Col xs={6} sm={2} md={1} className="py-1">Device Type</Col>
                                <Col xs={6} sm={2} md={3} className="py-1">Tags</Col>
                                <Col xs={6} sm={2} md={1} className="py-1">Status</Col>
                                <Col xs={12} sm={3} md={1} className="py-1">Actions</Col>
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
                                            transition: "background-color 0.2s"
                                        }}>
                                        <Col xs={12} sm={4} md={1} className="py-1">{device.name}</Col>
                                        <Col xs={6} sm={2} md={1} className="py-1">{device.hostname}</Col>
                                        <Col xs={6} sm={3} md={2} className="py-1">{device.ip_address}</Col>
                                        <Col xs={6} sm={2} md={2} className="py-1">MAC Address</Col>
                                        <Col xs={6} sm={2} md={1} className="py-1">{device.device_type}</Col>
                                        <Col xs={6} sm={4} md={3} className="py-1">
                                            {device.tags && (device.tags.target || device.tags.class) ? (
                                                <>
                                                    {device.tags.class && (
                                                        <span className="badge p-2 me-2 mb-2" style={{ backgroundColor: '#EAEAEA', color: '#000000' }}>
                                                            <strong>Class:</strong> {device.tags.class}
                                                        </span>
                                                    )}
                                                    {device.tags.target && (
                                                        <span className="badge p-2 me-2 mb-2" style={{ backgroundColor: '#EAEAEA', color: '#000000' }}>
                                                            <strong>Target:</strong> {device.tags.target}
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                'No Tags'
                                            )}
                                        </Col>
                                        <Col xs={6} sm={2} md={1} className="py-1"><a href="#"
                                            style={{ color: device.status ? "#16a34a" : "#dc2626" }}
                                            className="cursor-pointer hover:underline"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleStatus(device.id, device.status);
                                            }}
                                        >
                                            {device.status ? "Enabled" : "Disabled"}
                                        </a></Col>
                                        <Col xs={12} sm={3} md={1}><button
                                            className="btn btn-sm ms-2"
                                            onClick={()=> EditPopupOpen(device.id)}
                                        >
                                            <img src="/Edit Icon.png" />
                                        </button>
                                            <button className="btn  btn-sm ms-2" onClick={() => handleDelete(device.id)}>
                                                <img src="/Delete Icon.png" />
                                            </button></Col>
                                    </Row>
                                ))
                            ) : (
                                <p className="text-center mt-2 text-muted">No Device found.</p>
                            )}
                        </div>
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
                    </Row >
                </div >
            )}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                    <Modal.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="modal-title">Edit Device Configuration</h5>
                            <Button variant="light" className="border-0 p-2" onClick={() => setShowModal(false)}>
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
                                            value={editDeviceName}
                                            onChange={(e) => setEditDeviceName(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Label>Device Type:</Form.Label>
                                        <Form.Select
                                            value={editDeviceType}
                                            onChange={setEditDeviceType}
                                        >
                                            <option value="">Select Type</option>
                                            <option value="switch">Switch</option>
                                            <option value="url">URL</option>
                                            <option value="laptop">Laptop</option>
                                        </Form.Select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <Form.Label>Select SBC</Form.Label>
                                        <Form.Select
                                            value={editSBC}
                                            onChange={setEditSBC}
                                            onClick={FetchSBClist}
                                        >
                                            <option value="">Select SBC</option>
                                            {SBCList.map((sbclist, index) => (
                                                <option key={index} value={sbclist.id}>
                                                    {sbclist.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Label>Device Make</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editCompany}
                                            onChange={(e) => setEditCompany(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <Form.Label>Host Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editHostName}
                                            onChange={(e) => setEditHostName(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Label>IP Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editDeviceIP}
                                            onChange={(e) => setEditDeviceIP(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {editDeviceType !== 'url' ? (
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <Form.Label>Latitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={latitude}
                                                onChange={(e) => setLatitude(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Label>Longitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={longitude}
                                                onChange={(e) => setLongitude(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <Form.Label>Tags</Form.Label>
                                        <div className="row mb-1">
                                            <div className="col-md-6">
                                                <Form.Select
                                                    value={editClasstags}
                                                    onChange={(e) => setEditClasstags(e.target.value)}
                                                >
                                                    <option value="">Select Class</option>
                                                    <option value="Network Devices">Network Devices</option>
                                                    <option value="Operating System"> Operating System</option>
                                                    <option value="Server Hardware">Server Hardware</option>
                                                    <option value="OT/IOT">  OT/IOT</option>
                                                </Form.Select>
                                            </div>
                                            <div className="col-md-6">
                                                <Form.Select
                                                    value={editTargettags}
                                                    onChange={(e) => setEditTargettags(e.target.value)}
                                                >
                                                    <option value="">Select Target</option>
                                                    <option value="SNMP">SNMP</option>
                                                    <option value="Agent"> Agent</option>
                                                    <option value="ICMP">ICMP</option>
                                                </Form.Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                    <div className="row mb-1">
                                    <div className="col-md-4">
                                            <Form.Label>Network</Form.Label>
                                            <Form.Check
                                                type="switch"
                                                id="networkToggle"
                                                checked={editNetworkEnabled}
                                                onChange={(e) =>setEditNetworkEnabled(e.target.checked)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Label>Change Detection</Form.Label>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                checked={editChangeDetection}
                                                onChange={(e) =>setEditChangeDetection(e.target.checked)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Label>Hop-by-Hop</Form.Label>
                                            <Form.Check
                                                type="switch"
                                                id="hopbyToggle"
                                                checked={editHopByHop}
                                                onChange={(e) =>setEditHopByHop(e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                    </div>
                                    </div>
                            </Form>
                        </div>
                        <div className="d-flex justify-content-end align-items-right mt-2">
                            <Button
                                style={{ backgroundColor: "#ff1100", borderColor: "#ff1100", color: "#fff", padding: "8px 16px", fontSize: "14px" }}
                                onClick={handleUpdate}
                            >
                                Update
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
        </>
    )
}