import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./signup.css"
import { isLoggedIn } from "../Utils/Auth";


function SignUp() {
    const userUrl = import.meta.env.VITE_USER_URL;
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            accountNumber :"",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required !"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
        }),
        onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
            try {
                const res = await axios.get(`${userUrl}?email=${values.email}`);
                if (res.data.length > 0) {
                    setErrors({ email: "Email already registered" });
                } else {
                  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
                     const newUser = { ...values, accountNumber };
                    await axios.post(userUrl, newUser);
                    // toast.success("Signup Done , Now Do login");
                    alert(`Signup done! Your Account No: ${accountNumber}`)
                    resetForm();
                    navigate("/login");
                }
            } catch (err) {
                alert("Error signing up");
            }
            setSubmitting(false);
        },
    })

    if(isLoggedIn()){
      return <Navigate to="/home" replace />
    }
    
    return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100 bg-dark">
      <div className="card text-center shadow-lg" style={{ width: "30rem", height: "25rem", background: "#2c2c6c", border: "none" }}>
        <div className="card-body">
          <h2 className="card-title text-white mb-4">Sign up</h2>
          <form onSubmit={formik.handleSubmit} noValidate>
            {/* USER NAME */}
            <div className="mb-3 text-start">
              <input
                type="text"
                name="name"
                className={`form-control ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
                placeholder="User name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">{formik.errors.name}</div>
              )}
            </div>

            {/* EMAIL */}
            <div className="mb-3 text-start">
              <input
                type="email"
                name="email"
                className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                placeholder="Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mb-4 text-start">
              <input
                type="password"
                name="password"
                className={`form-control ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                placeholder="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="btn text-white w-100 mb-3"
              disabled={formik.isSubmitting}
              id="submitSignup"
            >
              Sign up
            </button>
          </form>

          {/* LOGIN LINK */}
          <div className="d-flex align-items-center justify-content-center w-100 m-50 mt-3 rounded p-1 text-center" style={{backgroundColor:"#EDEDF0"}}>
            <Link to="/login" className="text-black text-decoration-none" >
              Already have account ? <span style={{color:"#F85E00"}} className="link-underline-primary">Login</span>
            </Link>
          </div>
        </div>
        {/* FOOTER CURVE */}
       
      </div>
    </div>
  );
}

export default SignUp;