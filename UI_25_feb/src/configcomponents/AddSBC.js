import React, { useState } from "react";
import { ADD_SBC } from "@/utilities/api";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { X } from "lucide-react";

const notify = (message, type) => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast.info(message);
      break;
    case "warn":
      toast.warn(message);
      break;
    default:
      toast(message);
      break;
  }
};

export default function AddSBC({ setLoad }) {
  const [showModal, setShowModal] = useState(false);
  const [sbcName, setSbcName] = useState("");
  const [SbcIP, setSbcIP] = useState("");
  const [SbcHostName, SetSbcHostName] = useState("");
  const [SbcDeviceType, SetSbcDeviceType] = useState("");
  const [SbcFloor, SetSbcFloor] = useState("");
  const [SbcDesc, SetSbcDesc] = useState("");
  const [SbcLatitude, setSbcLatitude] = useState("");
  const [SbcLongitude, setSbcLongitude] = useState("");
  const [loading, setLoading] = useState(false);

  const Add_SBC = async () => {
    setLoading(true);
    const storedToken = localStorage.getItem("token");
    const SBC_info = {
      name: sbcName,
      ip_address: SbcIP,
      hostname: SbcHostName,
      device_type_and_version: SbcDeviceType,
      floor: SbcFloor,
      description: SbcDesc,
      latitude: SbcLatitude,
      longitude: SbcLongitude
    };
    try {
      const response = await axios.post(ADD_SBC, SBC_info, {
        headers: { Authorization: `token ${storedToken}` },
      });
      if (response.status === 201) {
        setShowModal(false);
        setLoad(true);
        notify("SBC added successfully", "success");
      }
      setSbcName("");
      setSbcIP("");
      SetSbcDesc("");
      SetSbcDeviceType("");
      SetSbcFloor("");
      SetSbcHostName("");
      setSbcLatitude("");
      setSbcLongitude("");
    } catch (error) {
      notify("Failed to add new SBC", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        style={{ backgroundColor: "#ff1100", borderColor: "#ff1100" }}
        onClick={() => setShowModal(true)}
      >
        + Add SBC
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="modal-title">Add SBC</h5>
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
                    value={sbcName} 
                    onChange={(e) => setSbcName(e.target.value)} 
                    placeholder="Enter name" 
                  />
                </div>
                <div className="col-md-6">
                  <Form.Label>Model and Version</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={SbcDeviceType} 
                    onChange={(e) => SetSbcDeviceType(e.target.value)} 
                    placeholder="Enter model and version" 
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <Form.Label>Host Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={SbcHostName} 
                    onChange={(e) => SetSbcHostName(e.target.value)} 
                    placeholder="Enter host name" 
                  />
                </div>
                <div className="col-md-6">
                  <Form.Label>Location (Floor)</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={SbcFloor} 
                    onChange={(e) => SetSbcFloor(e.target.value)} 
                    placeholder="Enter location (floor)" 
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <Form.Label>IP Address</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={SbcIP} 
                    onChange={(e) => setSbcIP(e.target.value)} 
                    placeholder="Enter IP address" 
                  />
                </div>
                <div className="col-md-6">
                  <Form.Label>Description</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={SbcDesc} 
                    onChange={(e) => SetSbcDesc(e.target.value)} 
                    placeholder="Enter description" 
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={SbcLatitude} 
                    onChange={(e) => setSbcLatitude(e.target.value)} 
                    placeholder="Enter latitude" 
                  />
                </div>
                <div className="col-md-6">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={SbcLongitude} 
                    onChange={(e) => setSbcLongitude(e.target.value)} 
                    placeholder="Enter longitude" 
                  />
                </div>
              </div>
            </Form>
          </div>
          <div className="d-flex justify-content-end align-items-right mt-2">
          <Button 
            style={{ backgroundColor: "#ff1100", borderColor: "#ff1100", color: "#fff", padding: "8px 16px", fontSize: "14px" }}
            onClick={Add_SBC}
          >
            Save
          </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
