import React, { useEffect, useState } from 'react';
import InPageNavigation from '../Components/Editor/InPageNavigation';
import Blogcard from '../Components/Editor/BlogCard.jsx';
import TrendingBlogcard from '../Components/Editor/TrendingBlogCard.jsx';
import ScrollAnimate from '../Animation/ScrollAnimate';
import { useNavigate } from 'react-router-dom';

// Fallback blog data for each category (used when backend is unavailable)
const fallbackBlogs = [
  {
    blog_id: 'blog-1',
    title: "Understanding Indian Pariah Dogs: India's Native Breed",
    description: "Discover the amazing Indian Pariah dog — one of the oldest and most resilient breeds on the planet.",
    tags: ["Dog Breeds"],
    banner: "https://images.unsplash.com/photo-1583337130417-13104dec14a3?w=800&h=500&fit=crop",
    author: { personal_info: { fullname: "Aniruddh Lakha", username: "aniruddh", profile_img: "" } },
    activity: { total_likes: 87, total_reads: 432 },
    publishedAt: new Date().toISOString(),
  },
  {
    blog_id: 'blog-2',
    title: "Essential Dog Training Tips for First-Time Owners",
    description: "Start your training journey right with these proven methods every new dog owner needs.",
    tags: ["Dog Training"],
    banner: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=500&fit=crop",
    author: { personal_info: { fullname: "Aniruddh Lakha", username: "aniruddh", profile_img: "" } },
    activity: { total_likes: 64, total_reads: 318 },
    publishedAt: new Date().toISOString(),
  },
  {
    blog_id: 'blog-3',
    title: "Street Dog Nutrition: Feeding Strays the Right Way",
    description: "Learn what to feed community dogs for optimal health and nutrition.",
    tags: ["Dog Health & Nutrition"],
    banner: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800&h=500&fit=crop",
    author: { personal_info: { fullname: "Aniruddh Lakha", username: "aniruddh", profile_img: "" } },
    activity: { total_likes: 92, total_reads: 501 },
    publishedAt: new Date().toISOString(),
  },
  {
    blog_id: 'blog-4',
    title: "Why Regular Grooming Matters for Street Dogs",
    description: "Keep your community dogs healthy and happy with proper grooming practices.",
    tags: ["Dog Grooming"],
    banner: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&h=500&fit=crop",
    author: { personal_info: { fullname: "Aniruddh Lakha", username: "aniruddh", profile_img: "" } },
    activity: { total_likes: 45, total_reads: 210 },
    publishedAt: new Date().toISOString(),
  },
  {
    blog_id: 'blog-5',
    title: "Understanding Dog Body Language: What Your Dog is Telling You",
    description: "Decode tail wags, ear positions, and postures to better understand your dog.",
    tags: ["Dog Behavior"],
    banner: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&h=500&fit=crop",
    author: { personal_info: { fullname: "Aniruddh Lakha", username: "aniruddh", profile_img: "" } },
    activity: { total_likes: 78, total_reads: 389 },
    publishedAt: new Date().toISOString(),
  },
  {
    blog_id: 'blog-6',
    title: "How to Prepare for a Successful Dog Adoption",
    description: "Everything you need to know before bringing a rescued dog into your home.",
    tags: ["Dog Adoption & Rescue"],
    banner: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=500&fit=crop",
    author: { personal_info: { fullname: "Aniruddh Lakha", username: "aniruddh", profile_img: "" } },
    activity: { total_likes: 115, total_reads: 620 },
    publishedAt: new Date().toISOString(),
  },
  {
    blog_id: 'blog-7',
    title: "Training Service Dogs: From Streets to Service",
    description: "How rescued dogs can be trained for service and therapy work.",
    tags: ["Service Dogs"],
    banner: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=500&fit=crop",
    author: { personal_info: { fullname: "Aniruddh Lakha", username: "aniruddh", profile_img: "" } },
    activity: { total_likes: 56, total_reads: 275 },
    publishedAt: new Date().toISOString(),
  },
  {
    blog_id: 'blog-8',
    title: "Fun Dog Sports and Activities for Active Owners",
    description: "Keep your dog physically and mentally stimulated with these engaging activities.",
    tags: ["Dog Sports & Activities"],
    banner: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=500&fit=crop",
    author: { personal_info: { fullname: "Aniruddh Lakha", username: "aniruddh", profile_img: "" } },
    activity: { total_likes: 41, total_reads: 198 },
    publishedAt: new Date().toISOString(),
  },
  {
    blog_id: 'blog-9',
    title: "Essential Dog Products Every Rescue Owner Needs",
    description: "A curated guide to the best products for newly adopted rescue dogs.",
    tags: ["Dog Products & Gear"],
    banner: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800&h=500&fit=crop",
    author: { personal_info: { fullname: "Aniruddh Lakha", username: "aniruddh", profile_img: "" } },
    activity: { total_likes: 33, total_reads: 167 },
    publishedAt: new Date().toISOString(),
  },
  {
    blog_id: 'blog-10',
    title: "Puppy Care 101: Raising a Rescued Puppy",
    description: "Special considerations when your rescue is a young puppy.",
    tags: ["Puppy Care"],
    banner: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=500&fit=crop",
    author: { personal_info: { fullname: "Aniruddh Lakha", username: "aniruddh", profile_img: "" } },
    activity: { total_likes: 103, total_reads: 542 },
    publishedAt: new Date().toISOString(),
  },
  {
    blog_id: 'blog-11',
    title: "Caring for Senior Rescue Dogs: Love in Their Golden Years",
    description: "Special care and attention older rescue dogs need to thrive.",
    tags: ["Senior Dog Care"],
    banner: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&h=500&fit=crop",
    author: { personal_info: { fullname: "Aniruddh Lakha", username: "aniruddh", profile_img: "" } },
    activity: { total_likes: 67, total_reads: 334 },
    publishedAt: new Date().toISOString(),
  },
  {
    blog_id: 'blog-12',
    title: "Dog-Friendly Places to Visit Around Maharashtra",
    description: "Discover the best pet-friendly destinations for memorable adventures.",
    tags: ["Dog-Friendly Travel"],
    banner: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&h=500&fit=crop",
    author: { personal_info: { fullname: "Aniruddh Lakha", username: "aniruddh", profile_img: "" } },
    activity: { total_likes: 89, total_reads: 456 },
    publishedAt: new Date().toISOString(),
  },
];

