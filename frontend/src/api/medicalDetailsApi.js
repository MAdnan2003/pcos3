// frontend/src/api/medicalDetailsApi.js

const BASE_URL = "http://localhost:5000/api/medical-details";


export async function createMedicalDetails(data) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        status: 401,
        result: { success: false, message: "Not authenticated" }
      };
    }

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return { status: response.status, result };
  } catch (error) {
    console.error("Error calling createMedicalDetails:", error);
    return {
      status: 500,
      result: { success: false, message: "Network error" }
    };
  }
}


export async function getMyMedicalDetails() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        status: 401,
        result: { success: false, message: "Not authenticated" }
      };
    }

    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();
    return { status: response.status, result };
  } catch (error) {
    console.error("Error calling getMyMedicalDetails:", error);
    return {
      status: 500,
      result: { success: false, message: "Network error" }
    };
  }
}
