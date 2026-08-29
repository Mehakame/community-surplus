const API_URL = "https://community-surplus.onrender.com";

// =========================
// AUTH
// =========================

export async function registerUser(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return response.json();
}

export async function loginUser(userData) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return response.json();
}
export async function getMyProfile() {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/auth/profile`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.json();
}
export async function forgotPassword(email) {
    const response = await fetch(
        `${API_URL}/auth/forgot-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        }
    );

    return response.json();
}


export async function resetPassword(token, password) {
    const response = await fetch(
        `${API_URL}/auth/reset-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token,
                password
            })
        }
    );

    return response.json();
}

// =========================
// RESOURCES
// =========================

export async function getResources(category = "") {
    let url = `${API_URL}/resources`;

    if (category) {
        url += `?category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url);

    return response.json();
}


export async function getMyResources() {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/resources/my/resources`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.json();
}


export async function createResource(resourceData) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/resources`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(resourceData)
        }
    );

    return response.json();
}


// =========================
// RESOURCE DETAILS
// =========================

export async function getResourceById(resourceId) {
    const response = await fetch(
        `${API_URL}/resources/${resourceId}`
    );

    return response.json();
}


// =========================
// NEARBY RESOURCES
// =========================

export async function getNearbyResources(
    latitude,
    longitude,
    radius = 10
) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/resources/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.json();
}


// =========================
// REQUEST RESOURCE
// =========================

export async function requestResource(
    resourceId,
    message
) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/requests/${resourceId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                message
            })
        }
    );

    return response.json();
}


// =========================
// MY REQUESTS
// =========================

export async function getMyRequests() {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/requests/my`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.json();
}


// =========================
// RECEIVED REQUESTS
// =========================

export async function getResourceRequests() {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/requests/received`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.json();
}


// =========================
// ACCEPT / REJECT REQUEST
// =========================

export async function updateRequestStatus(
    requestId,
    status
) {
    const token = localStorage.getItem("token");

    const action =
        status === "ACCEPTED"
            ? "accept"
            : "reject";

    const response = await fetch(
        `${API_URL}/requests/${requestId}/${action}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.json();
}
export async function getMyResourceCount() {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/resources/my/count`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.json();
}
