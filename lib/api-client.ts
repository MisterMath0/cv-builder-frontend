// frontend/lib/api-client.ts
import axios from "axios";

interface APIError {
  response: {
    data: {
      detail: string;
      success: boolean;
      message?: string;
    };
    status: number;
  };
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Update with your backend URL


export const registerUser = async (data: { 
  full_name: string; 
  email: string; 
  password: string; 
  confirm_password: string; 
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail;
    if (errorMessage) {
      throw { message: errorMessage };
    }
    throw { message: 'Registration failed' };
  }
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
  return axios.get(`${API_BASE_URL}/auth/verify-email`, {
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
export const createCV = async (templateId: string, sections: any[]) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    console.log('Creating CV with template and sections:', { templateId, sections });
    const response = await axios.post(`${API_BASE_URL}/api/cv`, { 
      template_id: templateId,
      sections: sections
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Create CV Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create CV error:', error);
    throw error;
  }
};

export const saveCVDraft = async (cvId: string, cvData: any, templateId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    console.log('Saving CV draft:', { cvId, cvData });
    const response = await axios.put(`${API_BASE_URL}/api/cv/${cvId}`, {
      cv_data: cvData,
      template_id: templateId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Save draft error:', error);
    throw error;
  }
};

export const previewCV = async (sections: any[], templateId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    console.log('Sending preview request:', { sections, templateId });
    const formattedData = {
      cv_data: {
        sections: sections.map(section => ({
          type: section.type,
          title: section.title,
          content: section.content,
          order_index: section.order
        }))
      },
      template_id: templateId
    };

    const response = await axios.post(`${API_BASE_URL}/api/cv/preview`, formattedData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.html;
  } catch (error: any) {
    console.error('Preview error:', error.response?.data || error);
    throw error;
  }
};

export const exportCV = async (sections: any[], templateId: string, format: 'pdf' | 'docx') => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    console.log('Exporting CV:', { sections, templateId, format });
    const response = await axios.post(
      `${API_BASE_URL}/api/cv/export/${format}`,
      {
        cv_data: { sections },
        template_id: templateId
      },
      { 
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    const blob = new Blob([response.data], {
      type: format === 'pdf' ? 'application/pdf' : 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cv.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error('Export error:', error);
    if (error.response?.data) {
      const text = await error.response.data.text();
      const errorData = JSON.parse(text);
      throw new Error(errorData.detail || 'Export failed');
    }
    throw error;
  }
};

// Get single CV
export const getCV = async (cvId: string) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  return axios.get(`${API_BASE_URL}/api/cv/${cvId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Get all user's CVs
export const getUserCVs = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  return axios.get(`${API_BASE_URL}/api/cv`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Update CV
export const updateCV = async (cvId: string, cvData: any) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  return axios.put(`${API_BASE_URL}/api/cv/${cvId}`, cvData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Delete CV
export const deleteCV = async (cvId: string) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  return axios.delete(`${API_BASE_URL}/api/cv/${cvId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

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
