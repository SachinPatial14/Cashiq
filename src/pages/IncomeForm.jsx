import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIncomes } from "../contexts/IncomeContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";


const IncomeForm = () => {
    const navigate = useNavigate();
    const { addIncome, editIncome, setEditIncome, updateIncome } = useIncomes();
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const userId = user?.id;
    const incomesURL = import.meta.env.VITE_INCOMES_URL;

    useEffect(() => {
        if (editIncome) {
            formik.setValues({
                amount: editIncome.amount,
                description: editIncome.description,
                source: editIncome.source,
                date: editIncome.date.slice(0, 10),
            })
        }
    }, [editIncome]);

    const formik = useFormik({
        initialValues: {
            amount: "",
            description: "",
            source: "",
            date: "",
        },
        validationSchema: Yup.object({
            amount: Yup.number().positive("Amount must be positive").required("Amount is required"),
            description: Yup.string().min(2, "Too short").required("Description is required"),
            source: Yup.string().required("Source is required"),
            date: Yup.date().required("Date is required"),
        }),
        onSubmit:async(values,{resetForm})=>{
            try{
              if(editIncome){
                const updatedIncome={
                    ...editIncome , ...values,
                };
                const {data:updated}= await axios.patch(`${incomesURL}/${editIncome.id}`,{
                    ...updatedIncome ,
                    userId
                }) ;
                updateIncome(updatedIncome) ;
                alert("Income updated !") ;
                setEditIncome(null);
              }else{
                const {data:created} = await axios.post(incomesURL,{
                    ...values ,
                    userId ,
                });
                addIncome(created) ;
                alert("Income added !") ;
              }
              resetForm() ;
              navigate("/home/incomelist") ;
            }catch(err){
              console.error("Error adding income:", err);
             alert("Something went wrong.");
            }
        },
    });

    return(
                <div className="container mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-semibold">
                            <span style={{ color: "#F0544F" }}>Incomes</span> / {editIncome?"Edit":"Add"} Income
                        </h4>
                        <button className="btn btn-outline-secondary d-flex align-items-center" onClick={() =>{
                          setEditIncome(null) ;
                          navigate("/home/incomelist") ;
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
                            <label className="form-label">Source</label>
                            <select
                                name="source"
                                className={`form-select ${formik.touched.source && formik.errors.source ? "is-invalid" : ""}`}
                                value={formik.values.source}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">-- select --</option>
                                <option value="Salary">Salary</option>
                                <option value="Investment">Investment</option>
                                <option value="Rental">Rental</option>
                                <option value="Buisness">Business</option>
                                <option value="Government Benefits">Government Benefits</option>
                                <option value="Others">Others</option>
                            </select>
                            {formik.touched.source && formik.errors.source && (
                                <div className="invalid-feedback">{formik.errors.source}</div>
                            )}
                        </div>
        
                        <div className="mb-3">
                            <label className="form-label">Date of Income</label>
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
        
                        <button type="submit" className="btn btn-primary">
                            {editIncome?"Update":"Submit"}
                        </button>
                    </form>
                </div>
        
    )
}

export default IncomeForm;