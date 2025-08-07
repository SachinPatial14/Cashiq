// src/components/Sidebar.jsx
import React, { useContext, useState } from "react";
import {
  FaTachometerAlt,
  FaMoneyBill,
  FaWallet,
  FaChartPie,
  FaChartBar,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaHandHoldingUsd ,
} from "react-icons/fa";
import "./sidebar.css";
import { useNavigate } from "react-router-dom";
import { CurrencyContext } from "../contexts/CurrencyContext";
import { useAuth } from "../contexts/AuthContext";
import { MdAccountCircle } from "react-icons/md";

const Sidebar = () => {
  const [isHovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const { updateCurrency } = useContext(CurrencyContext);
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure want to logout ?")) {
      logout();
      updateCurrency("");
      navigate("/login");
    }
  };

  const handleMouseEnter = (btnId) => setHovered(btnId);
  const handleMouseLeave = () => setHovered(null);

  const getBtnStyle = (id) => ({
    color: isHovered === id ? "#386FA4" : "black",
  });

  return (
    <div className="p-3 mt-5" style={{ width: "250px", backgroundColor: "#f5e5fc" }}>
      <ul className="list-unstyled">
        <button
          className="mb-3 sidebarbtn"
          onMouseEnter={() => handleMouseEnter("dashboard")}
          onMouseLeave={handleMouseLeave}
          style={getBtnStyle("dashboard")}
          onClick={() => navigate("/home")}
        >
          <FaTachometerAlt className="me-2" />
          Dashboard
        </button>

        <button
          className="mb-3 sidebarbtn"
          onMouseEnter={() => handleMouseEnter("expenses")}
          onMouseLeave={handleMouseLeave}
          style={getBtnStyle("expenses")}
          onClick={() => navigate("/home/expenseslist")}
        >
          <FaMoneyBill className="me-2" />
          Expenses
        </button>

        <button
          className="mb-3 sidebarbtn"
          onMouseEnter={() => handleMouseEnter("incomes")}
          onMouseLeave={handleMouseLeave}
          style={getBtnStyle("incomes")}
          onClick={() => navigate("/home/incomelist")}
        >
          <FaWallet className="me-2" />
          Incomes
        </button>

        <button
          className="mb-3 sidebarbtn"
          onMouseEnter={() => handleMouseEnter("beneficialAccount")}
          onMouseLeave={handleMouseLeave}
          onClick={() => navigate("/home/beneficialaccount")}
          style={getBtnStyle("beneficialAccount")}
        >
          <MdAccountCircle className="me-2" />
          Beneficial Account
        </button>

        <button
          className="mb-3 sidebarbtn"
          onMouseEnter={() => handleMouseEnter("loanmanager")}
          onMouseLeave={handleMouseLeave}
          onClick={() => navigate("/home/loanmanager")}
          style={getBtnStyle("loanmanager")}
        >
          <FaHandHoldingUsd  className="me-2" />
          Loan Manager
        </button>


      </ul>

      <p className="text-uppercase fw-semibold small mt-4" style={{ color: "#CF5C36" }}>
        Summary
      </p>
      <ul className="list-unstyled">
        <button
          className="mb-3 sidebarbtn"
          onMouseEnter={() => handleMouseEnter("expenses summary")}
          onMouseLeave={handleMouseLeave}
          style={getBtnStyle("expenses summary")}
          onClick={() => navigate("/home/expensesummary")}
        >
          <FaChartPie className="me-2" />
          Expense Summary
        </button>
        <button
          className="mb-3 sidebarbtn"
          onMouseEnter={() => handleMouseEnter("income summary")}
          onMouseLeave={handleMouseLeave}
          style={getBtnStyle("income summary")}
          onClick={() => navigate("/home/incomesummary")}
        >
          <FaChartBar className="me-2" />
          Income Summary
        </button>
      </ul>

      <p className="text-uppercase fw-semibold small mt-4" style={{ color: "#CF5C36" }}>
        Settings
      </p>
      <ul className="list-unstyled">
        <button
          className="mb-3 sidebarbtn"
          onMouseEnter={() => handleMouseEnter("general")}
          onMouseLeave={handleMouseLeave}
          style={getBtnStyle("general")}
          onClick={() => navigate("/home/currency")}
        >
          <FaCog className="me-2" />
          General
        </button>
        <button
          className="mb-3 sidebarbtn"
          onMouseEnter={() => handleMouseEnter("account")}
          onMouseLeave={handleMouseLeave}
          style={getBtnStyle("account")}
          onClick={() => navigate("/home/account")}
        >
          <FaUser className="me-2" />
          Account
        </button>
        <button
          className="mb-3 sidebarbtn"
          onMouseEnter={() => handleMouseEnter("sign out")}
          onMouseLeave={handleMouseLeave}
          style={getBtnStyle("sign out")}
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" />
          Sign out
        </button>
      </ul>
    </div>
  );
};

export default Sidebar;
