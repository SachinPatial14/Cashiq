import React, { useEffect, useState } from "react";
import { FaHandHoldingUsd } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLoans } from "../contexts/LoanContext";
import { useExpenses } from "../contexts/ExpensesContext";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import EmiPaymentModal from "../components/EmiPayment";
import { useBalance } from "../contexts/BalanceContext";
import "./LoanManager.css" ;

const LoanManager = () => {
  const { loans } = useLoans();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { fetchLoans, fetchEmiTransactions } = useLoans();
  const { balance } = useBalance();
  const { addExpense } = useExpenses();
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [emiPayments, setEmiPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const loanURL = import.meta.env.VITE_LOAN_URL;
  const emiURL = import.meta.env.VITE_EMI_URL;
  const expenseURL = import.meta.env.VITE_EXPENSES_URL;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filterLoans = loans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(loans.length / itemsPerPage);

  useEffect(() => {
    const fetchEmiPayments = async () => {
      try {
        const res = await axios.get(`${emiURL}`);
        const userEmis = res.data.filter(p => p.userId === currentUser?.id);
        setEmiPayments(userEmis);
      } catch (err) {
        console.error("Failed to fetch EMI payments", err);
      }
    };

    if (currentUser?.id) {
      fetchEmiPayments();
    }
  }, [currentUser]);

  const hasPaidCurrentMonth = (loanId) => {
    const today = new Date();
    const currentMonth = today.toLocaleString("default", { month: "long" });
    const currentYear = today.getFullYear();

    return emiPayments.some(
      (p) =>
        p.loanId === loanId &&
        p.month === currentMonth &&
        p.year === currentYear
    );
  };


  const handlePayEmiClick = (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  const handleConfirmPayment = async () => {
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();

    const payLoad = {
      loanId: selectedLoan.id,
      userId: currentUser?.id,
      amountPaid: selectedLoan.monthlyemi,
      paymentDate: today.toISOString().split("T")[0],
      month,
      year,
    };

    try {
      const response = await axios.post(emiURL, payLoad);

      if (response.status === 200 || response.status === 201) {
        const expenseObj = {
          userId: currentUser.id,
          category: "EMI Payment",
          amount: selectedLoan.monthlyemi,
          date: today.toISOString(),
          description: `EMI for ${selectedLoan.loantype}`,
        };

        await axios.post(expenseURL, expenseObj);
        addExpense(expenseObj);

        const emiRes = await axios.get(`${emiURL}?loanId=${selectedLoan.id}`);
        const allPayments = emiRes.data || [];

        if (allPayments.length >= selectedLoan.tenuremonths) {
          await axios.delete(`${loanURL}/${selectedLoan.id}`);
          alert("Loan fully paid and remove from your list")
        } else {
          alert("EMI Paid Successfully");
        };

        const allEmis = await axios.get(`${emiURL}`);
        const userEmis = allEmis.data.filter(p => p.userId === currentUser?.id);
        setEmiPayments(userEmis);
        fetchEmiTransactions();
        fetchLoans();
        setShowModal(false);
        setSelectedLoan(null);
      } else {
        alert("failed to process payment");
      }
    } catch (err) {
      console.error("EMI Payment error:", error);
      alert("An error occurred while processing EMI payment.");
    }

  }



  return (
    <div className="container-fluid mt-3">
      <h3 className="mb-3 d-flex align-items-center" style={{ color: '#22162B' }}>
        <FaHandHoldingUsd className="me-2" style={{color:"#F6AE2D"}} />
        Loan Manager
      </h3>

      <div className="d-flex justify-content-end mb-3">
        <button className=" loanBtn"  onClick={() => navigate("/home/loanform")}>Take Loan</button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>Loan Type</th>
              <th>Amount</th>
              <th>Rate of Interest</th>
              <th>Monthly EMI</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Tenure (Months)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filterLoans.length === 0 ? (
              <tr><td colSpan="8" className="text-center">No Loans</td></tr>
            ) : (
              filterLoans.map((l) => {
                const paid = hasPaidCurrentMonth(l.id);
                const Insufficient = parseFloat(l.monthlyemi) > balance;
                return (
                  <tr key={l.id}>
                    <td>{l.loantype}</td>
                    <td>{l.amount}</td>
                    <td>{l.rateofinterest}</td>
                    <td>{l.monthlyemi}</td>
                    <td>{l.startdate}</td>
                    <td>{l.enddate}</td>
                    <td>{l.tenuremonths}</td>
                    <td><button className={`btn btn-sm ${paid ? "btn-secondary" : Insufficient ? "btn-danger" : "btn-success"} btn-success`} onClick={() => handlePayEmiClick(l)} disabled={paid || Insufficient}>{paid ? "Paid" : Insufficient ? "Insufficient balance" : "Pay EMI"}</button></td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-3">
                <button
                    className="btn btn-outline-dark btn-sm me-2"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    « Prev
                </button>
                <p className="mb-0 mx-2">
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </p>
                <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Next »
                </button>
            </div>

      {/* Modal */}
      {selectedLoan && (
        <EmiPaymentModal show={showModal} onHide={() => setShowModal(false)} loan={selectedLoan} onConfirm={handleConfirmPayment} />
      )}
    </div>
  );
};

export default LoanManager;
