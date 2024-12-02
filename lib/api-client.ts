// frontend/lib/api-client.ts
import axios from "axios";

const API_BASE_URL = "https://cv-builder-backend-production.up.railway.app"; // Update with your backend URL

export const registerUser = async (data: { 
  full_name: string; 
  email: string; 
  password: string; 
  confirm_password: string; 
}) => {
  return axios.post(`${API_BASE_URL}/auth/register`, data);
};

export const loginUser = async (data: { 
  email: string; 
  password: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
  if (response.data?.data?.access_token) {
    localStorage.setItem('token', response.data.data.access_token);
  }
  
  return response;
};

export const verifyEmail = async (token: string) => {
  return axios.get(`${API_BASE_URL}/verify-email`, {
    params: { token },  // Send the token as a query parameter
  });
};

export const resendVerification = async (email: string) => {
  return axios.post(`${API_BASE_URL}/auth/resend-verification`, {
    email: email
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
// Modify logoutUser method to use Axios and remove token
export const logoutUser = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      // Send a POST request to the backend's logout endpoint
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout failed", error);
    }
  }
  
  // Remove token from localStorage after logout
  localStorage.removeItem('token');
  
};

  // CV API calls
interface CVData {
  cv_data: any;
  template_id: string;
}

// Create new CV
export const createCV = async (templateId: string) => {
  const response = await axios.post(`${API_BASE_URL}/api/cv`, { 
    template_id: templateId 
  });
  return response.data;
};

export const saveCVDraft = async (cvId: string, cvData: any, templateId: string) => {
  const response = await axios.put(`${API_BASE_URL}/api/cv/${cvId}`, {
    cv_data: cvData,
    template_id: templateId
  });
  return response.data;
};

// Get single CV
export const getCV = async (cvId: string) => {
  return axios.get(`${API_BASE_URL}/api/cv/${cvId}`);
};

// Get all user's CVs
export const getUserCVs = async () => {
  return axios.get(`${API_BASE_URL}/api/cv`);
};

// Update CV
export const updateCV = async (cvId: string, cvData: any) => {
  return axios.put(`${API_BASE_URL}/api/cv/${cvId}`, cvData);
};

// Delete CV
export const deleteCV = async (cvId: string) => {
  return axios.delete(`${API_BASE_URL}/api/cv/${cvId}`);
};

// Update your existing preview function to use axios
// frontend/lib/api-client.ts

// Update these functions to use axios instead of fetch
export const previewCV = async (cvData: any, templateId: string) => {
  const response = await axios.post(`${API_BASE_URL}/api/cv/preview`, {
    cv_data: cvData,
    template_id: templateId
  });
  return response.data.html;
};

export const exportCV = async (cvData: any, templateId: string, format: 'pdf' | 'docx') => {
  const response = await axios.post(
    `${API_BASE_URL}/api/cv/export/${format}`,
    {
      cv_data: cvData,
      template_id: templateId
    },
    {
      responseType: 'blob'
    }
  );

  // Handle file download
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cv.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Update save draft function to use axios



// Add axios interceptor for token handling
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error interceptor for handling auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      const detail = error.response?.data?.detail;
      // Leave handling of specific cases (like unverified email) to the calling function
      if (detail !== "Please verify your email first") {
        localStorage.removeItem("token"); // Clear token for general auth failures
      }
    }

    return Promise.reject(error); // Propagate the error to be handled in `onSubmit`
  }
);

export default axios;
