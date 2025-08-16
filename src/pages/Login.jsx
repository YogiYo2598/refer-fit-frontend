import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOTP, verifyOTP, loginUser, getUserAfterLogin, sendOTPLogin } from "../services/authApi";
import apiHandler from '../services/axios'
import { useAuth } from '../context/authContext';

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpVerify, setOtpVerify] = useState(false);
    const [verifyRequested, setVerifyRequested] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loader, setLoader] = useState(false)
    const [sendingOTPFailed, setSendingOTPFailed] = useState(false);
    const navigate = useNavigate();

    const isValidPhone = /^\d{10}$/.test(phone);
    const isValidOtp = /^\d{4}$/.test(otp);

    const { refreshUser, user } = useAuth();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await apiHandler.get('/auth/me');
                // If successful, user is already logged in
                await refreshUser?.(); // optional: update context
                navigate('/dashboard');
            } catch (err) {
                // Not logged in — stay on login page
            }
        };

        checkLogin();
    }, []);

    const handleVerify = async () => {
        setOtpVerified(true);
        setLoader(true);
        try {
            const verifyData = {
                phone: "91" + phone,
                otp: otp
            }
            // console.log(verifyData)
            const response = await loginUser(verifyData);
            // console.log(response);
            await refreshUser();
            // console.log("Here in Try block")
            // const user = await getUserAfterLogin();
            setTimeout(() => {
                setLoader(false);
                setLoading(true);
                navigate("/dashboard");
            }, 1000);
    }
        catch (error) {
            setLoader(false);
            // setLoading(true);
            // console.log("CATCH BLOCK")
            // console.log(error)
            // Invalid OTP 
            if (error.message == "401") {
                window.alert("Invalid OTP. Please double-check and try again.");
            }
            // User does not exist
            else if (error.message == "402") {
                window.alert('User does not exist with given phone number, Please register')
                navigate('/')
            } else if (error.message == "400") {
                window.alert('Invalid OTP. Please double-check and try again.');
            }
        // try {
        //     if (error.response.data) {
        //         const status = error.response.status;
        //         if (status == 401) {
        //             window.alert('User does not exist with given phone number, Please register')
        //             navigate('/')
        //         }

        //     }
        // } catch (error) { }

    }
};

const handleSendOTP = async () => {
    setSendingOTPFailed(false);
    setLoader(true);
    try {
        const req_data = {
            phone: "91" + phone
        }
        const response = await sendOTPLogin(req_data);
        setOtpVerify(true);
        setLoader(false);
        setSendingOTPFailed(false);
    } catch (error) {
        if (error.message === "401") {
            window.alert("Phone number does not exist, please register!")
            navigate("/")
        }
        setLoader(false);
        setSendingOTPFailed(true);
    }
};

const handleCancel = () => {
    const confirmed = window.confirm("Are you sure you want to cancel and go back to home?");
    if (confirmed) {
        navigate("/");
    }
};

return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-blue-100 px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 sm:p-10 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-blue-600">Welcome Back</h1>
                <p className="text-gray-500 text-sm mt-1">Login to access your dashboard</p>
            </div>



            {loading && (
                <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700 text-center font-medium">
                    ✅ Verified! Redirecting to your dashboard...
                </div>
            )}

            {loader && (
                <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
            )}

            {!loading && (
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={`w-full px-4 py-2 border ${phone && !isValidPhone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                            placeholder="Enter 10-digit phone"
                        />
                    </div>
                    {!otpVerify &&
                        (<div className="space-y-1">
                            <button
                                type="submit"
                                onClick={handleSendOTP}
                                disabled={!isValidPhone}
                                className={`w-full px-4 py-2  rounded-lg font-semibold text-white transition ${isValidPhone ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                Get OTP
                            </button>
                        </div>)}
                    {sendingOTPFailed && <p className="text-red-600 text-sm font-medium">❌ Failed to send OTP! Please try again after sometime</p>}
                    {otpVerify && (
                        <div className="space-y-1">
                            {/* <p className="text-green-600 text-sm font-medium">✅ OTP sent on whatsapp!</p> */}
                            <label className="text-sm font-medium text-gray-700">Enter OTP sent on whatsapp</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className={`w-full px-4 py-2 border ${otp && !isValidOtp ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                                placeholder="4-digit code"
                            />
                            <div className="text-right">
                                <button type="button" onClick={handleSendOTP} className="text-sm text-blue-600 hover:underline">Resend OTP</button>
                            </div>
                        </div>
                    )}

                    {otpVerify && (
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                onClick={handleVerify}
                                disabled={!isValidOtp}
                                className={`w-full sm:w-auto flex-1 py-3 rounded-lg font-semibold text-white transition ${isValidOtp ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                Verify & Login
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="w-full sm:w-auto flex-1 py-3 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            )}
        </div>
    </div>
);
}