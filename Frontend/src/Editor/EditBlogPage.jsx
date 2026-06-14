import React, { useContext, useEffect, useState } from 'react';
import toast from "react-hot-toast";
import blogBannerPlaceholder from "../assets/360_F_588335931_SG8mqLyvPnIQZL6vlkDtDhtJacYDoFuQ.jpg";
import BlogEditorNavbar from '../Components/Editor/BlogEditorNavbar';
import { EditorContext } from './EditorPage';
import EditorJS from '@editorjs/editorjs';
import { editorTools } from './Tools';
import { UserContext } from '../Authentication/Authentication.jsx';

function EditBlogPage() {
  const { blog, setBlog, textEditor, setTextEditor } = useContext(EditorContext);
  const { user, loading } = useContext(UserContext);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  
  useEffect(() => {
    if (loading) return;

    const editor = new EditorJS({
      holder: "textEditor",
      data: {
        blocks: blog.content[0] || "",
      },
      tools: editorTools,
      placeholder: "Start Writing a new Journey ..."
    });
    setTextEditor(editor);

    return () => {
      if (editor && typeof editor.destroy === 'function') {
        editor.destroy();
      }
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
          <div className="text-orange-700 text-xl font-serif">Loading your creative space...</div>
        </div>
      </div>
    );
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setImageLoading(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/blog/upload-blog-banner/${user._id}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      setBlog((prevBlog) => ({
        ...prevBlog,
        banner: data.bannerImageUrl,
      }));

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setImageLoading(false);
    }
  };
  
  return (
    <>
      <BlogEditorNavbar />
      <section className="min-h-screen w-full flex items-center bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8 px-4">
        {/* Main Container */}
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent font-serif mb-2">
              Craft Your Story
            </h1>
            <p className="text-orange-600/70 text-lg font-medium">
              Where ideas come to life
            </p>
          </div>

          {/* Editor Card */}
          <div className="glass-solid/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-orange-200/50 overflow-hidden">
            {/* Banner Upload Section */}
            <div className="p-8 border-b border-orange-100">
              <div className="relative aspect-[16/9] max-h-96 bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-dashed border-orange-300 hover:border-orange-400 transition-all duration-300 rounded-xl overflow-hidden group">
                <label htmlFor="uploadImage" className="cursor-pointer block h-full">
                  {imageLoading ? (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-50 to-white">
                      <div className="text-center">
                        <div className="animate-spin inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
                        <p className="text-orange-600 font-semibold text-lg">Uploading your masterpiece...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={imagePreview || blog.banner || blogBannerPlaceholder}
                        alt="Blog Banner"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Upload Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="glass-solid/90 backdrop-blur-sm rounded-full p-4 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Default Upload State */}
                      {!imagePreview && !blog.banner && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50/95 to-amber-50/95">
                          <div className="text-center text-orange-600 p-8">
                            <div className="mb-6">
                              <svg className="w-16 h-16 mx-auto text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-2xl md:text-3xl font-bold font-serif mb-2">Upload Banner</p>
                            <p className="text-lg text-orange-500 font-medium">Click to add your visual story</p>
                            <p className="text-sm text-orange-400 mt-2">PNG, JPG, JPEG up to 10MB</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <input
                    id="uploadImage"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* Title Section */}
            <div className="p-8 border-b border-orange-100">
              <div className="relative">
                <input
                  type="text"
                  value={blog.title}
                  onChange={(e) =>
                    setBlog((prevBlog) => ({ ...prevBlog, title: e.target.value }))
                  }
                  placeholder="Your Amazing Title Goes Here..."
                  className="w-full text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-gray-800 placeholder-orange-300 bg-transparent border-none outline-none focus:ring-0 py-4 leading-tight"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 transform scale-x-0 transition-transform duration-300 focus-within:scale-x-100"></div>
              </div>
            </div>
            
            {/* Editor Section */}
            <div className="p-8">
              <div className="relative">
                <div 
                  className="min-h-[400px] prose prose-lg max-w-none focus-within:ring-2 focus-within:ring-orange-300 focus-within:ring-offset-2 rounded-lg transition-all duration-200" 
                  id="textEditor"
                ></div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-orange-400 rounded-full opacity-20"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full opacity-30"></div>
                <div className="absolute -bottom-2 -left-1 w-2 h-2 bg-orange-300 rounded-full opacity-25"></div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Elements */}
          <div className="flex justify-center mt-8 space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EditBlogPage;
