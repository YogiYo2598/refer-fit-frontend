const API_BASE = '/api';

export const requestOtp = (phone) =>
  fetch(`${API_BASE}/auth/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ phone })
  });

export const verifyOtp = (phone, otp) =>
  fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ phone, otp })
  });

export const createReferral = (payload) =>
  fetch(`${API_BASE}/referrals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });

export const uploadResume = (formData) =>
  fetch(`${API_BASE}/upload/resume`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });