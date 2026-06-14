import React from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CodeTool from '@editorjs/code';
import Embed from '@editorjs/embed';

// Import the CSS (this will apply the styles to the editor)
import './editor.css';

// Function to handle image upload by URL
const uploadImageByUrl = async (url) => {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        success: 1,
        file: { url },
      });
    } catch (error) {
      reject({
        success: 0,
        message: error.message,
      });
    }
  });
};

// Configure the tools for Editor.js
export const editorTools = {
  header: {
    class: Header,
    config: {
      placeholder: 'Enter a heading...',
      levels: [1, 2, 3],
      defaultLevel: 1,
    },
  },
  list: List,
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: 'https://api.cloudinary.com/v1_1/doczqznfj/image/upload',
      },
      field: 'file',
      additionalRequestData: {
        upload_preset: 'horizon',
      },
      caption: true,
      alt: true,
      uploader: {
        uploadByFile: async (file) => {
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'horizon');

            const response = await fetch(
              'https://api.cloudinary.com/v1_1/doczqznfj/image/upload',
              {
                method: 'POST',
                body: formData,
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error?.message || 'Failed to upload image');
            }

            const data = await response.json();

            if (!data.secure_url) {
              throw new Error('Upload succeeded but secure_url is missing');
            }

            return {
              success: 1,
              file: {
                url: data.secure_url,
              },
            };
          } catch (error) {
            console.error('Image upload failed:', error.message);
            return {
              success: 0,
              message: error.message,
            };
          }
        },
        uploadByUrl: uploadImageByUrl,
      },
    },
  },
  quote: {
    class: Quote,
    config: {
      placeholder: 'Enter your quote...',
      captionPlaceholder: 'Enter author name...',
    },
  },
  marker: Marker,
  code: {
    class: CodeTool,
    config: {
      placeholder: 'Write your code here...',
      language: 'javascript', // Default language
    },
  },
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        twitter: true,
        instagram: true,
        codepen: true,
      },
    },
  },
};

// Function to initialize Editor.js - call this from your component
export const initializeEditor = (holderId = 'textEditor', initialData = null) => {
  return new Promise((resolve, reject) => {
    try {
      // Check if element exists
      const holderElement = document.getElementById(holderId);
      if (!holderElement) {
        reject(new Error(`Element with ID "${holderId}" not found`));
        return;
      }

      const editor = new EditorJS({
        holder: holderId,
        tools: editorTools,
        data: initialData,
        placeholder: 'Start writing your story...',
        autofocus: true,
        onReady: () => {
          console.log('Editor.js is ready to work!');
          resolve(editor);
        },
        onChange: (api, event) => {
          console.log('Content was changed', event);
        },
      });
    } catch (error) {
      console.error('Editor initialization failed:', error);
      reject(error);
    }
  });
};

// Helper function to save editor data
export const saveEditorData = async (editor) => {
  try {
    const outputData = await editor.save();
    console.log('Article data: ', outputData);
    return outputData;
  } catch (error) {
    console.error('Saving failed: ', error);
    throw error;
  }
};

// Helper function to clear editor
export const clearEditor = async (editor) => {
  try {
    await editor.clear();
    console.log('Editor cleared');
  } catch (error) {
    console.error('Clearing failed: ', error);
    throw error;
  }
};

// Helper function to render editor data (for display purposes)
export const renderEditorData = (data) => {
  if (!data || !data.blocks) {
    return null;
  }

  return data.blocks.map((block, index) => {
    switch (block.type) {
      case 'header': {
        const HeaderTag = `h${block.data.level}`;
        return React.createElement(HeaderTag, { key: index }, block.data.text);
      }
      
      case 'paragraph':
        return React.createElement('p', { key: index }, block.data.text);
      
      case 'list': {
        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        return React.createElement(
          ListTag,
          { key: index },
          block.data.items.map((item, itemIndex) =>
            React.createElement('li', { key: itemIndex }, item.content)
          )
        );
      }
      
      case 'quote':
        return React.createElement(
          'blockquote',
          { key: index },
          React.createElement('p', null, block.data.text),
          block.data.caption && React.createElement('footer', null, block.data.caption)
        );
      
      case 'image':
        return React.createElement('img', {
          key: index,
          src: block.data.file.url,
          alt: block.data.caption || 'Image',
          title: block.data.caption
        });
      
      case 'code':
        return React.createElement(
          'pre',
          { key: index },
          React.createElement('code', null, block.data.code)
        );
      
      default:
        return React.createElement('div', { key: index }, 'Unsupported block type');
    }
  });
};