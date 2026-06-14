import { useContext } from "react";
import { EditorContext } from "../../Editor/EditorPage.jsx";
import toast from "react-hot-toast";
import logo from "../../assets/sm_5b29ed73cf5c8.jpg";
import React from 'react'
import { useNavigate } from "react-router-dom";
import UserProvider, { UserContext } from "../../Authentication/Authentication.jsx";

function BlogEditorNavbar() {
  const { blog, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
  const { user } = useContext(UserContext);
  
  // Add safety checks for blog object
  const blogTitle = blog?.title || "New Blog";
  const navigate = useNavigate();
  
  // Early return if blog is not available yet
  if (!blog) {
    return (
      <nav className="z-10 flex justify-between h-20 sticky shadow-lg py-2 top-0 px-4 items-center bg-white border-b-2 border-orange-500">
        <div className="flex items-center">
          <h1 
            className="md:text-3xl text-xl font-serif font-bold text-orange-600 cursor-pointer hover:text-orange-700 transition-colors duration-200" 
            onClick={() => { navigate("/") }}
          >
            OPEN HEART
          </h1>
          <p className="md:pl-4 px-2 text-lg font-serif whitespace-nowrap text-gray-700">Loading...</p>
        </div>
      </nav>
    );
  }
  
  const handlePublish = () => {
    if (!blog.banner?.length) {
      return toast.error("Blog Banner Required");
    }
    if (!blog.title?.length) {
      return toast.error("Blog title Required ");
    }
    if (textEditor.isReady) {
      textEditor.save().then(data => {
        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          setEditorState("publish")
        } else {
          return toast.error("Write Something to publish")
        }
      }).catch((err) => {
        console.error(err);
      })
    }
  }
  
  const handleDraft = async () => {
    if (!blog.banner?.length) {
      return toast.error("Blog Banner Required");
    }
    if (!blog.title?.length) {
      return toast.error("Blog title Required");
    }

    try {
      console.log(user?._id);
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/createDraft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ blog, authorId: user?._id, draft: true, blog_id: blog.blog_id })
      });

      const resData = await response.json();

      if (resData.success) {
        toast.success("Your blog is being saved as draft.");
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      console.error("Error saving blog as draft:", error);
      toast.error("An error occurred while saving your blog. Please try again.");
    }
  };
  
  return (
    <nav className="z-10 flex justify-between h-20 sticky shadow-lg py-2 top-0 px-4 items-center bg-white border-b-2 border-orange-500">
      <div className="flex items-center">
        <h1 
          className="md:text-3xl text-xl font-serif font-bold text-orange-600 cursor-pointer hover:text-orange-700 transition-colors duration-200" 
          onClick={() => { navigate("/") }}
        >
          Wooferz
        </h1>
        <p className="md:pl-4 px-2 text-lg font-serif whitespace-nowrap text-gray-700">{`${blogTitle}`}</p>
      </div>
      <div className="flex gap-3">
        <button
          className="md:py-2 md:px-4 py-1 px-3 bg-orange-500 text-white font-serif rounded-full hover:bg-orange-600 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          onClick={handlePublish}
          aria-label="Publish Blog"
        >
          Publish
        </button>
        <button
          onClick={handleDraft}
          className="md:py-2 md:px-4 py-1 px-3 bg-white text-orange-600 border-2 border-orange-500 hidden md:block font-serif rounded-full hover:bg-orange-50 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Save as Draft
        </button>
        <button
          onClick={handleDraft}
          className="md:hidden bg-white text-orange-600 border-2 border-orange-500 py-1 px-2 font-serif rounded-md hover:bg-orange-50 hover:scale-105 transition-all duration-200 shadow-md"
        >
          Draft
        </button>
      </div>
    </nav>
  )
}

export default BlogEditorNavbar