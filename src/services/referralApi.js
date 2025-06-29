const API_BASE = 'http://localhost:5000/api/referrals';

// ✅ Create a new referral request
export const createReferral = async (data) => {
  const res = await fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // required for JWT cookie auth
    body: JSON.stringify(data)
  });
  return res.json();
};

// ✅ Get referrals created by the logged-in user
export const getMyReferrals = async (userId) => {
  const res = await fetch(`${API_BASE}/my?userId=${userId}`, {
    credentials: 'include'
  });
  return res.json();
};

// ✅ Get referrals submitted to my company (if referrer)
export const getIncomingReferrals = async (company) => {
  const res = await fetch(`${API_BASE}/incoming?company=${company}`, {
    credentials: 'include'
  });
  return res.json();
};

// ✅ Mark a referral as referred/rejected
export const updateReferralStatus = async (id, status) => {
  const res = await fetch(`${API_BASE}/${id}/mark`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status })
  });
  return res.json();
};