function CommunityHome() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(fallbackBlogs);
  const [specificBlogs, setSpecificBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState(fallbackBlogs.slice(0, 5));
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [totalDocs, setTotalDocs] = useState(0); // To track total document count for pagination
  const [page, setPage] = useState(1); // Pagination state for all blogs
  const [specificPage, setSpecificPage] = useState(1); // Pagination state for specific category blogs
  const [totalSpecificDocs, setTotalSpecificDocs] = useState(0); // Total document count for specific category blogs

const categories = [
  "Dog Breeds", 
  "Dog Training", 
  "Dog Health & Nutrition",
  "Dog Grooming",
  "Dog Behavior",
  "Dog Adoption & Rescue",
  "Service Dogs",
  "Dog Sports & Activities",
  "Dog Products & Gear",
  "Puppy Care",
  "Senior Dog Care",
  "Dog-Friendly Travel"
];

  // Fetching blogs - falls back to local data when API fails
  const getBlog = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/getBlog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page })
      });
      const resData = await response.json();
      if (resData && resData.data) {
        setBlogs(resData.data);
      }
    } catch {
      setBlogs(fallbackBlogs);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetching blogs for a specific category - filters locally from fallback
  const getSpecificBlog = async (category) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/getSpecificTag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category })
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setSpecificBlogs(resData.data);
      } else {
        setSpecificBlogs(fallbackBlogs.filter(b => b.tags.includes(category)));
      }
    } catch {
      setSpecificBlogs(fallbackBlogs.filter(b => b.tags.includes(category)));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetching trending blogs
  const getTrendingBlog = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/trendingBlog`, {
        method: "GET",
      });
      const resData = await response.json();
      if (resData && resData.data) {
        setTrendingBlogs(resData.data);
      }
    } catch {
      setTrendingBlogs(fallbackBlogs.slice(0, 5));
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      setIsLoading(true);
      setSpecificBlogs([]); // Clear previous specific blogs when category changes
      setSpecificPage(1); // Reset specificPage when the category changes
      getSpecificBlog(selectedCategory).finally(() => setIsLoading(false));
    }
  }, [selectedCategory]);
  
  useEffect(()=>{
    getBlog();
    getTrendingBlog();
  },[])

  return (
    // <AnimationWrapper>
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-100">
        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
            <section className="flex-1 lg:pr-8">
                <div className="px-6 py-8">
                    <InPageNavigation 
                        routes={selectedCategory ? [selectedCategory] : ["Home", "Trending Blogs"]} 
                        defaultHidden={["Trending Blogs"]}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center h-96">
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-orange-200 border-solid rounded-full animate-spin"></div>
                                    <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {selectedCategory ? (
                                    <>
                                        {specificBlogs.length > 0 ? (
                                            <>
                                                <div className="mb-8">
                                                    <h1 className="text-4xl font-bold text-gray-800 mb-2 relative">
                                                        {selectedCategory}
                                                        <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                                                    </h1>
                                                    <p className="text-gray-600 mt-4">Discover amazing stories in {selectedCategory.toLowerCase()}</p>
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {specificBlogs.map((blog, index) => (
                                                        // <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                                            <Blogcard content={blog} author={blog.author} />
                                                        // </AnimationWrapper>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-16">
                                                <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-xl text-gray-600">No blogs available in this category yet.</p>
                                                <p className="text-gray-500 mt-2">Be the first to share your story!</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <ScrollAnimate animation="fade-up">
                                        <div className="mb-8">
                                            <h1 className="text-4xl font-bold text-gray-800 mb-2 relative">
                                                Latest Stories
                                                <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                                            </h1>
                                            <p className="text-gray-600 mt-4">Fresh perspectives and inspiring stories from our community</p>
                                        </div>
                                        </ScrollAnimate>
                                        {blogs.length > 0 ? (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {blogs.map((blog, index) => (
                                                    // <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                                        <Blogcard content={blog} author={blog.author} />
                                                    // </AnimationWrapper>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-16">
                                                <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-xl text-gray-600">No blogs available at the moment.</p>
                                                <p className="text-gray-500 mt-2">Check back soon for new content!</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                        
                        {/* Trending Blogs */}
                        <div className="pt-8">
                            <ScrollAnimate animation="fade-up">
                            <div className="mb-8">
                                <h1 className="text-4xl font-bold text-gray-800 mb-2 relative">
                                    🔥 Trending Now
                                    <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                                </h1>
                                <p className="text-gray-600 mt-4">Most popular stories this week</p>
                            </div>
                            </ScrollAnimate>
                            {trendingBlogs.length > 0 ? (
                                <div className="space-y-6">
                                    {trendingBlogs.map((blog, index) => (
                                        // <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                            <TrendingBlogcard content={blog} author={blog.author} index={index} />
                                        // </AnimationWrapper>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <p className="text-xl text-gray-600">No trending blogs available at the moment.</p>
                                </div>
                            )}
                        </div>
                    </InPageNavigation>
                </div>
            </section>
            
            <aside className="lg:w-96 bg-white lg:border-l border-orange-200">
                <div className="sticky top-0 p-6">
                    <div className="hidden lg:block mb-8">
                        <ScrollAnimate animation="fade-left">
                        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white mb-6">
                            <h2 className="text-2xl font-bold mb-2">Explore Topics</h2>
                            <p className="text-orange-100">Discover stories from all interests</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map((category, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setSpecificBlogs([]);
                                    }}
                                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                                        selectedCategory === category
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                            : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        
                        {selectedCategory && (
                            <button
                                onClick={() => {
                                    setSelectedCategory("");
                                    setSpecificBlogs([]);
                                }}
                                className="w-full mt-4 p-3 rounded-xl glass-solid/30 text-gray-700 hover:bg-gray-200 transition-all duration-300 font-medium"
                            >
                                ← Back to All Stories
                            </button>
                        )}
                        </ScrollAnimate>
                    </div>
                    
                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2">🔥</span>
                            Hot This Week
                        </h3>
                        {trendingBlogs.slice(0, 3).length > 0 ? (
                            <div className="space-y-4">
                                {trendingBlogs.slice(0, 3).map((blog, index) => (
                                    <div 
                                        key={index}
                                        onClick={() => navigate(`/blog/${blog.blog_id}`)}
                                        className="cursor-pointer p-4 bg-white rounded-xl hover:shadow-md transition-all duration-300 border border-orange-100"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">
                                                    {blog.title}
                                                </h4>
                                                <p className="text-xs text-gray-600 flex items-center">
                                                    <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                    </svg>
                                                    {blog.activity.total_likes}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-sm">No trending blogs yet.</p>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    </div>
    // </AnimationWrapper>
  );
}

export default CommunityHome;
