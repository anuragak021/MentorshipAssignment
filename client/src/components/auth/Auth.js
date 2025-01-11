import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
// New import (React Router v6)
// import { useNavigate } from 'react-router-dom';

import { adminSignIn } from "../../actions/admin";
import { mentorSignIn, mentorSignUp } from "../../actions/mentor";
import { studentSignIn, studentSignUp } from "../../actions/student";
import ArrowRight from "../../assets/icons/ArrowRight";
import loginBg from "../../assets/images/login.png";
import { toast, ToastContainer } from "react-toastify";
import { showToast } from "../toast/toast";
import { Checkbox, FormControlLabel } from "@mui/material";
import { CSSTransition } from "react-transition-group";
import ModalOverlay from "../modal/ModalOverlay";
import ForgotPasswordModal from "./ForgotPasswordModal";

const Auth = ({ location }) => {
    const [toggleLogin, setToggleLogin] = useState(false);
    const [fields, setFields] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        password: "",
        confirmPassword: "",
        enrollmentNo: "",
        semester: "",
        department: "",
    });
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (location.state === undefined) {
            history.goBack();
        }
    }, [location.state, history]);

    const resetFields = () => {
        setFields({
            firstName: "",
            lastName: "",
            middleName: "",
            email: "",
            password: "",
            confirmPassword: "",
            enrollmentNo: "",
            semester: "",
            department: "",
        });
    };

    const handleToggle = () => {
        setToggleLogin(!toggleLogin);
        resetFields();
    };

    const handleChange = (e) => {
        if (e.target.name === "semester" && e.target.value === "") return;
        setFields({ ...fields, [e.target.name]: e.target.value.trim() });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (location.state === "Admin") {
            dispatch(adminSignIn(fields, history));
        } else if (location.state === "Mentor") {
            if (toggleLogin) {
                if (fields.password !== fields.confirmPassword) {
                    showToast("error", "Passwords do not match", 5000, toast.POSITION.TOP_RIGHT);
                    return;
                }
                dispatch(mentorSignUp(fields, handleToggle));
            } else {
                dispatch(mentorSignIn(fields, history));
            }
        } else if (location.state === "Mentee") {
            if (toggleLogin) {
                if (fields.password !== fields.confirmPassword) {
                    showToast("error", "Passwords do not match", 5000, toast.POSITION.TOP_RIGHT);
                    return;
                }
                dispatch(studentSignUp(fields, handleToggle));
            } else {
                dispatch(studentSignIn(fields, history));
            }
        }
        resetFields();
    };

    const [showPass, setShowPass] = useState("password");
    const [FPEmail, setFPEmail] = useState({
        role: location.state,
        email: "",
    });

    const handlePasswordShowToggle = () => {
        setShowPass((prev) => (prev === "password" ? "text" : "password"));
    };

    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef(null);
    const overlayRef = useRef(null);

    return (
        <div className="w-full h-screen flex items-center">
            <CSSTransition
                nodeRef={overlayRef}
                in={showModal}
                timeout={300}
                classNames="overlay"
                unmountOnExit
            >
                <ModalOverlay nodeRef={overlayRef} />
            </CSSTransition>
            <CSSTransition
                nodeRef={modalRef}
                in={showModal}
                timeout={300}
                classNames="modal"
                unmountOnExit
            >
                <ForgotPasswordModal
                    nodeRef={modalRef}
                    setShowModal={setShowModal}
                    setFPEmail={setFPEmail}
                    FPEmail={FPEmail}
                />
            </CSSTransition>
            <div className="flex-3 bg-white h-full flex flex-col items-center justify-center">
                <div className="w-full">
                    <h1 style={{ fontSize: "50px" }} className="w-full text-center">
                        <span className="text-blue-500">{location.state}</span>{" "}
                        {toggleLogin ? "sign-up" : "sign-in"}
                    </h1>
                </div>
                <img src={loginBg} alt="" className="w-1/2" />
            </div>
            <div className="flex-2 bg-gray-600 h-full flex items-center justify-center">
                <div className="w-96">
                    <form className="" onSubmit={handleSubmit}>
                        {toggleLogin && (
                            <div className="grid grid-cols-3 gap-2">
                                <div className="flex flex-col mb-6">
                                    <label htmlFor="firstName" className="mb-2 text-white">
                                        First name
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={fields.firstName}
                                        onChange={handleChange}
                                        required
                                        className="rounded-md border-none"
                                    />
                                </div>
                                <div className="flex flex-col mb-6">
                                    <label htmlFor="middleName" className="mb-2 text-white">
                                        Middle name
                                    </label>
                                    <input
                                        id="middleName"
                                        name="middleName"
                                        type="text"
                                        value={fields.middleName}
                                        onChange={handleChange}
                                        className="rounded-lg border-none"
                                    />
                                </div>
                                <div className="flex flex-col mb-6">
                                    <label htmlFor="lastName" className="mb-2 text-white">
                                        Last name
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={fields.lastName}
                                        onChange={handleChange}
                                        required
                                        className="rounded-lg border-none"
                                    />
                                </div>
                            </div>
                        )}
                        {toggleLogin && location.state === "Mentee" && (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col mb-6">
                                    <label htmlFor="enrollmentNo" className="mb-2 text-white">
                                        Enrollment No.
                                    </label>
                                    <input
                                        id="enrollmentNo"
                                        name="enrollmentNo"
                                        type="text"
                                        value={fields.enrollmentNo.toUpperCase()}
                                        onChange={handleChange}
                                        required
                                        className="rounded-lg border-none"
                                    />
                                </div>
                                <div className="flex flex-col mb-6">
                                    <label htmlFor="semester" className="mb-2 text-white">
                                        Semester
                                    </label>
                                    <select
                                        id="semester"
                                        name="semester"
                                        className="rounded-lg border-none"
                                        value={fields.semester}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select semester</option>
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i} value={`${i + 1}st semester`}>
                                                {i + 1}st semester
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        {toggleLogin && (
                            <div className="flex flex-col mb-6">
                                <label htmlFor="department" className="mb-2 text-white">
                                    Department
                                </label>
                                <select
                                    id="department"
                                    name="department"
                                    className="rounded-lg border-gray-300"
                                    value={fields.department}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select department</option>
                                    <option value="Computer Science & Engineering">
                                        Computer Science & Engineering
                                    </option>
                                </select>
                            </div>
                        )}
                        <div className="flex flex-col mb-6">
                            <label htmlFor="email" className="mb-2 text-white">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="text"
                                name="email"
                                value={fields.email}
                                onChange={handleChange}
                                required
                                className="rounded-lg border-none"
                            />
                        </div>
                        <div className="flex flex-col mb-1">
                            <label htmlFor="password" className="mb-2 text-white">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type={showPass}
                                value={fields.password}
                                onChange={handleChange}
                                required
                                className="rounded-lg border-none"
                            />
                        </div>
                        {toggleLogin && (
                            <div className="flex flex-col mb-1">
                                <label htmlFor="confirmPassword" className="mb-2 text-white">
                                    Confirm password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPass}
                                    value={fields.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="rounded-lg border-none"
                                />
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={showPass === "text"}
                                        onChange={handlePasswordShowToggle}
                                        sx={{ color: "white" }}
                                    />
                                }
                                label={<span className="text-white">Show Password</span>}
                            />
                            {!toggleLogin && (
                                <p
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() => setShowModal(true)}
                                >
                                    Forgot Password?
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-700 rounded-lg text-white py-2 mt-3"
                        >
                            {toggleLogin ? "Sign Up" : "Sign In"}
                        </button>
                    </form>
                    <div className="flex items-center justify-center mt-4 text-white">
                        <span>
                            {toggleLogin
                                ? "Already have an account? "
                                : "Don't have an account? "}
                        </span>
                        <button
                            onClick={handleToggle}
                            className="ml-2 text-blue-500 hover:underline"
                        >
                            {toggleLogin ? "Sign In" : "Sign Up"}
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Auth;
