import { API_CONFIG } from "./config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const registerProBuddy = async (payload: any) => {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/auth/proBuddySignup`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || "Failed to register ProBuddy");
  return data;
};

export const uploadProBuddyPhoto = async (proBuddyId: string, photo: File) => {
  const formData = new FormData();
  formData.append("proBuddyId", proBuddyId);
  formData.append("photo", photo);

  const response = await fetch(`${API_CONFIG.baseUrl}/api/proBuddy/uploadPhoto`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || "Failed to upload photo");
  return data;
};

export const uploadProBuddyIdCardPhoto = async (proBuddyId: string, photo: File) => {
  const formData = new FormData();
  formData.append("proBuddyId", proBuddyId);
  formData.append("photo", photo);

  const response = await fetch(`${API_CONFIG.baseUrl}/api/proBuddy/uploadIdCardPhoto`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Accept": "application/json"
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || "Failed to upload ID Card");
  return data;
};