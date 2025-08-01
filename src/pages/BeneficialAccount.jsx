import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBalance } from "../contexts/BalanceContext";
import { CurrencyContext } from "../contexts/CurrencyContext";
import { useTransfers } from "../contexts/TransferContext";
import { fetchUsers } from "../Utils/Auth";
import { data } from "react-router-dom";

const BeneficialAccount = () => {
    const { currentUser } = useAuth();
    const { balance } = useBalance();
    const { currency } = useContext(CurrencyContext);
    const { addTransfer, getTransfersByUser } = useTransfers();
    const [inActiveUser, setInActiveUser] = useState([]);
    const [transferData, setTransferData] = useState({
        to: "",
        amount: "",
        description: "",
    });
    const [currentPage,setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const transfers = getTransfersByUser(currentUser?.accountNumber);

    const indexOfLastItem = currentPage * itemsPerPage ;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage ;
    const filerTransfers = transfers.slice(indexOfFirstItem,indexOfLastItem) ;
    const totalPages = Math.ceil(transfers.length/itemsPerPage) ;


    useEffect(() => {
        const loadInActiveUsers = async () => {
            try {
                const allUsers = await fetchUsers();
                const others = allUsers.filter((u) => u.accountNumber !== currentUser.accountNumber);
                setInActiveUser(others);
            } catch (err) {
                console.error("In-Active Users load failed", err);
            }
        };
        loadInActiveUsers();
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransferData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!transferData.to || !transferData.amount || !transferData.description) return alert("All fields required");
        if (+transferData.amount > balance) return alert("Insufficient balance");

        addTransfer({
            from: currentUser.accountNumber,
            to: transferData.to,
            amount: +transferData.amount,
            description: transferData.description,
        });

        alert(`Successfully money sent to ${transferData.to}`) ;

        setTransferData({
            to: "",
            amount: "",
            description: "",
        })
    }

    return (
        <div className="container-fluid text-white" style={{ backgroundColor: "#FDFFFC", minHeight: "100%", borderRadius: "1rem", padding: "2rem" }}>
            <h3 className="mb-4 fw-semibold " style={{ color: "#DA7422" }} >Account Overview</h3>

            {/* Combined Card: Account No. & Total Balance */}
            <div className="card bg-light mb-4">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="text-muted mb-1">Account No.</h6>
                        <p className="fs-5 fw-bold text-dark mb-0">{currentUser?.accountNumber}</p>
                    </div>
                    <div className="text-end">
                        <h6 className="text-muted mb-1">Total Balance</h6>
                        <p className="fs-5 fw-bold text-success mb-0">{currency} - {balance.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Transfer Money Form */}
            <div className="card bg-light mb-4">
                <div className="card-body">
                    <h5 className="card-title text-muted mb-3">Transfer Money</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-dark">To Account</label>
                            <select className="form-select" name="to" value={transferData.to} onChange={handleChange} >
                                <option value="">Select account</option>
                                {inActiveUser.map((user) => (
                                    <option key={user.id} value={user.accountNumber}>{user.accountNumber} - {user.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-dark">Amount</label>
                            <input type="number" name="amount" value={transferData.amount} onChange={handleChange} className="form-control" placeholder="Enter amount" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-dark">Description</label>
                            <input type="text" name="description" value={transferData.description} onChange={handleChange} className="form-control" placeholder="Description" />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Transfer</button>
                    </form>
                </div>
            </div>

            {/* Transaction History Table */}
            <div className="card bg-light">
                <div className="card-body">
                    <h5 className="card-title text-muted mb-3">Transaction History</h5>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>From Account</th>
                                    <th>To Account</th>
                                    <th>Amount</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transfers.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center">No transfers</td></tr>
                                ) : (
                                    transfers.map((t) => (
                                        <tr key={t.id}>
                                            <td>{t.from}</td>
                                            <td>{t.to}</td>
                                            <td>{currency} {t.amount}</td>
                                            <td>{t.description}</td>
                                            <td>{t.status}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                     <div className="d-flex justify-content-center align-items-center mt-3">
                        <button
                            type="button"
                            className="btn btn-outline-primary me-2"
                            onClick={()=> setCurrentPage((prev)=> Math.max(prev - 1,1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="mx-2">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            type="button"
                            className="btn btn-outline-primary ms-2"
                            onClick={()=> setCurrentPage((prev)=> Math.min(prev + 1,totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0 }
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BeneficialAccount;