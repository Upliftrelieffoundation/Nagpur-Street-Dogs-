import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

// React Icons
import { FaDog, FaBlog, FaHeart, FaComment, FaEye, FaEdit, FaTrash, FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: null, type: null });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/${userId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user profile');
        }
        console.log(data);
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [userId]);

  const handleDeleteItem = async () => {
    try {
      const endpoint = itemToDelete.type === 'dog' 
        ? `${import.meta.env.VITE_SERVER_DOMAIN}/dog/${itemToDelete.id}`
        : `${import.meta.env.VITE_SERVER_DOMAIN}/blog/${itemToDelete.id}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to delete ${itemToDelete.type}`);
      }
      
      setUser(prev => ({
        ...prev,
        [itemToDelete.type === 'dog' ? 'dogsForAdoption' : 'blogs']: 
          prev[itemToDelete.type === 'dog' ? 'dogsForAdoption' : 'blogs']
            .filter(item => item._id !== itemToDelete.id)
      }));
      
      setOpenDeleteDialog(false);
      setItemToDelete({ id: null, type: null });
    } catch (err) {
      console.error(`Error deleting ${itemToDelete.type}:`, err);
      alert(`Failed to delete ${itemToDelete.type}: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex justify-center items-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex justify-center items-center">
        <div className="glass-solid p-8 max-w-md w-full mx-4">
          <div className="text-red-500 text-center text-lg">{error}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex justify-center items-center">
        <div className="glass-solid p-8 max-w-md w-full mx-4">
          <div className="text-gray-600 text-center text-lg">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* User Profile Section */}
        <div className="glass-solid p-8 mb-8 border border-orange-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex justify-center lg:justify-start w-full lg:w-auto">
              {user.image ? (
                <div className="relative">
                  <img 
                    src={user.image} 
                    alt={user.name}
                    className="w-40 h-40 rounded-full object-cover border-4 border-orange-200 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <FaUser className="text-white text-lg" />
                  </div>
                </div>
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center text-5xl border-4 border-orange-200 shadow-lg">
                  <FaUser className="text-orange-600" />
                </div>
              )}
            </div>
            <div className="w-full text-center lg:text-left">
              <h1 className="text-4xl font-bold mb-3  bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                {user.name}
              </h1>
              {user.occupation && (
                <p className="text-xl text-orange-600 mb-6 font-medium">{user.occupation}</p>
              )}
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-6">
                <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-full">
                  <FaEnvelope className="text-orange-500" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-full">
                  <FaPhone className="text-orange-500" />
                  <span className="text-gray-700">{user.phone}</span>
                </div>
                {user.dob && (
                  <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-full">
                    <FaCalendarAlt className="text-orange-500" />
                    <span className="text-gray-700">{formatDate(user.dob)}</span>
                  </div>
                )}
              </div>
              
              {user.address && (
                <div className=" items-center justify-center lg:justify-start gap-3 bg-orange-50 px-4 py-2 rounded-full inline-flex">
                  <FaMapMarkerAlt className="text-orange-500" />
                  <span className="text-gray-700">{user.address.city}, {user.address.state}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dogs for Adoption Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <FaDog className="text-white text-lg" />
              </div>
              Dogs for Adoption
            </h2>
            <button 
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/adopt-form')}
            >
              <FaPlus /> Add New Dog
            </button>
          </div>
          
          {user.dogsForAdoption.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {user.dogsForAdoption.map(dog => (
                <div key={dog._id} className="glass-solid overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-orange-100">
                  <div className="relative pt-[75%]">
                    <img 
                      src={dog.images[0] || '/dog-placeholder.jpg'} 
                      alt={dog.name}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 glass-solid/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-orange-600 font-semibold text-sm">{dog.age} months</span>
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold mb-3 text-gray-800">{dog.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">{dog.breed}</span>
                      <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">{dog.size}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-2">{dog.description}</p>
                  </div>
                  <div className="p-6 pt-0 flex justify-end gap-3">
                    <button 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl flex items-center gap-2 transition-all duration-200"
                      onClick={() => {
                        setItemToDelete({ id: dog._id, type: 'dog' });
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-solid p-12 text-center border border-orange-100">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaDog className="text-orange-500 text-2xl" />
              </div>
              <p className="text-gray-600 mb-6 text-lg">No dogs posted for adoption yet.</p>
              <button 
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-2xl flex items-center gap-2 mx-auto transition-all duration-300"
                onClick={() => navigate('/adopt-form')}
              >
                <FaPlus /> Post Your First Dog
              </button>
            </div>
          )}
        </div>

        {/* Blogs Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <FaBlog className="text-white text-lg" />
              </div>
              My Blog Posts
            </h2>
            <button 
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/editor')}
            >
              <FaPlus /> Create New Blog
            </button>
          </div>
          
          {user.blogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.blogs.map(blog => (
                <div key={blog._id} className="glass-solid overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-orange-100">
                  <div className="relative pt-[56.25%]">
                    <img 
                      src={blog.banner || '/blog-placeholder.jpg'} 
                      alt={blog.title}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">{blog.title}</h3>
                    <p className="text-orange-600 text-sm mb-4 font-medium">
                      Published on {formatDate(blog.publishedAt)}
                    </p>
                    <div className="flex gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                          <FaHeart className="text-red-500 text-xs" />
                        </div>
                        <span className="text-gray-600 font-medium">{blog.activity?.total_likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                          <FaComment className="text-blue-500 text-xs" />
                        </div>
                        <span className="text-gray-600 font-medium">{blog.activity?.total_comments || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                          <FaEye className="text-gray-500 text-xs" />
                        </div>
                        <span className="text-gray-600 font-medium">{blog.activity?.total_reads || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-0 flex justify-between">
                    <button 
                      className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 font-medium"
                      onClick={() => navigate(`/blog/${blog.blog_id}`)}
                    >
                      View Post
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl flex items-center gap-2 transition-all duration-200"
                      onClick={() => {
                        setItemToDelete({ id: blog._id, type: 'blog' });
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-solid p-12 text-center border border-orange-100">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBlog className="text-orange-500 text-2xl" />
              </div>
              <p className="text-gray-600 mb-6 text-lg">No blog posts yet.</p>
              <button 
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-2xl flex items-center gap-2 mx-auto transition-all duration-300"
                onClick={() => navigate('/editor')}
              >
                <FaPlus /> Write Your First Blog
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        {openDeleteDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-solid p-8 max-w-md w-full border border-orange-100">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="text-red-500 text-xl" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Confirm Delete</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete this {itemToDelete.type}? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  onClick={() => setOpenDeleteDialog(false)}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-200 font-medium shadow-lg"
                  onClick={handleDeleteItem}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
