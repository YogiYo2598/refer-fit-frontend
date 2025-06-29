import apiHandler from './axios';


const API_BASE = 'http://localhost:5000/api/auth';


export const getOTP = async (phone) => {
  const response = await fetch(`${API_BASE}/request-wa-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // important if you're using cookies
    body: JSON.stringify(phone)
  });

  if (!response.ok) {
    throw new Error("Failed to send OTP!");
  }

  return response.json(); // { user, new }
};


export const verifyOTP = async (reqBody) => {
  const response = await fetch(`${API_BASE}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // important if you're using cookies
    body: JSON.stringify(reqBody)
  });

  if (!response.ok) {
    throw new Error("Failed to verify OTP!");
  }

  return response.json(); // { user, new }
}


export const loginUser = async (phone) => {
  // try {
    const response = await apiHandler.post('/auth/login', { phone });
    if (response.status != 200) {
      throw new Error("Failed to Login User!");
    }
    return response;
  // }
  // catch (error) {
  //   console.error('Login error:', error.response?.data || error.message);
  // }

}

export const getUserAfterLogin = async() => {
  try {
    const response = await apiHandler.get('/auth/me');
    console.log('in service try')
    return response;
  }
  catch(error) {
    return 'error'
  }
}


export const logoutUser = async (reqBody) => {
  try {
    const response = await apiHandler.post('/auth/logout')
    return response;
  } catch(error) {
    return 'error'
  }
}
