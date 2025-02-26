import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
const CreateThresholdModal = ({ show, handleClose }) => {

    const [ruleName,setRuleName] = useState('');
    const [device,setDevice]= useState('');
    const [conditionOperator,setConditionOperator]= useState('');
    const [conditionValue,setConditionValue]=useState('');
    const [actionType,setActionType]=useState('');
    const [actionMsg,setActionMsg]=useState('');

    const SaveRule = () =>{
        const payload={
            rule : ruleName,
            device: device,
            operator : conditionOperator,
            value : conditionValue,
            type: actionType,
            msg : actionMsg
        }
        console.log('rule',payload)
    }

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Rule Creation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <Form.Label>Name of Rule</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Name"
                                value={ruleName}
                                onChange={(e)=>setRuleName(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <Form.Label>Device</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Select Device"
                                value={device}
                                onChange={(e)=>setDevice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <Form.Label>Condition operator</Form.Label>
                            <Form.Control
                                type="text"
                                value={conditionOperator}
                                onChange={(e)=>setConditionOperator(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <Form.Label>Condition Value</Form.Label>
                            <Form.Control
                                type="text"
                                value={conditionValue}
                                onChange={(e)=>setConditionValue(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <Form.Label>Action type</Form.Label>
                            <Form.Control
                                type="text"
                                value={actionType}
                                onChange={(e)=>setActionType(e.target.value)}

                            />
                        </div>
                        <div className="col-md-6">
                            <Form.Label>Action Message</Form.Label>
                            <Form.Control
                                type="text"
                                value={actionMsg}
                                onChange={(e)=>setActionMsg(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="" style={{ width: '150px', backgroundColor: '#FF1100', color: '#FFFFFF' }} 
                        onClick={SaveRule}>
                            Set
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default CreateThresholdModal;