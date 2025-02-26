import React, { useState } from "react";
import { ADDDEVICE, SBC_DROPDOWN } from '@/utilities/api';
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

export default function AddDevice({ setLoad }) {
    const [showModal, setShowModal] = useState(false);
    const [name, setname] = useState('');
    const [ip, setIP] = useState('');
    const [company, setcompany] = useState('');
    const [type, setType] = useState('');
    const [tags, settags] = useState('');
    const [Classtags, setClasstags] = useState('');
    const [Targettags, setTargettags] = useState('');
    const [hostname, sethostname] = useState('');
    const [url, seturl] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [networkenabled, setnetworkenabled] = useState(true);
    const [changedetection, setchangedetection] = useState(false);
    const [hopbyhop, sethopbyhop] = useState(false);
    const [SBC, setSBc] = useState();
    const [loading, setLoading] = useState(false);
    const [SBCList, setSBCList] = useState([]);

    const addDevice = async () => {
        setLoading(true);
        const storedToken = localStorage.getItem('token');
        const selectedSBCId = SBC;
        console.log("Selected ABC (Inside ADD func)----->",selectedSBCId);
        const deviceInfo = {
            name: name,
            ip_address: ip,
            hostname: hostname,
            url: url,
            device_type: type,
            company: company,
            sbc: {
                id: selectedSBCId
            },
            latitude: latitude,
            longitude: longitude,
            tags: { class: Classtags, target: Targettags },
            network_enabled: networkenabled,
            change_detection_enabled: changedetection,
            hop_by_hop_enabled: hopbyhop,
            status: true
        };
        try {
            const response = await axios.post(ADDDEVICE, deviceInfo, {
                headers: {
                    Authorization: `token ${storedToken}`,
                },
            });
            if (response.status === 201) {
                notify('device added successfully', 'sucess')
                setShowModal(false);
                setLoad(true);
            }
            //fetchDevicedetails(1, pageSize, storedToken);
            setname('')
            setIP('')
            setcompany('')
            sethostname('')
            seturl('')
            settags('')
            setType('')
            setnetworkenabled('')
            sethopbyhop('')
            setLatitude('')
            setLongitude('')
            setchangedetection('')
            setTargettags('')
            setClasstags('')
        } catch (error) {
            console.error("error featching data", error)
        } finally {
            setLoading(false);
        }
    }
    const handleDeviceTypeChange = (e) => {
        const selectedType = e.target.value;
        setType(selectedType);
        if (selectedType === 'switch') {
            setchangedetection(true);
            sethopbyhop(false);
            setnetworkenabled(false)
            setIP('')
            sethostname('')
            seturl('')
        } else if (selectedType === 'url') {
            setchangedetection(false);
            sethopbyhop(true);
            setnetworkenabled(false)
            setIP('')
            sethostname('')
            seturl('')
            setLatitude('')
            setLongitude('')
        } else {
            setchangedetection(false);
            sethopbyhop(false);
            setnetworkenabled(true)
            setIP('');
            sethostname('')
            seturl('')
        }
    };
    const toggleNetwork = () => {
        setnetworkenabled(prevStatus => !prevStatus);
    };
    const toggleChangedetection = () => {
        setchangedetection(prevStatus => !prevStatus);
    };
    const togglehopbyhop = () => {
        sethopbyhop(prevStatus => !prevStatus);
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
    return (
        <>
            <Button
                style={{ backgroundColor: "#ff1100", borderColor: "#ff1100" }}
                onClick={() => setShowModal(true)}
            >
                + Add Device
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="modal-title">Add Device</h5>
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
                                        value={name}
                                        onChange={(e) => setname(e.target.value)}
                                        placeholder="Enter Name"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Form.Label>Device Type:</Form.Label>
                                    <Form.Select
                                        value={type}
                                        onChange={handleDeviceTypeChange}
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
                                        value={SBC}
                                        onChange={(e) => {setSBc(e.target.value), console.log("Button Click--->",e.target.value)}}
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
                                        value={company}
                                        onChange={(e) => setcompany(e.target.value)}
                                        placeholder="Enter Device Make"
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                {type !== 'url' ? (
                                    <div className="col-md-6">
                                        <Form.Label>Host Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={hostname}
                                            onChange={(e) => sethostname(e.target.value)}
                                            placeholder="Enter HostName"
                                        />
                                    </div>) : (
                                    <div className="col-md-6">
                                        <Form.Label>URL</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={url}
                                            onChange={(e) => seturl(e.target.value)}
                                            placeholder="Enter URL"
                                        />
                                    </div>
                                )}
                                <div className="col-md-6">
                                    <Form.Label>IP Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={ip}
                                        onChange={(e) => setIP(e.target.value)}
                                        placeholder="Enter description"
                                    />
                                </div>
                            </div>
                            {type !== 'url' ? (
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <Form.Label>Latitude</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={latitude}
                                            onChange={(e) => setLatitude(e.target.value)}
                                            placeholder="8.34362"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Label>Longitude</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={longitude}
                                            onChange={(e) => setLongitude(e.target.value)}
                                            placeholder="34.24531"
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
                                                value={Classtags}
                                                onChange={(e) => setClasstags(e.target.value)}
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
                                                value={Targettags}
                                                onChange={(e) => setTargettags(e.target.value)}
                                            >
                                                <option value="">Select Target</option>
                                                <option value="SNMP">SNMP</option>
                                                <option value="Agent"> Agent</option>
                                                <option value="ICMP">ICMP</option>
                                            </Form.Select>
                                        </div>
                                    </div>
                                </div>
                                {type === 'switch' && (
                                    <div className="col-md-6">
                                        <Form.Label>Change Detection</Form.Label>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            checked={changedetection}
                                            onChange={toggleChangedetection}
                                        />
                                    </div>)}
                                {type === 'url' && (
                                    <div className="col-md-6">
                                        <Form.Label>Hop-by-Hop</Form.Label>
                                        <Form.Check
                                            type="switch"
                                            id="hopbyToggle"
                                            checked={hopbyhop}
                                            onChange={togglehopbyhop}
                                        />
                                    </div>)}
                                {type === 'laptop' && (
                                    <div className="col-md-6">
                                        <Form.Label>Network</Form.Label>
                                        <Form.Check
                                            type="switch"
                                            id="networkToggle"
                                            checked={networkenabled}
                                            onChange={toggleNetwork}
                                        />
                                    </div>)}
                            </div>
                        </Form>
                    </div>
                    <div className="d-flex justify-content-end align-items-right mt-2">
                        <Button
                            style={{ backgroundColor: "#ff1100", borderColor: "#ff1100", color: "#fff", padding: "8px 16px", fontSize: "14px" }}
                            onClick={addDevice}
                        >
                            Save
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
