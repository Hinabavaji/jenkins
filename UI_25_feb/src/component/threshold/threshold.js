import React, { useState, useEffect } from "react";
import Layout from "@/utilities/layout";
import { Container, Card, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { THRESHOLDUPDATE, THRESHOLDDLT, THRESHOLDLIST } from "@/utilities/api";
import axios from "axios";
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditThresholdModal from "./editthreshold";
import DeleteConfirmModal from "./clearthreshold";
import CreateThresholdModal from "./createthreshold";


const Threshold = () => {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [isWindows, setIsWindows] = useState(true);
    const [isLinux, setIsLinux] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [nextPage, setNextPage] = useState('');
    const [previousPage, setPreviousPage] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editRow, setEditRow] = useState(null);
    const [dltRow, setdltRow] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedParameterId, setSelectedParameterId] = useState(null);
    const [eventsearchQuery, seteventSearchQuery] = useState("");
    const [showCreateModal, setshowCraeteModal] = useState(false)


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
        fetchTableData("windows", 1, pageSize, storedToken);
    }, [pageSize, token]);

    const fetchTableData = async (osType, page = 1, size = 5, tokenToUse) => {
        const authToken = tokenToUse || token;
        if (!authToken) {
            console.error("Token is missing. Cannot fetch data.");
            return;
        }
        setLoading(true);
        const url = `${THRESHOLDLIST}?os_type=${osType}&page=${page}&page_size=${size}`;
        try {
            const response = await axios.get(
                url,
                {
                    headers: {
                        Authorization: `token ${authToken}`,
                    },
                }
            );
            const { count, next, previous } = response.data;
            const data = response.data.results?.data || [];
            setTableData(data || []);
            setTotalCount(count);
            setNextPage(next);
            setPreviousPage(previous);
            setCurrentPage(page);
            setTotalPages(Math.ceil(count / size));
        } catch (error) {
            console.error("Error fetching table data:", error.message);
            setTableData([]);
        } finally {
            setLoading(false);
        }
    };

    const getPageSizes = (totalCount) => {
        const sizes = [];
        const increment = 5;
        for (let i = increment; i <= totalCount; i += increment) {
            sizes.push(i);
        }
        if (!sizes.includes(totalCount) && totalCount > increment) {
            sizes.push(totalCount);
        }
        return sizes;

    };

    const handleCheckboxChange = (os) => {
        if (os === "windows") {
            setIsWindows(true);
            setIsLinux(false);
            fetchTableData("windows");
        } else {
            setIsWindows(false);
            setIsLinux(true);
            fetchTableData("linux");
        }
    };
    const openEditModal = (row) => {
        console.log('thresholddddd', row)
        setEditRow({
            ...row,
            threshold: row.threshold || row.value || row.threshold_value || "",
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!editRow) {
            console.error("No row selected for editing.");
            return;
        }
        const authToken = token || localStorage.getItem("token");
        if (!authToken) {
            console.error("No authentication token found.");
            return;
        }
        const osType = isWindows ? "windows" : isLinux ? "linux" : null;
        if (!osType) {
            console.error("No OS type selected.");
            return;
        }
        try {
            const updatedData = {
                os_type: osType,
                item_name: editRow.item_name,
                comparison_type: editRow.comparison_type,
                threshold: editRow.threshold,
                unit: editRow.unit
            };
            const response = await axios.put(
                `${THRESHOLDUPDATE}`,
                updatedData,
                {
                    headers: {
                        Authorization: `token ${authToken}`
                    }
                }
            );
            if (response.status === 200) {
                notify(response.data.message , 'success');
                fetchTableData(osType)
                setShowModal(false);
            } else {
                console.error("Error updating data:", response);
                notify(response.data, 'error');
            }
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };
    const handleModalInputChange = (field, value) => {
        setEditRow(prevRow => ({ ...prevRow, [field]: value }));
    };
    const openConfirmModal = (row) => {
        setdltRow({
            ...row,
            threshold: row.threshold || row.value || row.threshold_value || row.item_name || "",
        });
        setShowConfirmModal(true);
    };
    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setSelectedParameterId(null);
    };
    const handleDelete = async () => {
        const authToken = token || localStorage.getItem('token');
        if (!authToken) {
            console.error("No authentication token found.");
            return;
        }
        const osType = isWindows ? "windows" : isLinux ? "linux" : null;
        if (!osType) {
            console.error("No OS type selected.");
            return;
        }

        try {
            const dltdData = {
                os_type: osType,
                item_name: dltRow.item_name,

            };
            console.log('delete entered')
            console.log('dlttoken', authToken)
            console.log("Delete Request Data:", dltdData);
            const response = await axios.delete(
                `${THRESHOLDDLT}?os_type=${osType}&item_name=${dltRow.item_name}`, 
                {
                    headers: {
                        Authorization: `token ${authToken}`
                    },
                }
            );
            if (response.status === 200) {
                console.log(response)
                notify(response.data.message , 'success');
                fetchTableData(osType)
            } else {
                console.error("Failed to clear parameter values:", response);
            }
        } catch (error) {
            console.error("Error clearing parameter values:", error);
        }
    };
    const OpenCreateModal = () => {
        setshowCraeteModal(true)
    };
    const CloseCreateModal = () => {
        setshowCraeteModal(false)
    }

    return (
        <Layout>
             <ToastContainer autoClose={1000} />
            <Container fluid >
                <Card style={{ top: '20px', backgroundColor: "#FFFFFF", boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)' }}
                >
                    <Card.Body style={{ backgroundColor: "white" }}>
                        <Row >
                            <div className="section">
                                <Row>
                                    <Col xs={12} md={6}>
                                        <h5 className="fw m-0 mb-2">Configure Threshold</h5>
                                    </Col>
                                    <Col xs={12} md={6} className="d-flex justify-content-end">
                                        <Button variant="" className="ms-auto" size="md" style={{ width: '150px', backgroundColor: '#FF1100', color: '#FFFFFF' }} onClick={OpenCreateModal}> Create</Button>
                                    </Col>
                                </Row>
                            </div>
                            <Col md={12} style={{
                                height: "70vh",
                                backgroundColor: "#FFFFFF",
                                display: "flex",
                                flexDirection: "column",
                            }} >
                                {/* Header with Search Bar */}
                                <Row className="align-items-center mb-3">
                                    <Col xs={12} md={6} className="d-flex align-items-center">
                                        <p className="p-2 mb-0 me-3" style={{ whiteSpace: 'nowrap' }}>
                                            Select operating system:
                                        </p>
                                        <Form.Group className="d-flex">
                                            <Form.Check
                                                type="checkbox"
                                                label="Windows"
                                                checked={isWindows}
                                                onChange={() => handleCheckboxChange("windows")}
                                                className="me-3"
                                            />
                                            <Form.Check
                                                type="checkbox"
                                                label="Linux"
                                                checked={isLinux}
                                                onChange={() => handleCheckboxChange("linux")}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="d-flex justify-content-md-end mt-2 mt-md-0">
                                        <div className="position-relative" style={{ width: "100%", maxWidth: "250px" }}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search events..."
                                                className="form-control-sm"
                                                value={eventsearchQuery}
                                                onChange={(e) => seteventSearchQuery(e.target.value)}
                                                style={{
                                                    borderRadius: "5px", paddingLeft: "40px",
                                                    position: "relative",
                                                    zIndex: 1
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                icon={faSearch}
                                                className="position-absolute"
                                                style={{
                                                    left: "10px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    color: "#1E1E1E",
                                                    zIndex: 3,
                                                    backgroundColor: "white",
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Row>

                                {/* Sticky Table Header */}
                                <div className="sticky-top bg-light text-dark p-2 rounded-top" style={{ zIndex: 2, top: 0 }}>
                                    <Row className="text-center align-items-center gx-1">
                                        <Col xs={6} sm={4} md={2} className="py-1">Name</Col>
                                        <Col xs={6} sm={3} md={2} className="py-1"> Threshold Unit</Col>
                                        <Col xs={6} sm={3} md={2} className="py-1"> Threshold Value</Col>
                                        <Col xs={6} sm={3} md={2} className="py-1">Comparison type</Col>
                                        <Col xs={6} sm={3} md={3} className="py-1">Critical Threshold</Col>
                                        <Col xs={6} sm={3} md={1} className="py-1">Actions</Col>
                                    </Row>
                                </div>

                                {loading && (
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                <div style={{
                                    overflowY: "auto",
                                    overflowX: "auto",
                                    height: "calc(100% - 120px)",
                                    backgroundColor: "white",
                                    borderRadius: "0 0 10px 10px",
                                }}>
                                    {Array.isArray(tableData) && tableData.length > 0 ? (
                                        tableData.map((events, index) => (
                                            <Row
                                                key={index}
                                                className="text-center align-items-center"
                                                style={{
                                                    margin: 0,
                                                    borderBottom: "1px solid #F6F6F6",
                                                    cursor: "pointer",
                                                    transition: "background-color 0.2s",
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E9ECEF")}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                            >
                                                <Col xs={6} sm={4} md={2} className="py-1">{events.item_name || "N/A"}</Col>
                                                <Col xs={6} sm={3} md={2} className="py-1">{events.unit || "N/A"}</Col>
                                                <Col xs={6} sm={3} md={2} className="py-1">{events.threshold_value || "N/A"}</Col>
                                                <Col xs={6} sm={3} md={2} className="py-1">{events.comparison_type || "N/A"}</Col>
                                                <Col xs={6} sm={3} md={3} className="py-1">{events.has_threshold ? 'true' : 'false' || "N/A"}</Col>
                                                <Col xs={6} sm={3} md={1} className="py-1 d-flex justify-content-center">
                                                    <Button variant="" size="sm" onClick={() => openEditModal(events)} className="me-2">
                                                        <img src="/Edit Icon.png" />
                                                    </Button>
                                                    <Button variant="" size="sm" onClick={() => openConfirmModal(events)}>
                                                        <img src="/Delete Icon.png" />
                                                    </Button>
                                                </Col>
                                            </Row>
                                        ))
                                    ) : (
                                        <p className="text-center mt-2 text-muted">No data found.</p>
                                    )}
                                </div>
                                {Array.isArray(tableData) && tableData.length > 0 ? (
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
                                                    fetchTableData(isWindows ? "windows" : "linux", 1, newSize, token);
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
                                                onClick={() => fetchTableData(isWindows ? "windows" : "linux", currentPage - 1, pageSize, token)}
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
                                                        onClick={() => fetchTableData(isWindows ? "windows" : "linux", pageNumber, pageSize, token)}
                                                    >
                                                        {pageNumber}
                                                    </Button>
                                                );
                                            })}
                                            <Button
                                                variant="dark"
                                                size="sm"
                                                onClick={() => fetchTableData(isWindows ? "windows" : "linux", currentPage + 1, pageSize, token)}
                                                disabled={currentPage >= totalPages || loading}
                                                className="rounded-0 mx-4"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                ) : (<></>)}
                            </Col>

                        </Row>
                    </Card.Body>
                </Card>

                <EditThresholdModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    editRow={editRow}
                    handleModalInputChange={handleModalInputChange}
                    handleSave={handleSave}
                />
                <DeleteConfirmModal
                    show={showConfirmModal}
                    onClose={closeConfirmModal}
                    dltRow={dltRow}
                    onConfirm={() => {
                        handleDelete(selectedParameterId);
                        closeConfirmModal();
                       
                    }}
                />

                <CreateThresholdModal
                    show={showCreateModal}
                    handleClose={CloseCreateModal}
                />


            </Container>
        </Layout>
    );
};

export default Threshold;


