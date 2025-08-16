const API_BASE = 'http://localhost:5000/api/companies';

export const getAllCompanies = async(req, res) => {
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