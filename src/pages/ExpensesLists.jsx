import React, { useContext, useRef, useState } from "react";
import { FaPlus, FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import "./ExpensesList.css";
import { CurrencyContext } from "../contexts/CurrencyContext";
import { useNavigate } from "react-router-dom";
import { useExpenses } from "../contexts/ExpensesContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ExpensesList = () => {
    const { currency } = useContext(CurrencyContext);
    const { expenses, removeExpense, handleEdit } = useExpenses();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 4;
    const expenseRef = useRef();

    const filteredExpenses = expenses.filter((exp) =>
        exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentExpenses = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

    const handleExportPdf = async () => {
        const input = expenseRef.current;
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("expenses.pdf");
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            removeExpense(id);
        }
    };

    const onClickEdit = (exp) => {
        handleEdit(exp);
        navigate("/home/expenseform");
    };

    return (
        <div className="container-fluid px-4">
            <div className="d-flex justify-content-between align-items-center mt-2">
                <div>
                    <h2 className="fw-bold">Expenses</h2>
                    <p className="text-muted" >
                        Track your spending and stay on budget with our easy-to-use expense tracker
                    </p>
                </div>
                <button className="  d-flex align-items-center addBtn" onClick={() => navigate("/home/expenseform")}>
                    <FaPlus className="me-2" />
                    Add Expense
                </button>
            </div>

            {/* Export Buttons */}
            <div className="mb-3 d-flex flex-wrap gap-2">
                <button className="btn btn-danger" onClick={handleExportPdf}>Export PDF</button>
            </div>

            {/* Search */}
            <div className="mb-3" style={{ maxWidth: "400px" }}>
                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <FaSearch className="text-muted" />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Expenses"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>
            {/* Table */}
            <div className="table-responsive" ref={expenseRef}>
                <table className="table table-bordered text-center align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>AMOUNT ({currency})</th>
                            <th>CATEGORY</th>
                            <th>DESCRIPTION</th>
                            <th>DATE</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentExpenses.length > 0 ? (
                            currentExpenses.map((exp) => (
                                <tr key={exp.id}>
                                    <td>{exp.amount}</td>
                                    <td>{exp.category}</td>
                                    <td>{exp.description}</td>
                                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                                    <td>  <button className="btn btn-sm btn-primary" onClick={() => onClickEdit(exp)}>
                                        <FaEdit />
                                    </button>
                                        <button
                                            className="btn btn-sm btn-danger ms-2"
                                            onClick={() => handleDelete(exp.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No expenses found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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
        </div>
    );
};

export default ExpensesList;
