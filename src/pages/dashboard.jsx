import React, { useContext, useState } from "react";
import { CurrencyContext } from "../contexts/CurrencyContext";
import { useExpenses } from "../contexts/ExpensesContext";
import { useIncomes } from "../contexts/IncomeContext";
import { format, subMonths } from "date-fns";
import { useBalance } from "../contexts/BalanceContext";
import { useLoans } from "../contexts/LoanContext";

const Dashboard = () => {
  const { currency } = useContext(CurrencyContext);
  const { totalExpense, last30DaysExpenses, lastMonthExpenses } = useExpenses();
  const { totalIncome, last30DaysIncome, lastMonthIncomes } = useIncomes();
  const { balance } = useBalance();
  const { getLoanType, recentEMI } = useLoans();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredEmi = recentEMI.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(recentEMI.length / itemsPerPage);

  const lastMonthDate = subMonths(new Date(), 1);
  const lastMonthName = format(lastMonthDate, "LLLL");

  const balanceLast30Days = last30DaysIncome - last30DaysExpenses;
  const balanceLastMonth = lastMonthIncomes - lastMonthExpenses;

  return (
    <div className="container-fluid">
      <p className="fs-4 fw-semibold  mb-5 mt-2 text-center" style={{ color: "#6F6866" }}>
        Manage your finances smartly and stay in control!
      </p>

      <div className="row g-3">
        {/* Currency & Balance */}
        <div className="col-md-3">
          <div className="bg-white shadow-sm p-3 rounded text-center">
            <h6 className="text-uppercase text-muted">Currency</h6>
            <h5 className="fw-bold">{currency}</h5>
          </div>
        </div>

        <div className="col-md-3">
          <div className="bg-white shadow-sm p-3 rounded text-center">
            <h6 className="text-uppercase text-muted">Total Balance</h6>
            <h5 className="fw-bold text-danger">{balance.toFixed(1)}</h5>
          </div>
        </div>

        <div className="col-md-3">
          <div className="bg-white shadow-sm p-3 rounded text-center">
            <h6 className="text-uppercase text-muted">Last 30 Days</h6>
            <h5 className="fw-bold text-success">{balanceLast30Days.toFixed(1)}</h5>
          </div>
        </div>

        <div className="col-md-3">
          <div className="bg-white shadow-sm p-3 rounded text-center">
            <h6 className="text-uppercase text-muted">{lastMonthName}</h6>
            <h5 className="fw-bold " style={{ color: "#1D2F6F" }}>{balanceLastMonth.toFixed(1)}</h5>
          </div>
        </div>

        {/* Income & Expense */}
        <div className="col-md-6">
          <div className="bg-success text-white p-4 rounded text-center">
            <h5 className="text-uppercase">Total Income</h5>
            <h3 className="fw-bold">{totalIncome.toFixed(1)}</h3>
          </div>
        </div>

        <div className="col-md-6">
          <div className="bg-danger text-white p-4 rounded text-center">
            <h5 className="text-uppercase">Total Expense</h5>
            <h3 className="fw-bold">{totalExpense.toFixed(1)}</h3>
          </div>
        </div>

        {/* Last 30 Days & Last Month */}
        <div className="col-md-6">
          <div className="bg-dark text-white p-4 rounded text-center">
            <h5 className="text-uppercase">Last 30 Days</h5>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <span className="text-success fw-bold">{last30DaysIncome.toFixed(1)}</span>
              <span className="text-danger fw-bold">{last30DaysExpenses.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className=" p-4 rounded text-center" style={{ backgroundColor: "#1D2F6F", color: "white" }}>
            <h5 className="text-uppercase">Last Month - {lastMonthName}</h5>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <span className="text-success fw-bold">{lastMonthIncomes.toFixed(1)}</span>
              <span className="text-danger fw-bold">{lastMonthExpenses.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* emi transaction table */}

      <div className="col-12 mt-5">
        <div className="bg-white shadow-sm p-4 rounded">
          <h5 className="text-uppercase text-center mb-4" style={{ color: "#1D2F6F" }}>
            Recent EMI Transactions
          </h5>
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Loan Type</th>
                  <th>Amount Paid</th>
                  <th>For Month</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmi.length === 0 ? (
                  <tr ><td colSpan="8" className="text-center">No EMI Found</td></tr>
                ) : (
                  filteredEmi.map((emi) => (
                    <tr key={emi.id}>
                      <td>{emi.paymentDate}</td>
                      <td>{getLoanType(emi.loanId)}</td>
                      <td>{emi.amountPaid}</td>
                      <td>{emi.month} {emi.year}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
        <div className="d-flex justify-content-center align-items-center mt-2 mb-2">
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
    </div>
  );
};

export default Dashboard;
