import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { createReferral, getMyReferrals, getIncomingReferrals, updateReferralStatus, deleteReferralRequest } from "../services/referralApi";
import { logoutUser } from "../services/authApi";
import { useAuth } from '../context/authContext';
import { uploadResume } from "../services/uploadApi";
import { updateUserResumeDetails } from "../services/userApi";
import { getAllCompanies } from "../services/companyApi";

export default function DashboardPage() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [company, setCompany] = useState("");
    const [jobId, setJobId] = useState("");
    const [resume, setResume] = useState(null);
    const [resumeUpdated, setResumeUpdated] = useState(false);
    const [referredStatus, setReferredStatus] = useState({});
    const dropdownRef = useRef(null);
    const effectRan = useRef(false);
    const navigate = useNavigate();
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const [myRequests, setMyRequests] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);

    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [incomingPage, setIncomingPage] = useState(1);
    const pageSize = 5;

    const [sortBy, setSortBy] = useState("date");
    const { user, setUser } = useAuth();

    const [isExperienced, setisExperienced] = useState(true);
    const [resumeAvailable, setResumeAvailable] = useState(false);


    const fetchData = async () => {
        setLoading(true);
        const myReferralReqBody = {
            userId: user.id
        }
        const myReferralRequests = await getMyReferrals(user.id);
        setMyRequests([...myReferralRequests].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        ));

        const allCompanyData = await getAllCompanies();
        // console.log(allCompanyData);

        if (user.company !== "") {
            const myIncomingReferralsBody = {
                'company': user.company
            }
            const myIncomingReferrals = await getIncomingReferrals(user.company);
            setIncomingRequests(myIncomingReferrals)
        } else {
            setIncomingRequests([]);
            setisExperienced(false);
        }

        if (user.resumeName != null) {
            setResumeAvailable(true);
        }
        setLoading(false);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        // This is added to make sure data is only loaded once
        if (!effectRan.current) {
            fetchData();
            effectRan.current = true;
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const paginatedMyReferrals = myRequests.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const paginatedIncomingReferrals = incomingRequests.slice(
        (incomingPage - 1) * pageSize,
        incomingPage * pageSize
    );

    async function hashThreeInputs(input1, input2, input3) {
        const combined = `${input1}${input2}${input3}`;
        const encoded = new TextEncoder().encode(combined);
        const buffer = await crypto.subtle.digest('SHA-256', encoded);
        const hashArray = Array.from(new Uint8Array(buffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex + ".pdf";
    }

    const handleDeleteReferral = async (id) => {
        const response = await deleteReferralRequest(id);
        fetchData();
    }

    const handleNewReferralSubmit = async () => {
        setLoading(true);

        try {

            // checking for same referral/JOB ID
            const exists = myRequests.some((req) => req.jobId === jobId);
            if (exists) {
                window.alert("You have already raised request for this jobId!");
                setLoading(false);
                return;
            }

            if (user.company.toLowerCase() == company.toLowerCase()) {
                window.alert("Not allowed to create referral for the company you are working!");
                setLoading(false);
                return;
            }

            // If resume if uploaded, no referrals request can be raised
            if (user.resumeName === null && resume === null) {
                window.alert("Please upload resume");
                setLoading(false);
                return;
            }

            // all validations related to resume
            let uploadResponse = user.resumeURL;
            if (resumeUpdated) {
                if (resume.size > 5 * 1024 * 1024) {
                    window.alert("File size should be less than 5MB!");
                    setLoading(false);
                    return;
                }
                const fileName = user.resumeName !== null ? user.resumeName : await hashThreeInputs(user.id, user.name, user.phone);
                uploadResponse = await uploadResume(resume, fileName);
                const resumeData = {
                    resumeName: fileName,
                    resumeURL: uploadResponse
                }
                updateUserResumeDetails(user.id, resumeData);
            } else {
                uploadResponse = user.resumeURL;
            }

            const createReferralData = {
                userId: user.id,
                jobId: jobId,
                company: company,
                resumeUrl: uploadResponse
            }



            await createReferral(createReferralData);
            setJobId('');
            setCompany('');
            setShowModal(false);
            fetchData();
            setLoading(false);
            setResumeAvailable(true);
        } catch (error) {
            window.alert('Failed to create Referral Request! Pleae try again')
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        const response = await logoutUser();
        navigate('/')
    }

    const handleStatusUpdate = async (index, value) => {
        setLoading(true);
        // console.log("here")
        // console.log(user);
        try {
            const payload = {
                status: value,
                referredBy: user.id
            }
            const response = await updateReferralStatus(index, payload);
            fetchData();
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
        }
    };

    const isReferralFormValid = company.trim() !== "" && jobId.trim() !== "";

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-100">
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <img src="/logos/refer_fit.png" alt="Logo" className="h-8 w-8" />
                    <h1 className="text-2xl font-extrabold text-blue-700">REFER FIT</h1>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <img
                        src="/logos/profile.jpg"
                        alt="Profile"
                        className="h-10 w-10 rounded-full cursor-pointer border"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                            {/* <a href="/edit-profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Edit Profile</a> */}
                            <a onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</a>
                        </div>
                    )}
                </div>
            </header>

            <main className="p-4 sm:p-6 max-w-6xl mx-auto space-y-10">
                {loading && (
                    <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    </div>
                )}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-blue-700">My Referral Requests {myRequests.length > 0 && ` (Total: ${myRequests.length})`}</h2>
                        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">+ New Request</button>
                    </div>

                    <div className="bg-white shadow rounded-lg overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">Company</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">Job ID</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">Created Date</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Delete Request</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedMyReferrals.map((req, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="px-4 py-2 text-sm font-medium">
                                            <span
                                                title="test"
                                                // title={req.status === 'referred' ? `Referred by ${req.referred_by_user}` : ''}
                                                className={`px-2 py-1 rounded-full text-white text-xs ${req.status === 'referred' ? 'bg-green-500' : req.status === 'position_closed' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                            >
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-gray-700">{req.company}</td>
                                        <td className="px-4 py-2 text-gray-700">{req.jobId}</td>
                                        <td className="px-4 py-2 text-gray-700">{new Date(req.createdAt).toLocaleDateString("en-IN", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}</td>
                                        <td className="px-4 py-2  text-center">
                                            {/* <button
                                                onClick={() => handleDeleteReferral(req.id)}
                                                className="text-red-500 hover:text-red-700 text-lg font-bold"
                                                title="Delete this request"
                                            >
                                                ❌
                                            </button> */}

                                            {confirmDeleteId === req.id ? (
                                                <div className="gap-2 text-center">
                                                    <button
                                                        onClick={() => handleDeleteReferral(req.id)}
                                                        className="text-red-600 font-semibold text-xs mr-[20px]"
                                                    >
                                                        Yes
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDeleteId(null)}
                                                        className="text-gray-500 font-semibold text-xs"
                                                    >
                                                        No
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmDeleteId(req.id)}
                                                    className="text-red-500 hover:text-red-700 text-lg font-bold"
                                                    title="Delete this request"
                                                >
                                                    ❌
                                                </button>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center gap-2 mt-4 mb-6">
                        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-blue-600 rounded text-white disabled:bg-gray-400 disabled:opacity-50">Prev</button>
                        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage * pageSize >= myRequests.length} className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400 disabled:opacity-50">Next</button>
                    </div>
                </section>

                {isExperienced && (
                    <section>
                        <h2 className="text-2xl font-bold text-blue-700 mb-4">Referral Requests to My Company {incomingRequests.length > 0 && ` (Total: ${incomingRequests.length})`}</h2>
                        <div className="bg-white shadow rounded-lg overflow-x-auto">
                            <table className="w-full min-w-[800px] text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 w-[50px] text-sm font-semibold text-gray-700">Action</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Candidate Name</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Email</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Job ID</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Resume</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Requested On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedIncomingReferrals.map((req, idx) => (
                                        <tr key={req.id} className="border-t">
                                            <td className="px-2 py-2 w-[50px]">
                                                <select
                                                    onChange={(e) => handleStatusUpdate(req.id, e.target.value)}
                                                    defaultValue=""
                                                    className="px-2 py-1 rounded-md border bg-white text-sm"
                                                >
                                                    <option value="" disabled>
                                                        Update status
                                                    </option>
                                                    <option value="referred">Referred</option>
                                                    <option value="position_closed">Position Closed</option>
                                                    <option value="already_referred">Already Referred</option>
                                                    {/* <option value="need_more_details">Need More Details</option> */}
                                                </select>
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">{req.User.name}</td>
                                            <td className="px-4 py-2 text-gray-700">{req.User.email}</td>
                                            <td className="px-4 py-2 text-gray-700">{req.jobId}</td>
                                            <td className="px-4 py-2">
                                                <a
                                                    href={req.resumeUrl}
                                                    className="text-blue-600 hover:underline text-sm"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Download
                                                </a>
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">{new Date(req.createdAt).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric"
                                            })}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center gap-2 mt-4 mb-6">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={incomingPage === 1} className="px-3 py-1 bg-blue-600 rounded text-white disabled:bg-gray-400 disabled:opacity-50">Prev</button>
                            <button onClick={() => setCurrentPage(p => p + 1)} disabled={incomingPage * pageSize >= incomingRequests.length} className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400 disabled:opacity-50">Next</button>
                        </div>
                    </section>
                )}
            </main>

            {/* Create Referral Request Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-blue-600 mb-4">Create Referral Request</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job ID *</label>
                                <input
                                    type="text"
                                    value={jobId}
                                    onChange={(e) => setJobId(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume * <b>only PDF(max. 5MB) </b></label>
                                {resumeAvailable && (<label className="text-green-700"><b>Resume found in our records. Upload to replace the existing one if needed.</b></label>)}
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => { setResume(e.target.files[0]); setResumeUpdated(true); }}
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                                <button
                                    // onClick={() => {
                                    //     setShowModal(false);
                                    //     alert("Referral submitted successfully!");
                                    // }}
                                    onClick={handleNewReferralSubmit}
                                    disabled={!isReferralFormValid}
                                    className={`px-4 py-2 rounded-md text-white ${isReferralFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                >
                                    Submit Referral
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


