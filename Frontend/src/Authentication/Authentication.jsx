import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Create both contexts for compatibility
const AuthContext = createContext();
const UserContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to process avatar URL
  const processAvatarUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === '/default-avatar.png' || imageUrl === 'null' || imageUrl === 'undefined') {
      return null;
    }
    
    // Handle base64 images (common for uploaded images)
    if (imageUrl.startsWith('data:image')) {
      return imageUrl;
    }
    
    // Handle relative URLs by making them absolute
    if (imageUrl.startsWith('/')) {
      return `${window.location.origin}${imageUrl}`;
    }
    
    // Handle URLs that might need a protocol
    if (imageUrl.startsWith('//')) {
      return `https:${imageUrl}`;
    }
    
    // Return as-is if it's already a full URL
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Default case - assume it's a relative path from uploads folder
    return `${window.location.origin}/uploads/${imageUrl}`;
  };

  // Helper function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('blog_user_token');

    if (storedToken) {
      try {
        // Check if token is expired
        if (isTokenExpired(storedToken)) {
          console.log('Token expired, removing from storage');
          localStorage.removeItem('blog_user_token');
          setUser(null);
          setToken(null);
          toast.error('Your session has expired. Please sign in again.');
          if (!['/signin', '/register', '/'].includes(location.pathname)) {
            navigate('/signin');
          }
        } else {
          setToken(storedToken);
          const decoded = jwtDecode(storedToken);
          
          // Set user with all necessary properties matching your User schema
          const userData = {
            _id: decoded._id || decoded.id || decoded.userId,
            userId: decoded.userId,
            name: decoded.name,
            email: decoded.email,
            avatar: processAvatarUrl(decoded.image), // Your schema uses 'image' field
            image: decoded.image, // Keep original image field
            occupation: decoded.occupation,
            dob: decoded.dob,
            phone: decoded.phone,
            address: decoded.address,
            blogs: decoded.blogs || [],
            dogsForAdoption: decoded.dogsForAdoption || [],
            favorites: decoded.favorites || { blogs: [], dogs: [] },
            ...decoded // Spread all other properties from token
          };
          
          setUser(userData);
          console.log('User authenticated:', userData);
        }
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('blog_user_token');
        setUser(null);
        setToken(null);
        toast.error('Invalid session. Please sign in again.');
      }
    } else {
      setUser(null);
      setToken(null);

      // Uncomment if you want to redirect unauthenticated users
      // if (!['/signin', '/register', '/'].includes(location.pathname)) {
      //   toast.error('Please sign in or register');
      //   navigate('/signin');
      // }
    }

    setLoading(false);
  }, [navigate, location]);

  const login = (token) => {
    try {
      // Check if token is expired before setting it
      if (isTokenExpired(token)) {
        toast.error('Token has expired. Please sign in again.');
        return false;
      }

      const decoded = jwtDecode(token);
      
      // Set user with proper structure matching your User schema
      const userData = {
        _id: decoded._id || decoded.id || decoded.userId,
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        avatar: processAvatarUrl(decoded.image), // Your schema uses 'image' field
        image: decoded.image, // Keep original image field
        occupation: decoded.occupation,
        dob: decoded.dob,
        phone: decoded.phone,
        address: decoded.address,
        blogs: decoded.blogs || [],
        dogsForAdoption: decoded.dogsForAdoption || [],
        favorites: decoded.favorites || { blogs: [], dogs: [] },
        ...decoded
      };
      
      setUser(userData);
      setToken(token);
      console.log('Login successful:', userData);
      localStorage.setItem('blog_user_token', token);
      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    } catch (error) {
      console.error('Login failed: invalid token', error);
      toast.error('Login failed: Invalid token');
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('blog_user_token');
    toast.success('Signed out successfully');
    navigate('/signin');
  };

  const updateUser = (userData) => {
    setUser(prevUser => {
      const updatedUser = {
        ...prevUser,
        ...userData
      };
      
      // Process avatar URL if it's being updated
      if (userData.image) {
        updatedUser.avatar = processAvatarUrl(userData.image);
        updatedUser.image = userData.image;
      } else if (userData.avatar) {
        updatedUser.avatar = processAvatarUrl(userData.avatar);
      }
      
      return updatedUser;
    });
  };

  // Check if user is authenticated and token is valid
  const isAuthenticated = () => {
    if (!user || !token) return false;
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      // Auto-logout if token is expired
      signOut();
      return false;
    }
    
    return true;
  };

  // Get authorization headers for API calls
  const getAuthHeaders = () => {
    if (!token || isTokenExpired(token)) {
      return {};
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Function to refresh user data
  const refreshUser = async () => {
    if (!token || isTokenExpired(token)) {
      signOut();
      return;
    }

    try {
      // You can implement an API call here to refresh user data
      // For now, we'll just re-decode the token
      const decoded = jwtDecode(token);
      
      // Refresh user data to match your User schema
      const userData = {
        _id: decoded._id || decoded.id || decoded.userId,
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        avatar: processAvatarUrl(decoded.image), // Your schema uses 'image' field
        image: decoded.image,
        occupation: decoded.occupation,
        dob: decoded.dob,
        phone: decoded.phone,
        address: decoded.address,
        blogs: decoded.blogs || [],
        dogsForAdoption: decoded.dogsForAdoption || [],
        favorites: decoded.favorites || { blogs: [], dogs: [] },
        ...decoded
      };
      
      setUser(userData);
      console.log('User data refreshed:', userData);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      signOut();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin inline-block w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const contextValue = {
    user,
    token,
    login,
    signOut,
    setUser,
    updateUser,
    refreshUser,
    loading,
    isAuthenticated,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <UserContext.Provider value={contextValue}>
        {children}
      </UserContext.Provider>
    </AuthContext.Provider>
  );
};

// Export both hooks for compatibility
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  return context;
};

// Export contexts for direct usage (like in your blog component)
export { AuthContext, UserContext };

// Default export for convenience
export default AuthProvider;