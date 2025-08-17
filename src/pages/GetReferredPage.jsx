import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userApi"
import { getOTP, verifyOTP } from "../services/authApi";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [status, setStatus] = useState("fresher");
    const [verifyPhone, setVerifyPhone] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [otpPhone, setOtpPhone] = useState("");
    const [otpEmail, setOtpEmail] = useState("");
    const [isPhoneOtpVerified, setIsPhoneOtpVerified] = useState(false);
    const [isEmailOtpVerified, setIsEmailOtpVerified] = useState(false);
    const [isPhoneVerifyClicked, setIsPhoneVerifyClicked] = useState(false);
    const [isEmailVerifyClicked, setIsEmailVerifyClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const isValidPhone = /^\d{10}$/.test(phone);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidOtp = (otp) => /^\d{4}$/.test(otp);

    const isFormValid =
        name.trim() !== "" &&
        isValidPhone &&
        isValidEmail &&
        isPhoneOtpVerified &&
        (status === "fresher" || (status === "experienced" && company.trim() !== ""));

    const handleResendPhone = () => {
        if (!isPhoneOtpVerified) {
            setOtpPhone("");
            setIsPhoneOtpVerified(false);
        }
    };

    const handleResendEmail = () => {
        if (!isEmailOtpVerified) {
            setOtpEmail("");
            setIsEmailOtpVerified(false);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        // setSuccess(true);
        // setTimeout(() => {
        //     setLoading(false);
        //     navigate("/dashboard");
        // }, 2000);
        // e.preventDefault();

        const userData = {
            name: name,
            phone: phone,
            email: email,
            company: company,
            role: 'requester',
            type: status
        }

        try {
            const response = await createUser(userData);
            // console.log(response)
            if (response['new'] == false) {
                window.alert("User already exists, please login!!");
                navigate('/login')
            }
            else {
                // const response = await loginUser(phone);
                setLoading(false);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            }
        }
        catch (error) {
            window.alert("Failed to create User! Please try again!")
            setLoading(false);
        }
    };

    const handleCancel = () => {
        const confirmed = window.confirm("Are you sure you want to cancel and return to home page?");
        if (confirmed) {
            navigate("/");
        }
    };

    const requestOTP = async () => {
        setLoading(true)
        const req_data = {
            phone: "91" + phone
        }
        const response = await getOTP(req_data);
        if (response.status != 500) {
            setVerifyPhone(true);
            setIsPhoneVerifyClicked(true);
            setLoading(false)
        }
    };

    const verifyMOTP = async () => {
        setLoading(true);
        const req_data = {
            phone: "91" + phone,
            code: otpPhone
        }
        const response = await verifyOTP(req_data);
        if (!response['ok']) {
            window.alert("Invalid OTP, Please enter right OTP");
            setLoading(false);
        } else {
            setIsPhoneOtpVerified(true);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 px-4 py-10 flex flex-col items-center">
            <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow">
                <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Register</h2>

                {success && (
                    <div className="mb-4 p-4 rounded-md bg-green-100 text-green-700 text-center font-medium">
                        🎉 Registration successful! Redirecting to your dashboard...
                    </div>
                )}

                {loading && (
                    <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    </div>
                )}

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Name *</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Phone Number *</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={`flex-1 px-4 py-2 border rounded-md ${phone && !isValidPhone ? 'border-red-500' : ''}`}
                                placeholder="Enter 10-digit phone number"
                            />
                            <button type="button" onClick={requestOTP} disabled={!isValidPhone || isPhoneVerifyClicked} className={`px-4 py-2 rounded-md text-white ${!isValidPhone || isPhoneVerifyClicked ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                Verify
                            </button>
                        </div>
                        {verifyPhone && (
                            <div className="mt-2 space-y-2">
                                <p className="text-green-600 text-sm font-medium">✅ OTP sent on whatsapp!</p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otpPhone}
                                        onChange={(e) => setOtpPhone(e.target.value)}
                                        className={`flex-1 px-4 py-2 border rounded-md ${otpPhone && !isValidOtp(otpPhone) ? 'border-red-500' : ''}`}
                                        disabled={isPhoneOtpVerified}
                                    />
                                    <button
                                        type="button"
                                        onClick={verifyMOTP}
                                        disabled={!isValidOtp(otpPhone) || isPhoneOtpVerified}
                                        className={`px-4 py-2 rounded-md text-white ${isValidOtp(otpPhone) && !isPhoneOtpVerified ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                    >
                                        Verify OTP
                                    </button>
                                    <button type="button" onClick={requestOTP} disabled={isPhoneOtpVerified} className={`px-4 py-2 rounded-md ${isPhoneOtpVerified ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                        Resend
                                    </button>
                                </div>
                                {isPhoneOtpVerified && <p className="text-green-600 text-sm font-medium">✅ Phone number verified</p>}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email *</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`flex-1 px-4 py-2 border rounded-md ${email && !isValidEmail ? 'border-red-500' : ''}`}
                                placeholder="example@email.com"
                            />
                            {/* <button type="button" onClick={() => { setVerifyEmail(true); setIsEmailVerifyClicked(true); }} disabled={!isValidEmail || isEmailVerifyClicked} className={`px-4 py-2 rounded-md text-white ${!isValidEmail || isEmailVerifyClicked ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                Verify
                            </button> */}
                        </div>
                        {/* {verifyEmail && (
                            <div className="mt-2 space-y-2">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otpEmail}
                                        onChange={(e) => setOtpEmail(e.target.value)}
                                        className={`flex-1 px-4 py-2 border rounded-md ${otpEmail && !isValidOtp(otpEmail) ? 'border-red-500' : ''}`}
                                        disabled={isEmailOtpVerified}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsEmailOtpVerified(isValidOtp(otpEmail))}
                                        disabled={!isValidOtp(otpEmail) || isEmailOtpVerified}
                                        className={`px-4 py-2 rounded-md text-white ${isValidOtp(otpEmail) && !isEmailOtpVerified ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                    >
                                        Verify OTP
                                    </button>
                                    <button type="button" onClick={handleResendEmail} disabled={isEmailOtpVerified} className={`px-4 py-2 rounded-md ${isEmailOtpVerified ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                        Resend
                                    </button>
                                </div>
                                {isEmailOtpVerified && <p className="text-green-600 text-sm font-medium">✅ Email verified</p>}
                            </div>
                        )} */}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Status *</label>
                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="fresher">Fresher</option>
                                <option value="experienced">Professional</option>
                            </select>
                            <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                ▼
                            </div>
                        </div>
                    </div>

                    {status === "experienced" && (
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Current Company *</label>
                            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={!isFormValid || loading}
                            className={`w-full sm:w-auto flex-1 py-3 rounded-md font-semibold text-white transition ${loading ? 'bg-green-600' : isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    Registering...
                                </div>
                            ) : "Register"}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-full sm:w-auto flex-1 py-3 rounded-md bg-red-100 text-red-700 font-semibold hover:bg-red-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
                <p className="text-center mt-2 text-sm text-gray-600">By Registering, I consent to receive referral updates and follow-ups via WhatsApp *</p>
                {/* <label className="flex text-center items-center gap-2 text-sm mt-2 text-gray-600">
                    <input type="checkbox" required value="checked" />
                    I consent to receive referral updates and follow-ups via WhatsApp.
                </label> */}
                <p className="text-center mt-6 text-sm text-gray-600">
                    Already registered?{' '}
                    <button onClick={() => navigate("/login")} className="text-blue-600 font-medium hover:underline">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}
