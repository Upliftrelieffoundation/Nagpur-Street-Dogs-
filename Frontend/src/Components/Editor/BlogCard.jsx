import React from 'react';
import { GetDay } from './CommentCard';
import { FiHeart } from 'react-icons/fi'; // Heart icon
import { useNavigate } from 'react-router-dom';

function Blogcard({ content, author }) {
    console.log(content,author);
    const { publishedAt, tags, title, description, banner, activity: { total_likes }, blog_id: id } = content;
    const { name, email, avatar } = author;
    const navigate = useNavigate();

    // Handle click for profile navigation
    const handleClick = (e) => {
        e.stopPropagation(); // Prevent click from propagating to the card
        navigate(`/profile/${email}`);
    }

    return (
        <div 
            onClick={() => { navigate(`/blog/${id}`) }} 
            className='group cursor-pointer glass-solid hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100 overflow-hidden'
        >
            {/* Banner Image */}
            <div className="relative overflow-hidden h-52">
                <img 
                    src={banner} 
                    alt="Banner" 
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700' 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Floating like button */}
                <div className="absolute top-4 right-4 glass-solid/90 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-1">
                        <FiHeart className="text-red-500 text-sm" />
                        <span className="text-xs font-semibold text-gray-700">{total_likes}</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Author Info */}
                <div className='flex items-center gap-3 mb-4'>
                    <div className="relative">
                        <img 
                            src={`data:image/jpeg;base64,${avatar}`} 
                            alt="Profile" 
                            className="h-12 w-12 rounded-full object-cover border-2 border-orange-200 shadow-md" 
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div className='cursor-pointer flex-1' onClick={handleClick}>
                        <p className='font-semibold text-gray-800 hover:text-orange-600 transition-colors duration-200'>{name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{'@' + email}</span>
                            <span>•</span>
                            <span><GetDay timeStamp={publishedAt} /></span>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className='text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-700 transition-colors duration-300'>
                    {title}
                </h1>

                {/* Description */}
                <p className='text-gray-600 mb-4 line-clamp-3 leading-relaxed'>
                    {description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.slice(0, 3).map((tag, i) => (
                        <span 
                            key={i} 
                            className='px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-xs font-medium rounded-full border border-orange-200 hover:from-orange-200 hover:to-orange-100 transition-all duration-300'
                        >
                            #{tag}
                        </span>
                    ))}
                    {tags.length > 3 && (
                        <span className='px-3 py-1 glass-solid/30 text-gray-600 text-xs font-medium rounded-full'>
                            +{tags.length - 3} more
                        </span>
                    )}
                </div>

                {/* Bottom section */}
                <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                    <div className="flex items-center gap-2 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-sm">Read more</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-red-500">
                        <FiHeart className="text-lg group-hover:scale-110 transition-transform duration-300" />
                        <span className='font-semibold'>{total_likes}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Blogcard;
