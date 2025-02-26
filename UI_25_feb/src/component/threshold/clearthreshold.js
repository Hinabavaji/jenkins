import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmModal = ({ show, onClose, onConfirm ,dltRow}) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            {dltRow && (
            <Modal.Body>
                Are you sure you want to clear the values for  <b>{dltRow.item_name|| 'N/A'} ?</b>
            </Modal.Body>
            )}
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    No
                </Button>
                <Button variant=""  style={{  backgroundColor: '#FF1100', color: '#FFFFFF' }}onClick={onConfirm}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmModal;
