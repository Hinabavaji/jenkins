import { Modal, Button, Form,Col } from "react-bootstrap";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const PermissionModal = ({ show, handleClose }) => {
    const [role, setRole] = useState("");
    const [user,setUser]=useState('')

    const [userName,setuserName] = useState('')

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleSave = () => {
        alert(`Permission saved for :${user}  role: ${role}`);
        handleClose(); 
    };
    const handleUserChange=(e)=>{
        setUser(e.target.value)
    }

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Assign Permission</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Col xs={12} md={12} className="d-flex justify-content-md-end mt-2 mt-md-0">
                                <div className="position-relative" style={{ width: "100%", maxWidth: "250px" }}>
                                    <Form.Control
                                        type="text"
                                        placeholder=" Search users to add"
                                        className="form-control-sm"
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
                <Form>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <Form.Label>Name </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Name"
                                // value={ruleName}
                                // onChange={(e)=>setRuleName(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Select Email"
                                // value={device}
                                // onChange={(e)=>setDevice(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <Form.Label>Contact number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Contact number"
                                // value={ruleName}
                                // onChange={(e)=>setRuleName(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <Form.Label>Company</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Select Company"
                                // value={device}
                                // onChange={(e)=>setDevice(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Title"
                                // value={ruleName}
                                // onChange={(e)=>setRuleName(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            as="select"
                            value={role}
                            onChange={handleRoleChange}
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Editor">Editor</option>
                            <option value="Viewer">Viewer</option>
                        </Form.Control>
                        </div>
                    </div>
                </Form>
                <div className="d-flex justify-content-end mt-4">
                <Button variant="" style={{ width: '150px', backgroundColor: '#FF1100', color: '#FFFFFF' }} onClick={handleSave}>
                    Save Changes
                </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default PermissionModal;
