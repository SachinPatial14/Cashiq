import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useLoans } from "../contexts/LoanContext";


const LoanForm = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const {fetchLoans} = useLoans() ;
    const loanURl = import.meta.env.VITE_LOAN_URL;

    const formik = useFormik({
        initialValues: {
            loantype: "",
            amount: "",
            rateofinterest: "",
            tenuremonths: "",
            monthlyemi: "",
            startdate: "",
            enddate: "",
        },
        validationSchema: Yup.object({
            loantype: Yup.string().required("loan type is required"),
            amount: Yup.number().positive("amount must be positive").required("amount is required"),
            rateofinterest: Yup.number().positive("rate of interest must be positive").required("rate of interest is required"),
            tenuremonths: Yup.number().positive("tenure months must be positive").required("tenure month is required"),
            startdate: Yup.date().required("start date is required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const payload = {
                    ...values,
                    userId: currentUser?.id,
                };

                const response = await axios.post(loanURl, payload);

                if (response.status === 200 || response.status === 201) {
                    await fetchLoans() ;
                    alert("Loan saved successfully!");
                    resetForm();
                    navigate("/home/loanmanager");
                } else {
                    alert("Failed to save loan. Try again.");
                }
            } catch (err) {
                console.error("Error saving loan:", err);
                alert("An error occurred while saving the loan.");
            }
        }
    });

        useEffect(()=>{
        const {amount,rateofinterest,tenuremonths,startdate} = formik.values ;

        if(amount && rateofinterest && tenuremonths){
            const principal = parseFloat(amount) ;
            const annualRate = parseFloat(rateofinterest);
            const months = parseInt(tenuremonths);

            const monthlyRate = annualRate / 12 / 100 ;
            const emi  = (principal * monthlyRate * Math.pow(1 + monthlyRate , months)) /
            (Math.pow(1 + monthlyRate, months)- 1);

            formik.setFieldValue("monthlyemi",emi.toFixed(2));
        }

        if(startdate && tenuremonths){
            const start = new Date(startdate) ;
            const months = parseInt(tenuremonths) ;
            const end  = new Date(start.setMonth(start.getMonth() + months));
            formik.setFieldValue("enddate",end.toISOString().split("T")[0]);
        }
    },[formik.values.amount,formik.values.rateofinterest,formik.values.startdate,formik.values.tenuremonths]);



    return (
 <div className="container-fluid bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <h4 className="mb-0" style={{ color: "#DA7422" }}>
          Add New Loan
        </h4>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Loan Type</label>
            <input
              type="text"
              name="loantype"
              className={`form-control ${formik.touched.loantype && formik.errors.loantype ? "is-invalid" : ""}`}
              placeholder="Enter loan type (e.g. Home Loan)"
              {...formik.getFieldProps("loantype")}
            />
            {formik.touched.loantype && formik.errors.loantype && (
              <div className="invalid-feedback">{formik.errors.loantype}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Amount</label>
            <input
              type="number"
              name="amount"
              className={`form-control ${formik.touched.amount && formik.errors.amount ? "is-invalid" : ""}`}
              placeholder="Enter loan amount"
              {...formik.getFieldProps("amount")}
            />
            {formik.touched.amount && formik.errors.amount && (
              <div className="invalid-feedback">{formik.errors.amount}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Rate of Interest (%)</label>
            <input
              type="number"
              name="rateofinterest"
              step="0.01"
              className={`form-control ${formik.touched.rateofinterest && formik.errors.rateofinterest ? "is-invalid" : ""}`}
              placeholder="Enter interest rate"
              {...formik.getFieldProps("rateofinterest")}
            />
            {formik.touched.rateofinterest && formik.errors.rateofinterest && (
              <div className="invalid-feedback">{formik.errors.rateofinterest}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Tenure (Months)</label>
            <input
              type="number"
              name="tenuremonths"
              className={`form-control ${formik.touched.tenuremonths && formik.errors.tenuremonths ? "is-invalid" : ""}`}
              placeholder="Enter tenure in months"
              {...formik.getFieldProps("tenuremonths")}
            />
            {formik.touched.tenuremonths && formik.errors.tenuremonths && (
              <div className="invalid-feedback">{formik.errors.tenuremonths}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Monthly EMI</label>
            <input
              type="number"
              name="monthlyemi"
              className="form-control"
              value={formik.values.monthlyemi}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startdate"
              className={`form-control ${formik.touched.startdate && formik.errors.startdate ? "is-invalid" : ""}`}
              {...formik.getFieldProps("startdate")}
            />
            {formik.touched.startdate && formik.errors.startdate && (
              <div className="invalid-feedback">{formik.errors.startdate}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="enddate"
              className="form-control"
              value={formik.values.enddate}
              disabled
            />
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-primary px-4">
            Save Loan
          </button>
        </div>
      </form>
    </div>    );
};

export default LoanForm;
