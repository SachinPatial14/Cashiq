// src/pages/LoginPage.jsx
import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { fetchUsers } from "../Utils/Auth";
import { CurrencyContext } from "../contexts/CurrencyContext";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { updateCurrency } = useContext(CurrencyContext);
  const { login, isAuthenticated } = useAuth();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleLogin = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const users = await fetchUsers();
      const user = users.find(
        (u) => u.email === values.email && u.password === values.password
      );

      if (user) {
        const { password, ...safeUser } = user;
        login(safeUser); // Set in context + localStorage
        updateCurrency(user.preferredCurrency || "");
        alert("Login Done");
        navigate("/home");
      } else {
        alert("Invalid email or password");
        resetForm();
      }
    } catch (err) {
      setErrors({ email: "Failed to connect to user API" });
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-vh-100 vw-100 d-flex justify-content-center align-items-center bg-dark">
      <div className="bg-white p-5 rounded-4 shadow w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center fw-bold mb-4">Login</h2>
        <Formik
          onSubmit={handleLogin}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <Field
                  name="email"
                  type="email"
                  className="form-control border-0 border-bottom"
                />
                <ErrorMessage
                  component="div"
                  name="email"
                  className="text-danger small mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <Field
                  name="password"
                  type="password"
                  className="form-control border-0 border-bottom"
                />
                <ErrorMessage
                  component="div"
                  name="password"
                  className="text-danger small mt-1"
                />
              </div>

              <button
                type="submit"
                className="btn w-100 text-white fw-semibold"
                style={{
                  background: "linear-gradient(to right, #4facfe, #7366ff)",
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-4">
          <p className="text-muted">
            Don't have an account?{" "}
            <Link to="/" className="text-primary fw-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
