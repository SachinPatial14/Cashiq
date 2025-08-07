import React from "react";
import { Modal, Button } from "react-bootstrap";

const EmiPaymentModal = ({ show, onHide, loan, onConfirm }) => {
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm EMI Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Loan Type:</strong>{loan.loantype}</p>
                <p><strong>EMI Amount:</strong> ${loan.monthlyemi}</p>
                <p><strong>Paying for:</strong> {month} {year}</p>
                <p>Do you want to proceed with this payment?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button variant="primary" onClick={onConfirm}>Confirm Payment</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EmiPaymentModal ;
