import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useExpenses } from "../contexts/ExpensesContext";
import { useBalance } from "../contexts/BalanceContext";

const ExpenseForm = () => {
    const navigate = useNavigate();
    const { addExpense, editExpense, setEditExpense,updateExpense,totalExpense } = useExpenses();
    const {balance} = useBalance() ;
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const userId = user?.id;
    const expensesURL = import.meta.env.VITE_EXPENSES_URL;

    useEffect(() => {
        if (editExpense) {
            formik.setValues({
                amount: editExpense.amount,
                description: editExpense.description,
                category: editExpense.category,
                date: editExpense.date.slice(0, 10),
            });
        }
    }, [editExpense])

    const formik = useFormik({
        initialValues: {
            amount: "",
            description: "",
            category: "",
            date: "",
        },
        validationSchema: Yup.object({
            amount: Yup.number().positive("Amount must be positive").required("Amount is required"),
            description: Yup.string().min(2, "Too short").required("Description is required"),
            category: Yup.string().required("Category is required"),
            date: Yup.date().required("Date is required"),
        }),
        onSubmit: async (values, { resetForm , setFieldError }) => {
            try {
                const amount = parseFloat(values.amount) ;

                const currentTotal = editExpense ? totalExpense - editExpense.amount : totalExpense ;

                if(amount + currentTotal > balance){
                    setFieldError("amount","Total Expense amount exceed over the total amount of balance");
                    return ;
                };

                if(editExpense){
                     const updatedExpense = {
                ...editExpense,
                ...values,
            };
          const {data: updated } =  await axios.patch(`${expensesURL}/${editExpense.id}`,{
                ...updatedExpense ,
                userId
            }) ;
            updateExpense(updated) ;
            alert("Expense updated!");
            setEditExpense(null);
                }else{
                const { data: created } = await axios.post(expensesURL, {
                    ...values,
                    userId,
                });
                addExpense(created);
                alert("Expense added!");
                }
                resetForm();
                navigate("/home/expenseslist");
            } catch (err) {
                console.error("Error adding expense:", err);
                alert("Something went wrong.");
            }
        },
    });

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-semibold">
                    <span style={{ color: "#F0544F" }}>Expenses</span> / {editExpense?"Edit":"Add"} Expense
                </h4>
                <button className="btn btn-outline-secondary d-flex align-items-center" onClick={() =>{
                  setEditExpense(null) ;
                  navigate("/home/expenseslist")
                } }>
                    <FaArrowLeft className="me-2" />
                    Back
                </button>
            </div>

            <form className="bg-white p-4 shadow rounded" onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                        type="number"
                        name="amount"
                        className={`form-control ${formik.touched.amount && formik.errors.amount ? "is-invalid" : ""}`}
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter amount"
                    />
                    {formik.touched.amount && formik.errors.amount && (
                        <div className="invalid-feedback">{formik.errors.amount}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                        type="text"
                        name="description"
                        className={`form-control ${formik.touched.description && formik.errors.description ? "is-invalid" : ""}`}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter description"
                    />
                    {formik.touched.description && formik.errors.description && (
                        <div className="invalid-feedback">{formik.errors.description}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                        name="category"
                        className={`form-select ${formik.touched.category && formik.errors.category ? "is-invalid" : ""}`}
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="">-- select --</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health & Medicine">Health & Medicine</option>
                        <option value="Grocery">Grocery</option>
                        <option value="Housing">Housing</option>
                        <option value="Internet">Internet</option>
                        <option value="Others">Others</option>
                    </select>
                    {formik.touched.category && formik.errors.category && (
                        <div className="invalid-feedback">{formik.errors.category}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Date of Expense</label>
                    <input
                        type="date"
                        name="date"
                        className={`form-control ${formik.touched.date && formik.errors.date ? "is-invalid" : ""}`}
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.date && formik.errors.date && (
                        <div className="invalid-feedback">{formik.errors.date}</div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                    {editExpense?"Update":"Submit"}
                </button>
            </form>
        </div>
    )
};

export default ExpenseForm;