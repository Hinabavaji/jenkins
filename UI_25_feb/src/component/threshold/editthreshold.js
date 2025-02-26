import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditThresholdModal = ({
  showModal,
  setShowModal,
  editRow,
  handleModalInputChange,
  handleSave
}) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Threshold</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editRow && (
          <>
          <Form>
          <div className="row mb-3">
                        <div className="col-md-6">
                        <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editRow.item_name}
                onChange={(e) => handleModalInputChange("comparison_type", e.target.value)}
              />
                        </div>
                        <div className="col-md-6">
                        <Form.Label>Unit</Form.Label>
              <Form.Control
                type="text"
                value={editRow.unit }
                onChange={(e) => handleModalInputChange("unit", e.target.value)}
              />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                        <Form.Label>Threshold Value</Form.Label>
              <Form.Control
                type="number"
                value={editRow.threshold}
                onChange={(e) => handleModalInputChange("threshold", e.target.value)}
              />
                        </div>
                        <div className="col-md-6">
                        <Form.Label>Comparison Operator</Form.Label>
              <Form.Control
                type="text"
                value={editRow.comparison_type }
                onChange={(e) => handleModalInputChange("comparison_type", e.target.value)}
              />
                        </div>
                    </div>
          </Form>
            {/* <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editRow.item_name}
                onChange={(e) => handleModalInputChange("comparison_type", e.target.value)}
              />
             
            </Form.Group>
            <Form.Group>
              <Form.Label>Unit</Form.Label>
              <Form.Control
                type="text"
                value={editRow.unit }
                onChange={(e) => handleModalInputChange("unit", e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Threshold Value</Form.Label>
              <Form.Control
                type="number"
                value={editRow.threshold}
                onChange={(e) => handleModalInputChange("threshold", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Comparison Operator</Form.Label>
              <Form.Control
                type="text"
                value={editRow.comparison_type }
                onChange={(e) => handleModalInputChange("comparison_type", e.target.value)}
              />
            </Form.Group> */}
          </>
        )}
        <div className="d-flex justify-content-end mt-4">
          <Button variant="" style={{ width: '130px', backgroundColor: '#FF1100', color: '#FFFFFF' }} onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditThresholdModal;
