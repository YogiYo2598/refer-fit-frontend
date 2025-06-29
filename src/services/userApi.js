const API_BASE = 'http://localhost:5000/api/users';


export const createUser = async (userData) => {
    const response = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // important if you're using cookies
      body: JSON.stringify(userData)
    });
  
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
  
    return response.json(); // { user, new }
  };