const API_BASE_URL = "https://group9-carboniq.onrender.com/auth"; // deployed backend URL


// Helper function for consistent error and reponse handing
const handleResponse = async (response) => {
    const contentType = response.headers.get("content-type");

    // Handles unexpected HTML error pages from Flask
    if (contentType && contentType.includes("text/html")) {
        const htmlError = await response.text();
        console.error("Server return HTML instead of JSON:", htmlError.slice(0, 150));
        throw new Error(`Server error (${response.status})`);
    }

    // Safely parse JSON response
    const data = contentType && contentType.includes("application/json")
        ? await response.json()
        : {};

    // Checks for HTTP errors
    if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`)
    }

    return data;
}

export const signup = async ({ email, password }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("Signup Error:", error.message);
        throw error;
    }
};

export const login = async ({ email, password }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("Login Error:", error.message);
        throw error;
    }
};

