const API_BASE = '/api/companies';

export const getAllCompanies = async() => {
    const response = await fetch(`${API_BASE}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        throw new Error("Failed getting company details");
    }

    return response.json();
}


export const getNetworkCompanies = async() => {
    const response = await fetch(`${API_BASE}/network`, {
        method : "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    })

    if(!response.ok)  {
        throw new Error("Failed getting company details");
    }
    return response.json();
}