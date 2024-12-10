// frontend/lib/api-client.ts
import axios from "axios";

export enum CVStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published'
}
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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cv-builder-backend-production.up.railway.app'; 

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

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data, { withCredentials: true });
    if (response.data.data.access_token) {
      const token = response.data.data.access_token;
      const refreshToken = response.data.data.refresh_token
      localStorage.setItem('access_token', response.data.data.access_token);
      localStorage.setItem('refresh_token', response.data.data.refresh_token);
      

      document.cookie = `token=${token}; path=/; max-age=604800`;
      document.cookie = `token=${refreshToken}; path=/; max-age=604800`;
    }
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail;
    throw { message: errorMessage || 'Login failed' };
  }
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

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No token found');
    }

    // Call logout endpoint
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('cv-form-data');
    
    // Clear cookies
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    // Redirect to login
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear tokens and redirect even if logout fails
    localStorage.clear();
    window.location.href = '/login';
  }
};


  // CV API calls
interface CVData {
  cv_data: any;
  template_id: string;
}
export const createCV = async (templateId: string, sections: any[]) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token missing in localStorage');
      throw new Error('No authentication token');
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/cv`, 
      { 
        template_id: templateId,
        sections: sections
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Create CV error:', error);
    throw error;
  }
};

export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No authentication token');

  return axios.post(`${API_BASE_URL}/api/cv/upload-image`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const saveCVDraft = async (cvId: string, cvData: any, templateId: string, status: CVStatus) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No authentication token');

    // Format sections for API
    const formattedSections = cvData.map((section: any, index: number) => ({
      type: section.type,
      title: section.title,
      content: section.content,
      order_index: index
    }));

    console.log('Sending update request:', {
      cvId,
      template_id: templateId,
      sections: formattedSections
    });

    const response = await axios.put(`${API_BASE_URL}/api/cv/${cvId}`, {
      template_id: templateId,
      sections: formattedSections,
      status: status
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
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
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No authentication token');

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
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.html;
  } catch (error: any) {
    console.error('Preview error:', error?.response?.data || error);
    throw error;
  }
};

export const exportCV = async (sections: any[], templateId: string, format: 'pdf' | 'docx') => {
  try {
    const token = localStorage.getItem('access_token');
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
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No authentication token');

  try {
    const response = await axios.get(`${API_BASE_URL}/api/cv/${cvId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('API Response:', response.data); // Debug log
    return response;
  } catch (error) {
    console.error('getCV error:', error);
    throw error;
  }
};
//get all cvs
export const getUserCVs = async () => {
  const token = localStorage.getItem('access_token'); // Make sure this matches your storage key
  
  if (!token) {
    throw new Error('No authentication token');
  }

  try {
    // Remove the additional 'cvs' from the path
    const response = await axios.get(`${API_BASE_URL}/api/cv`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching CVs:", error);
    throw error;
  }
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
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No authentication token');

  return axios.delete(`${API_BASE_URL}/api/cv/${cvId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

//Cover letters Api Calls 
export const generateCoverLetter = async (formData: any) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token missing in localStorage');
      throw new Error('No authentication token');
    }

    console.log('Generating cover letter with data:', formData);

    const response = await axios.post(
      `${API_BASE_URL}/api/ai`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Cover letter generation successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error generating cover letter:', error.response?.data || error);
    throw error;
  }
};

export const saveCoverLetter = async (coverLetterData: any) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token missing in localStorage');
      throw new Error('No authentication token');
    }

    console.log('Saving cover letter:', coverLetterData);

    const response = await axios.post(
      `${API_BASE_URL}/api/ai/save`,
      coverLetterData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Cover letter saved successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error saving cover letter:', error.response?.data || error);
    throw error;
  }
};

export const getAllCoverLetters = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token missing in localStorage');
      throw new Error('No authentication token');
    }

    console.log('Fetching all cover letters');

    const response = await axios.get(`${API_BASE_URL}/api/ai/letters`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Fetched cover letters:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching cover letters:', error.response?.data || error);
    throw error;
  }
};

export const getCoverLetterById = async (letterId: string) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token missing in localStorage');
      throw new Error('No authentication token');
    }

    console.log(`Fetching cover letter with ID: ${letterId}`);

    const response = await axios.get(`${API_BASE_URL}/api/ai/letters/${letterId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Fetched cover letter:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching cover letter by ID:', error.response?.data || error);
    throw error;
  }
};

export const exportCoverLetter = async (
  letterId: string, 
  format: 'pdf' | 'docx'
): Promise<void> => {

  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token missing in localStorage');
      throw new Error('No authentication token');
    }

    console.log(`Exporting cover letter with ID: ${letterId} as ${format}`);

    const response = await axios.get(
      `${API_BASE_URL}/api/ai/letters/${letterId}/export/${format}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      }
    );

    const blob = new Blob([response.data], {
      type: format === 'pdf' ? 'application/pdf' : 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cover_letter.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('Cover letter exported successfully');
  } catch (error: any) {
    console.error('Error exporting cover letter:', error.response?.data || error);
    throw error;
  }
};

export const getRemainingCredits = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token missing in localStorage');
      throw new Error('No authentication token');
    }

    console.log('Fetching remaining credits');

    const response = await axios.get(`${API_BASE_URL}/api/ai/credits`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Fetched remaining credits:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching remaining credits:', error.response?.data || error);
    throw error;
  }
};


/// Add axios interceptor for token handling
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
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
        localStorage.removeItem("access_token"); // Clear token for general auth failures
      }
    }

    return Promise.reject(error); // Propagate the error to be handled in `onSubmit`
  }
);


export default axios;
