
// Define the API URL based on environment
// In development, use localhost, in production use relative path
const API_URL = import.meta.env.PROD 
  ? '/api'  // In production, use relative path
  : 'http://localhost:5000/api'; // In development, use localhost

export const saveUserData = async (userData: {
  username: string;
  profileData: any;
  workouts: any[];
  meals: any[];
  goals: any[];
}): Promise<any> => {
  try {
    // Add additional error handling for network issues
    const response = await fetch(`${API_URL}/save-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Better error handling
    if (!response.ok) {
      // Try to parse error message if available
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } catch (jsonError) {
        // If we can't parse JSON, use the response status
        throw new Error(`Server error: ${response.status}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getUserData = async (username: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/get-data/${username}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get data');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// New function to get user data history
export const getUserDataHistory = async (username: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/get-data-history/${username}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get data history');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// New function to get a specific data snapshot
export const getUserDataSnapshot = async (username: string, recordId: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/get-data-snapshot/${username}/${recordId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get data snapshot');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
