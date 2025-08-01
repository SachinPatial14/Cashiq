import React, { useContext, useRef, useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { CurrencyContext } from "../contexts/CurrencyContext";
import { useNavigate } from "react-router-dom";
import { useIncomes } from "../contexts/IncomeContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


const IncomeList = () => {
    const { currency } = useContext(CurrencyContext);
    const { incomes, removeIncome, handleEdit } = useIncomes();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 4;
    const incomeRef = useRef();

    const filteredIncomes = incomes.filter((inc)=>
        inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.source.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentIncomes = filteredIncomes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredIncomes.length / itemsPerPage);

    const handleExportPdf = async () => {
        const input = incomeRef.current;
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("incomes.pdf");
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this income?")) {
            removeIncome(id);
        };
    };

    const onClickEdit = (inc) => {
        handleEdit(inc);
        navigate("/home/incomeform");
    };


    return (
        <div className="container-fluid px-4">
            <div className="d-flex justify-content-between align-items-center mt-2">
                <div>
                    <h2 className="fw-bold">Incomes</h2>
                    <p className="text-muted" >
                        Accurate income tracking is crucial for creating a realistic budget.                    </p>
                </div>
                <button className="  d-flex align-items-center addBtn" onClick={() => navigate("/home/incomeform")} >
                    <FaPlus className="me-2" />
                    Add Income
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
                        onChange={(e)=>{
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>
            </div>
            {/* Table */}
            <div className="table-responsive" ref={incomeRef}>
                <table className="table table-bordered text-center align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>AMOUNT ({currency})</th>
                            <th>SOURCE</th>
                            <th>DESCRIPTION</th>
                            <th>DATE</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentIncomes.length > 0 ? (
                            currentIncomes.map((inc) => (
                                <tr key={inc.id}>
                                    <td>{inc.amount}</td>
                                    <td>{inc.source}</td>
                                    <td>{inc.description}</td>
                                    <td>{new Date(inc.date).toLocaleDateString()}</td>
                                    <td>  <button className="btn btn-sm btn-primary" onClick={() => onClickEdit(inc)}>
                                        <FaEdit />
                                    </button>
                                        <button
                                            className="btn btn-sm btn-danger ms-2"
                                            onClick={() => handleDelete(inc.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No incomes found</td>
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

    )
}

export default IncomeList;