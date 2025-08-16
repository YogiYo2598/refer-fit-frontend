import apiHandler from './axios';


const API_BASE = 'http://localhost:5000/api/auth';


export const getOTP = async (phone) => {
  const response = await fetch(`${API_BASE}/mrequest-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // important if you're using cookies
    body: JSON.stringify(phone)
  });

  // if (!response.ok) {
  //   console.log(response)
  //   throw new Error("Failed to send OTP!");
  // }

  if (response.status === 400) {
    throw new Error("Phone Number is required");
  } else if (response.status === 401) {
    // User does not exist, so no OTP is sent
    throw new Error("401");
  } else if (!response.ok) {
    throw new Error("500");
  }

  return response.json(); // { user, new }
};


export const verifyOTP = async (reqBody) => {
  const response = await fetch(`${API_BASE}/mverify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // important if you're using cookies
    body: JSON.stringify(reqBody)
  });

  // console.log("IN API AUTH PAGE")
  // console.log(response)

  // if (!response.ok) {
  //   throw new Error("Failed to verify OTP!");
  // }

  return response.json(); // { user, new }
}

export const sendOTPLogin = async(phone) => {
  const response = await fetch(`${API_BASE}/mrequest-otp-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // important if you're using cookies
    body: JSON.stringify(phone)
  });

  if (response.status === 400) {
    throw new Error("Phone Number is required");
  } else if (response.status === 401) {
    // User does not exist, so no OTP is sent
    throw new Error("401");
  } else if (!response.ok) {
    throw new Error("500");
  }
  return response.json(); // { user, new }
}

export const loginUser = async (reqBody) => {
  try {
    // console.log("INSIDE AUTHAPI service")
  const response = await apiHandler.post('/auth/mverify-login', reqBody);
  // console.log("-----------------------")
  // console.log(response);
  // console.log("-----------------------")
  if (response.status == 401) {
    throw new Error("401");
  } else if (response.status == "402") {
    throw new Error("402");
  }
  return response;
  }
  catch (error) {
    // console.log(error);
    // console.log("ERROR----------")
    if (error.status == 401) {
      throw new Error("401");
    } else if (error.status == "402") {
      throw new Error("402");
    } else if (error.status == "400") {
      throw new Error("400");
    }
    // console.error('Login error:', error.response?.data || error.message);
  }
}

export const getUserAfterLogin = async () => {
  try {
    const response = await apiHandler.get('/auth/me');
    // console.log('in service try')
    return response;
  }
  catch (error) {
    return 'error'
  }
}


export const logoutUser = async (reqBody) => {
  try {
    const response = await apiHandler.post('/auth/logout')
    return response;
  } catch (error) {
    return 'error'
  }
}
