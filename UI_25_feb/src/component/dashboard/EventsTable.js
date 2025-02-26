import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { GETEVENTSDETAILS, GetEvents, UpdateProblem } from '@/utilities/api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Backdrop = () => {
    return <div className="backdrop"></div>;
};

export default function EventsTable({ token, refreshInterval }) {
    const [eventsearchQuery, seteventSearchQuery] = useState("");
    const [EventDetails, setEventDetails] = useState([]);
    const [alertdetailspopupopen, setalertdetailspopupopen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editEventsPopupOpen, seteditEventsPopupOpen] = useState(false);
    const [message, setmessage] = useState('')
    const [problemName, setproblemname] = useState('')
    // const [Acknowldge, setacknowldge] = useState(false)
    const [closeproblem, setcloseproblem] = useState(false)
    const [changeseverity, setchangeseverity] = useState(false)
    const [problemID, setproblemID] = useState('')
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [host, sethost] = useState('');
    const [trigger, setrigger] = useState('');
    const [severity, setseverity] = useState('');
    const [time, settime] = useState('');
    const [acknowledge, setacknowledge] = useState('');
    const [tags, settags] = useState([]);
    const [description, setdescription] = useState('');
    const [resolved, setresolved] = useState('');
    const [ackTime, setacktime] = useState('');
    const [pageSize, setPageSize] = useState(10); 
    const [totalPages, setTotalPages] = useState(1); 
    const [totalCount, setTotalCount] = useState(0); 

    useEffect(() => {
        if (!token) return;
        if (!token) {
            router.push(`/login`);
        }
        fetchEvents(1, pageSize, token);
        const interval = setInterval(() => {
            fetchEvents(1, pageSize, token);
        }, refreshInterval);
        return () => clearInterval(interval);
    }, [token, refreshInterval])

    const AlertDetailsPopupOpen = async (id) => {
        try {
            if (!id) return;
            const url = GetEvents(id);
            const response = await axios.get(url, {
                headers: {
                    Authorization: `token ${token}`,
                },
            });
            const alerts = response.data;
            sethost(alerts.event.host);
            setrigger(alerts.event.event_name);
            setseverity(alerts.event.severity);
            settime(alerts.event.timestamp);
            setresolved(alerts.event.resolved);
            settags(alerts.event.tags);
            
            if (Array.isArray(alerts.event.acknowledgment) && alerts.event.acknowledgment.length > 0) {
                const acknowledgment = alerts.event.acknowledgment[0];
                setacknowledge(acknowledgment.acknowledged_by || 'N/A');
                setdescription(acknowledgment.description || 'N/A');
                setacktime(acknowledgment.timestamp || 'N/A');
            } else {
                setacknowledge('No acknowledgment');
                setdescription('No acknowledgment description');
                setacktime('No acknowledgment time');
            }
            setalertdetailspopupopen(true);
            console.log('tags',tags)
            console.log('resolved',resolved)
        }
        catch (error) {
            console.error('Error fetching device details:', error);
        }
    }
    const fetchEvents = async (page = 1, size = 10, storedToken, searchQuery = '') => {
        setLoading(true);
        let url = `${GETEVENTSDETAILS}?page=${page}&page_size=${size}`;
        if (searchQuery.trim() !== '') {
            url += `&hostname=${encodeURIComponent(searchQuery.toUpperCase())}`;
        }
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });

            if (response.status === 200) {
                const data = response.data;
                setEventDetails(data.results.events || []);
                setTotalCount(data.count);
                setNextPage(data.next);
                setPreviousPage(data.previous);
                setCurrentPage(page);
                setTotalPages(Math.ceil(data.count / size));    
            }
            if (response.status === 401) {
                router.push(`/login`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleproblemUpdate = async () => {
        console.log('problem',closeproblem)
        const id = problemID;
        const payload = {
            description: message,
            resolve: closeproblem
        };
       
        try {
          //  const url = `http://172.30.129.145:8000/api/events/acknowledge/${id}/`;
          const url = UpdateProblem(id);
            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: `token ${token}`,

                },
            });
            notify('Problem updated successfully', 'sucess')
            EditPopupClose();
            fetchEvents(1, pageSize, token);
            clearModalData();
        } catch (error) {
            notify('Failed to update', 'error')
            console.error('Error updating device:', error);
            clearModalData();
        }
    };
    const clearModalData = () => {
        setmessage('')
        setchangeseverity('')
        setacknowldge('')
        setcloseproblem('')
    }
    const Alertdetailspopuclose = () => {
        setalertdetailspopupopen(false)
    }
    const EditPopupOpen = async (id) => {
        const storedToken = localStorage.getItem('token');
        try {
            const url = GetEvents(id);
            const response = await axios.get(url, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            const device = response.data;
            setproblemname(device.event.event_name)
            setproblemID(device.event.id)
            seteditEventsPopupOpen(true);
        }
        catch (error) {
            console.error('Error fetching device details:', error);
        }
    }
    const EditPopupClose = () => {
        seteditEventsPopupOpen(false)
    }


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
    const handleSearchChange = (e) => {
        const value = e.target.value;
        seteventSearchQuery(value);
        // fetchEvents(1, pageSize, token, value); 
    };
 
    
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchEvents(1, pageSize, token, eventsearchQuery);
        }, 1000); 
    
        return () => clearTimeout(handler); // Cleanup timeout on every key stroke
    }, [eventsearchQuery, pageSize, token]);
    
    
    return (
        <>
            {(alertdetailspopupopen) && <Backdrop />}
            {(editEventsPopupOpen) && <Backdrop />}
            <Col md={12} style={{ overflow: "hidden" }}>
                <div
                    className="border p-3 mb-3"
                    style={{
                        height: "60vh",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                        {/* Header with Search Bar */}
                        <Row className="align-items-center mb-3">
                            <Col xs={12} md={6}>
                                <h5 className="fw m-0">Events</h5>
                            </Col>
                            <Col xs={12} md={6} className="d-flex justify-content-md-end mt-2 mt-md-0">
                                <div className="position-relative "style={{ width: "100%", maxWidth: "250px" }}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search events..."
                                        className="form-control-sm"
                                        value={eventsearchQuery}
                                        // onChange={(e) => seteventSearchQuery(e.target.value)}
                                        onChange={handleSearchChange}
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
                                <Col xs={12} sm={4} md={2} className="py-1">Event Type</Col>
                                <Col xs={6} sm={2} md={1} className="py-1">IP</Col>
                                <Col xs={6} sm={3} md={2} className="py-1">Time</Col>
                                <Col xs={6} sm={2} md={1} className="py-1">Host</Col>
                                <Col xs={6} sm={2} md={1} className="py-1">Severity</Col>
                                <Col xs={12} sm={4} md={3} className="py-1">Tags</Col>
                                <Col xs={12} sm={3} md={1} className="py-1">Actions</Col>
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
                        {Array.isArray(EventDetails) && EventDetails.length > 0 ? (
                            EventDetails.map((events, index) => (
                                <Row
                                    key={index}
                                    className="text-center align-items-center"
                                    style={{
                                        margin: 0,
                                        borderBottom: "1px solid #F6F6F6",
                                        cursor: "pointer",
                                        transition: "background-color 0.2s",
                                        color: events.severity <= 1 ? "#FBC01D" :
                                            events.severity <= 3 ? "#2eb82e" :
                                                events.severity <= 5 ? "#FD5B5B" : "black",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor = "#E9ECEF")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor = "transparent")
                                    }
                                >
                                    <Col xs={12} sm={4} md={2} className="py-1 text-truncate" style={{color:'#2756AB'}} onClick={() => AlertDetailsPopupOpen(events.id)}>
                                        {events.event_name}
                                    </Col>
                                    <Col xs={6} sm={2} md={1} className="py-1">{events.ip || "N/A"}</Col>
                                    <Col xs={6} sm={3} md={2} className="py-1">
                                        {new Date(events.timestamp).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        })} - {new Date(events.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </Col>
                                    <Col xs={6} sm={2} md={1} className="py-1">{events.hostname || "N/A"}</Col>
                                    <Col xs={6} sm={2} md={1} className="py-1">{events.severity}</Col>
                                    <Col xs={12} sm={4} md={3} className="py-1">
                                        {Array.isArray(events.tags) && events.tags.length > 0 ? (
                                            <div className="d-flex flex-wrap">
                                                {events.tags.map((tag, idx) => (
                                                    <div key={idx} className="badge p-2 me-2 mb-2" style={{ backgroundColor: '#EAEAEA', color: '#000000' }}>
                                                        <strong>{tag.tag}:</strong> {tag.value}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : ("No Tags")}
                                    </Col>
                                    <Col xs={12} sm={3} md={1} className="py-1"  onClick={() => EditPopupOpen(events.id)}  disabled={events.resolved === true} style={{ textDecoration: 'none', color: '#2756AB', pointerEvents: events.resolved ? 'none' : 'auto' }} >
                                        {events.resolved ? "Updated" : "Update"}
                                    </Col>
                                </Row>
                                
                            ))
                        ) : (
                            <p className="text-center mt-2 text-muted">No events found.</p>
                        )}
                    </div>

                    <div className="pagination mt-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
                        {/* Page Size Dropdown */}
                        <div className="mb-2 mb-md-0">
                            <label htmlFor="pageSize" className="me-2">Page Size:</label>
                            <select
                                id="pageSize"
                                value={pageSize}
                                onChange={(e) => {
                                    const newSize = parseInt(e.target.value, 10);
                                    setPageSize(newSize);
                                    fetchEvents(1, newSize, token);
                                }} >
                                {getPageSizes(totalCount).map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                                
                            </select>
                        </div>

                        {/* Pagination Controls */}
                        <div className="d-flex flex-wrap justify-content-center">
                            <Button
                                variant="dark"
                                size="sm"
                                onClick={() => fetchEvents(currentPage - 1, pageSize, token)}
                                disabled={currentPage <= 1 || loading}
                                className="rounded-0 mx-1">
                                Previous
                            </Button>

                            {Array.from({ length: Math.min(10, totalPages) }, (_, idx) => {
                                const pageNumber = Math.max(1, currentPage - 4) + idx;
                                if (pageNumber > totalPages) return null;
                                return (
                                    <Button
                                         key={idx}
                                        style={{ backgroundColor: currentPage === pageNumber ? "#FF1100" : "transparent", borderColor: "#FF1100", color: currentPage === pageNumber ? "#FFFFFF" : "#FF1100" }}
                                        size="sm"
                                        className="mx-1"
                                        onClick={() => fetchEvents(pageNumber, pageSize, token)}
                                    >
                                        {pageNumber}
                                    </Button>
                                );
                            })}

                            <Button
                                variant="dark"
                                size="sm"
                                onClick={() => fetchEvents(currentPage + 1, pageSize, token)}
                                disabled={currentPage >= totalPages || loading}
                                className="rounded-0 mx-1"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </Col>

            {alertdetailspopupopen && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block", paddingTop: '20vh' }}>
                    <div className="modal-dialog" role="document" style={{ maxWidth: '700px' }}>
                        <div className="modal-content"  >
                            <div className="modal-header d-flex align-items-center justify-content-between" style={{ padding: "10px 20px" }}>
                                <h5 className="modal-title" style={{ margin: 0, fontSize: "18px" }}>Event details</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={Alertdetailspopuclose}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        fontSize: "24px",
                                        fontWeight: "bold",
                                        lineHeight: "1",
                                        cursor: "pointer",
                                        color: "black",
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <Row>
                                    <Col md={12} className="form-group d-flex align-items-center">
                                        <label
                                            htmlFor="problem"
                                            style={{
                                                width: "150px", 
                                                minWidth: "150px", 
                                                marginRight: "10px",
                                                color: "black",
                                            }}
                                        >
                                           Host:
                                        </label>
                                        <span style={{ color: "#4E4E4E", flex: 1 }}>{host || "N/A"}</span>
                                    </Col>
                                    <Col md={12} className="form-group mt-2 d-flex align-items-center">
                                        <label
                                            htmlFor="problem"
                                            style={{
                                                width: "150px", 
                                                minWidth: "150px", 
                                                marginRight: "10px",
                                                color: "black",
                                            }}
                                        >
                                            Problem:
                                        </label>
                                        <span style={{ color: "#4E4E4E", flex: 1 }}>{trigger || "N/A"}</span>
                                    </Col>

                                    <Col md={12} className="form-group mt-2 d-flex align-items-center">
                                        <label
                                            htmlFor="severity"
                                            style={{
                                                width: "150px",
                                                minWidth: "150px",
                                                marginRight: "10px",
                                                color: "black",
                                            }}
                                        >
                                            Severity:
                                        </label>
                                        <span style={{ color: "#4E4E4E", flex: 1 }}>{severity || "N/A"}</span>
                                    </Col>

                                    <Col md={12} className="form-group mt-2 d-flex align-items-center">
                                        <label
                                            htmlFor="time"
                                            style={{
                                                width: "150px",
                                                minWidth: "150px",
                                                marginRight: "10px",
                                                color: "black",
                                            }}
                                        >
                                            Time:
                                        </label>
                                        <span style={{ color: "#4E4E4E", flex: 1 }}>{time || "N/A"}</span>
                                    </Col>
                                    <Col md={12} className="form-group mt-2 d-flex align-items-center">
                                        <label
                                            htmlFor="problem"
                                            style={{
                                                width: "150px",
                                                minWidth: "150px", 
                                                marginRight: "10px",
                                                color: "black",
                                            }}
                                        >
                                           Acknowledge By:
                                        </label>
                                        <span style={{ color: "#4E4E4E", flex: 1 }}>{acknowledge || "N/A"}</span>
                                    </Col>

                                    <Col md={12} className="form-group mt-2 d-flex align-items-center">
                                        <label
                                            htmlFor="description"
                                            style={{
                                                width: "150px",
                                                minWidth: "150px",
                                                marginRight: "10px",
                                                color: "black",
                                            }}
                                        >
                                            Description:
                                        </label>
                                        <span style={{ color: "#4E4E4E", flex: 1 }}>{description || "N/A"}</span>
                                    </Col>
                                    <Col md={12} className="form-group mt-2 d-flex align-items-center">
                                        <label
                                            htmlFor="problem"
                                            style={{
                                                width: "150px",
                                                minWidth: "150px",
                                                marginRight: "10px",
                                                color: "black",
                                            }}
                                        >
                                          Status:
                                        </label>
                                        <span style={{ color: "#4E4E4E", flex: 1 }}> {resolved ? 'Resolved' : 'Pending'}</span>
                                    </Col>

                                    <Col md={12} className="form-group mt-2 d-flex align-items-center">
                                        <label
                                            htmlFor="tags"
                                            style={{
                                                width: "150px",
                                                minWidth: "150px",
                                                marginRight: "10px",
                                                color: "black",
                                            }}
                                        >
                                            Tags:
                                        </label>
                                        <span style={{ color: "#4E4E4E", flex: 1 }}>
                                            {Array.isArray(tags) && tags.length > 0 ? (
                                                <div className="d-flex flex-wrap">
                                                    {tags.map((tag, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="badge p-2 me-2"
                                                            style={{ backgroundColor: "#EAEAEA", color: "#000000" }}
                                                        >
                                                            <strong>{tag.tag}:</strong> {tag.value}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                "No Tags"
                                            )}
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editEventsPopupOpen && (
                <div className="modal d-flex align-items-center justify-content-center" tabIndex="-1" role="dialog" style={{ display: "block",}}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">

                            <div className="modal-header d-flex align-items-center justify-content-between px-3">
                                <h5 className="modal-title">Update Problem</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={EditPopupClose}
                                >  </button>
                            </div>

                            <div className="modal-body">
                                <Row>
                                    <Col xs={12}>

                                        <div className="d-flex flex-wrap align-items-center mt-2">
                                            <label className="fw-bold text-dark me-2" style={{ minWidth: "150px" }}>Problem:</label>
                                            <span className="text flex-grow-1" style={{ color: '#FF5F5F' }}>{problemName || 'N/A'}</span>
                                        </div>

                                        <div className="mt-3">
                                            <label className="fw-bold text-dark d-block">Message:</label>
                                            <textarea
                                                className="form-control"
                                                id="message"
                                                value={message}
                                                rows="3"
                                                onChange={(e) => setmessage(e.target.value)}
                                            ></textarea>
                                        </div>

                                        <div className="d-flex flex-wrap mt-3">
                                            <div className="form-check me-4">
                                                <input
                                                    type="checkbox"
                                                    id="changeseverity"
                                                    checked={changeseverity}
                                                    onChange={(e) => setchangeseverity(e.target.checked)}
                                                    className="form-check-input"
                                                />
                                                <label htmlFor="changeseverity" className="form-check-label ms-2">Change Severity</label>
                                            </div>

                                            {/* <div className="form-check me-4">
                                                <input
                                                    type="checkbox"
                                                    id="acknowledge"
                                                    checked={Acknowldge}
                                                    onChange={(e) => setacknowldge(e.target.checked)}
                                                    className="form-check-input"
                                                />
                                                <label htmlFor="acknowledge" className="form-check-label ms-2">Acknowledge</label>
                                            </div> */}

                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    id="closeproblem"
                                                    checked={closeproblem}
                                                    onChange={(e) => setcloseproblem(e.target.checked)}
                                                    className="form-check-input"
                                                />
                                                <label htmlFor="closeproblem" className="form-check-label ms-2">Close Problem</label>
                                            </div>
                                        </div>

                                        {changeseverity && (
                                            <div className="mt-3 d-flex flex-wrap">
                                                {['Not classified', 'Information', 'Warning', 'Average', 'High', 'Disaster'].map((severity, index) => (
                                                    <label key={index} className="me-3 d-flex align-items-center">
                                                        <input type="radio" name="severity" value={severity} className="me-2" />
                                                        {severity}
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </Col>
                                </Row>

                                <div className="d-flex justify-content-end mt-4">
                                    <button
                                        type="button"
                                        className="btn btn"
                                        style={{ width: '150px', backgroundColor: '#FF1100', color: '#FFFFFF' }}
                                        onClick={handleproblemUpdate}
                                    >
                                        Update
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}