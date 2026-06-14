import React from 'react';
import { FiHeart } from 'react-icons/fi'; // Heart icon
import { useNavigate } from 'react-router-dom';

function TrendingBlogcard({ content, author, index }) {
    const { publishedAt, tags, title, description, banner, activity: { total_likes }, blog_id: id } = content;
    const { name, email, avatar } = author;
    const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', // short month name (e.g., Jan, Feb)
        day: '2-digit', // two-digit day (e.g., 21)
    });

    const navigate = useNavigate();

    // Handle profile click
    const handleClick = (e) => {
        e.stopPropagation(); // Prevent the click from bubbling up to the blog card
        navigate(`/profile/${email}`);
    };

    // Handle blog click (Navigate to the blog itself)
    const handleBlogClick = () => {
        navigate(`/blog/${id}`);
    };

    // Get rank colors based on index
    const getRankColor = (index) => {
        if (index === 0) return 'from-yellow-400 to-yellow-600'; // Gold
        if (index === 1) return 'from-gray-400 to-gray-600'; // Silver
        if (index === 2) return 'from-amber-600 to-amber-800'; // Bronze
        return 'from-orange-500 to-orange-700'; // Default orange
    };

    const getRankIcon = (index) => {
        if (index === 0) return '👑';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return '🔥';
    };

    return (
        <div 
            onClick={handleBlogClick} 
            className='group relative glass-solid hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-orange-100 overflow-hidden cursor-pointer'
        >
            {/* Trending Badge */}
            <div className="absolute top-4 left-4 z-10">
                <div className={`bg-gradient-to-r ${getRankColor(index)} px-4 py-2 rounded-full shadow-lg`}>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{getRankIcon(index)}</span>
                        <span className="text-white font-bold text-sm">
                            #{String(index + 1).padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Background Banner - Subtle */}
            {banner && (
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <img 
                        src={banner} 
                        alt="Background" 
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className='relative p-6 pt-20'>
                {/* Author Section */}
                <div className='flex items-start gap-4 mb-4'>
                    <div className="relative">
                        <img 
                            src={`data:image/jpeg;base64,${avatar}`} 
                            alt="Profile" 
                            className="h-14 w-14 rounded-full object-cover border-3 border-orange-200 shadow-lg group-hover:border-orange-300 transition-all duration-300" 
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    
                    <div className="flex-1 cursor-pointer" onClick={handleClick}>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className='text-lg font-bold text-gray-800 hover:text-orange-600 transition-colors duration-200'>
                                {name}
                            </h3>
                            {index < 3 && (
                                <div className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                                    TOP AUTHOR
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{'@' + email}</span>
                            <span>•</span>
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <h2 className='text-2xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-700 transition-colors duration-300'>
                        {title}
                    </h2>
                    <p className='text-gray-600 line-clamp-3 leading-relaxed'>
                        {description}
                    </p>
                </div>

                {/* Tags and Stats */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {tags && tags.slice(0, 2).map((tag, idx) => (
                            <span 
                                key={idx} 
                                className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-xs font-medium rounded-full border border-orange-200"
                            >
                                #{tag}
                            </span>
                        ))}
                        {tags && tags.length > 2 && (
                            <span className="px-3 py-1 glass-solid/30 text-gray-600 text-xs font-medium rounded-full">
                                +{tags.length - 2}
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Likes */}
                        <div className="flex items-center gap-2 text-red-500">
                            <FiHeart className="text-lg group-hover:scale-110 transition-transform duration-300" />
                            <span className='font-bold'>{total_likes}</span>
                        </div>
                        
                        {/* Trending indicator */}
                        <div className="flex items-center gap-1 text-orange-500">
                            <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-semibold">HOT</span>
                        </div>
                    </div>
                </div>

                {/* Bottom gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
        </div>
    );
}

export default TrendingBlogcard;
