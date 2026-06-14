import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegThumbsUp, FaRegComments, FaEye, FaTwitter, FaThumbsUp, FaShare } from 'react-icons/fa';
import { UserContext } from '../Authentication/Authentication.jsx';
import toast from 'react-hot-toast';
import { fetchComment } from "../Components/Editor/ComponentsContainer"
import ComponentsContainer from '../Components/Editor/ComponentsContainer';
import Header from "../Components/Header.jsx"

export const BlogContext = createContext({});

function BlogId() {
  const [blog_id, setBlog_id] = useState(null);
  const [commentsWrapper, setCommentWrapper] = useState(true);
  const [totalParentsCommentsLoaded, settotalParentsCommentsLoaded] = useState(0);
  let blogId = useParams();
  blogId = blogId.id;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [category, setCategory] = useState('');
  const [relBlog, setRelBlog] = useState([]);
  const navigate = useNavigate();
  const [isLiked, setIsLikedUser] = useState(true);

  useEffect(() => {
    setCommentWrapper(false);
    settotalParentsCommentsLoaded(0);
    setCommentWrapper(0);
  }, [])
  
  useEffect(() => {
    if (blog_id) {
      const fetchLikeDetails = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/isLikedUser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              blog_id: blog_id,
              user_id: user._id,
            }),
          });
          const resData = await response.json();
          console.log(resData);
          setIsLikedUser(Boolean(resData.data));
        } catch (error) {
          console.error(error);
        }
      };
      fetchLikeDetails();
    }
  }, [blog_id]);

  const handleClickLike = async () => {
    if (!user || !user._id) {
      toast.error("Please Sign in");
      return;
    }
    const newLikeState = !isLiked;

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/updateLike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blog_id: blog._id,
          user_id: user._id,
          isLiked: newLikeState,
        }),
      });

      const resData = await response.json();
      console.log(resData);

      if (resData) {
        toast(newLikeState ? "Successfully liked" : "Successfully unliked");
        setIsLikedUser(prev => !prev);
        setBlog({
          ...blog,
          activity: {
            ...blog.activity,
            total_likes: resData.updatedLikes,
          },
        });
        console.log(blog);
      } else {
        toast(resData.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error in handleClickLike:", error);
    }
  };

  const fetchBlogDetails = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/getBlogData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: blogId }),
      });
      const resData = await response.json();
      if (resData.success) {
        const blogData = resData.data;
        blogData.comments = await fetchComment({ blog_id: blogData._id }) || [];
        setBlog(blogData);
        console.log(blogData);
        setBlog_id(blogData._id);
        setCategory(blogData.tags[0]);
      } else {
        console.error('Error fetching blog data:', resData);
      }
    } catch (error) {
      console.error('Error fetching blog details:', error);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  const getSpecificBlog = useCallback(async (category) => {
    if (!category) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/getSpecificTag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setRelBlog(resData.data);
      }
    } catch (err) {
      console.error('Error fetching specific blogs:', err);
    }
  }, []);

  useEffect(() => {
    fetchBlogDetails();
  }, [fetchBlogDetails]);

  useEffect(() => {
    if (category) {
      getSpecificBlog(category);
    }
  }, [category, getSpecificBlog]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Blog not found</h2>
          <p className="text-gray-500">The blog you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const { title, description, banner, content, publishedAt, tags, activity, author } = blog;
  
  const generateTwitterLink = () => {
    const tweetText = encodeURIComponent(`${title}: ${description}`);
    const tweetUrl = encodeURIComponent(window.location.href);
    const tweetHashtags = encodeURIComponent(tags.join(', '));
    return `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}&hashtags=${tweetHashtags}`;
  };

  const renderContent = (content) => {
    if (!content || !content.blocks || !Array.isArray(content.blocks)) {
      return <p className="text-gray-500 text-center py-12">No content available.</p>;
    }

    const blocks = content.blocks;

    return blocks.map((block) => {
      const { id, type, data } = block;

      switch (type) {
        case 'paragraph':
          return (
            <p key={id} className="text-gray-700 leading-relaxed mb-6 text-lg">
              {data.text || 'No text available'}
            </p>
          );

        case 'header':
          const HeaderTag = `h${data.level}`;
          const headerClasses = {
            1: 'text-4xl font-bold text-gray-900 mb-6 mt-12',
            2: 'text-3xl font-bold text-gray-900 mb-5 mt-10',
            3: 'text-2xl font-semibold text-gray-900 mb-4 mt-8',
            4: 'text-xl font-semibold text-gray-900 mb-4 mt-6',
            5: 'text-lg font-semibold text-gray-900 mb-3 mt-6',
            6: 'text-base font-semibold text-gray-900 mb-3 mt-4'
          };
          return (
            <HeaderTag key={id} className={headerClasses[data.level] || headerClasses[2]}>
              {data.text || 'No header text available'}
            </HeaderTag>
          );

        case 'list':
          if (Array.isArray(data.items)) {
            const ListTag = data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={id} className={`mb-6 text-gray-700 text-lg space-y-2 ${data.style === 'ordered' ? 'list-decimal ml-6' : 'list-disc ml-6'}`}>
                {data.items.map((item, index) => (
                  <li key={index} className="leading-relaxed">
                    {item.content || 'Empty item'}
                  </li>
                ))}
              </ListTag>
            );
          } else {
            return <p key={id} className="text-red-500 mb-4">List data is missing or incorrect.</p>;
          }

        case 'image':
          return (
            <div key={id} className="my-10">
              <img
                src={data.file?.url || '/path/to/fallback-image.jpg'}
                alt={data.file?.filename || 'Content image'}
                className="w-full rounded-lg shadow-sm"
              />
              {data.caption && (
                <p className="text-sm text-gray-500 text-center mt-3 italic">{data.caption}</p>
              )}
            </div>
          );

        case 'quote':
          return (
            <blockquote key={id} className="border-l-4 border-orange-500 pl-6 py-4 my-8 bg-orange-50/30 italic">
              <p className="text-xl text-gray-700 leading-relaxed mb-2">
                "{data.text || 'No quote text available'}"
              </p>
              {data.author && (
                <cite className="text-sm text-gray-500 not-italic">— {data.author}</cite>
              )}
            </blockquote>
          );

        default:
          return <p key={id} className="text-red-500 my-4">Unrecognized block type: {type}</p>;
      }
    });
  };

  return (
    <BlogContext.Provider value={{ commentsWrapper, setCommentWrapper, totalParentsCommentsLoaded, settotalParentsCommentsLoaded, blog, blog_id, setBlog }}>
      <ComponentsContainer />
      
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          
          {/* Article Header */}
          <header className="mb-12">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Title */}
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
              {title}
            </h1>
            
            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-4xl">
              {description}
            </p>

            {/* Author and Meta Info */}
            <div className="flex items-center justify-between py-6 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-orange-100"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{author.name}</h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span 
                      onClick={() => navigate(`/profile/${author.email}`)}
                      className="text-orange-600 hover:text-orange-700 cursor-pointer font-medium"
                    >
                      @{author.email}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <a 
                href={generateTwitterLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all duration-200"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-12">
            <img 
              src={banner} 
              alt={title} 
              className="w-full h-[500px] object-cover rounded-xl shadow-sm"
            />
          </div>

          {/* Article Content */}
          <article className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-gray max-w-none">
              {content && content.length > 0 ? renderContent(...content) : 
                <p className="text-gray-500 text-center py-12">No content available.</p>
              }
            </div>
          </article>

          {/* Engagement Section */}
          <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <button
                  onClick={handleClickLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    isLiked 
                      ? 'bg-orange-100 text-orange-600' 
                      : 'text-gray-600 hover:glass-solid/30'
                  }`}
                >
                  {isLiked ? (
                    <FaThumbsUp className="w-5 h-5" />
                  ) : (
                    <FaRegThumbsUp className="w-5 h-5" />
                  )}
                  <span className="font-medium">{activity.total_likes}</span>
                  <span className="text-sm">Likes</span>
                </button>
                
                <button
                  onClick={() => setCommentWrapper(prev => !prev)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:glass-solid/30 rounded-full transition-all duration-200"
                >
                  <FaRegComments className="w-5 h-5" />
                  <span className="font-medium">{activity.total_comments}</span>
                  <span className="text-sm">Comments</span>
                </button>
                
                <div className="flex items-center space-x-2 px-4 py-2 text-gray-600">
                  <FaEye className="w-5 h-5" />
                  <span className="font-medium">{activity.total_reads}</span>
                  <span className="text-sm">Views</span>
                </div>
              </div>

              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:glass-solid/30 rounded-full transition-all duration-200">
                <FaShare className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </BlogContext.Provider>
  );
}

export default BlogId;
