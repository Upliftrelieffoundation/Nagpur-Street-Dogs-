import { nanoid } from 'nanoid';
import supabase from '../Utils/supabase.js';

const generateBlogId = (authorId) => `${authorId.slice(0, 8)}-${nanoid(8)}`;

/**
 * GET TRENDING BLOGS — sorted by reads & likes
 * OLD: BlogSchema.find().sort().limit()
 * NEW: supabase.from('blogs').select().order().limit()
 */
export async function trendingBlog(req, res) {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('blog_id, title, description, banner, tags, published_at, total_likes, total_reads, profiles:author_id(id, name, image)')
      .eq('draft', false)
      .order('total_reads', { ascending: false })
      .order('total_likes', { ascending: false })
      .limit(10);

    if (error) throw error;

    return res.status(200).json({ message: 'Retrieved successfully', data, success: true });
  } catch (error) {
    console.error('Error fetching trending blogs:', error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
}

/**
 * GET ALL BLOGS — public non-draft blogs
 */
export async function getBlog(req, res) {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('blog_id, title, description, banner, tags, published_at, total_likes, total_reads, total_comments, profiles:author_id(id, name, image)')
      .eq('draft', false)
      .order('published_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ message: 'Successfully Retrieved', data, success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
}

/**
 * GET BLOGS BY TAG / SEARCH QUERY
 */
export async function getSpecificTag(req, res) {
  const { query, category } = req.body;

  try {
    let dbQuery = supabase
      .from('blogs')
      .select('blog_id, title, description, banner, tags, published_at, total_likes, total_reads, profiles:author_id(id, name, image)')
      .eq('draft', false)
      .order('published_at', { ascending: false });

    // Filter by tag(s) using Supabase array overlap operator
    if (category) {
      const cats = Array.isArray(category) ? category : [category];
      dbQuery = dbQuery.overlaps('tags', cats);
    }

    // Text search in title or description
    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    const { data, error } = await dbQuery;

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No blogs found', success: false });
    }

    return res.status(200).json({ message: 'Successfully fetched blogs', success: true, data });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred', success: false });
  }
}

/**
 * GET BLOG COUNT — used for pagination
 */
export async function getCountBlog(req, res) {
  try {
    let { data_to_send } = req.body;
    const query = typeof data_to_send === 'string' ? data_to_send.trim() : '';

    let dbQuery = supabase
      .from('blogs')
      .select('id', { count: 'exact', head: true })
      .eq('draft', false);

    if (query !== '') {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    const { count, error } = await dbQuery;

    if (error) throw error;

    return res.status(200).json({ message: 'Successfully retrieved blog count', success: true, count });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve blog count', success: false });
  }
}

/**
 * GET SINGLE BLOG DATA — and increment read count
 */
export async function getBlogData(req, res) {
  const { id, mode } = req.body;

  try {
    // Fetch the blog
    const { data: blog, error } = await supabase
      .from('blogs')
      .select('blog_id, title, description, banner, content, tags, published_at, draft, total_likes, total_reads, total_comments, profiles:author_id(id, name, image)')
      .eq('blog_id', id)
      .single();

    if (error) throw error;

    // Increment read count (unless in edit mode)
    if (mode !== 'edit') {
      await supabase
        .from('blogs')
        .update({ total_reads: (blog.total_reads || 0) + 1 })
        .eq('blog_id', id);
    }

    return res.status(200).json({ message: 'Successfully retrieved', data: blog, success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error', success: false });
  }
}

/**
 * PUBLISH BLOG — create new or update existing
 * OLD: new BlogSchema({...}).save() + UserSchema.findById().save()
 * NEW: supabase.from('blogs').insert() or .update()
 */
export async function PublishBlog(req, res) {
  const resdata = req.body;
  const data = resdata.blog;

  // Validation
  if (!data?.title) return res.status(400).json({ success: false, message: 'Title Required' });
  if (!data?.banner) return res.status(400).json({ success: false, message: 'Banner Required' });
  if (!data?.description) return res.status(400).json({ success: false, message: 'Description Required' });
  if (!data?.content) return res.status(400).json({ success: false, message: 'Content Required' });
  if (!data?.tags?.length) return res.status(400).json({ success: false, message: 'Tags Required' });

  try {
    // UPDATE existing blog
    if (resdata.blog_id) {
      const { data: updatedBlog, error } = await supabase
        .from('blogs')
        .update({
          title: data.title,
          banner: data.banner,
          description: data.description,
          content: data.content,
          tags: data.tags,
          draft: Boolean(resdata.draft),
          updated_at: new Date().toISOString(),
        })
        .eq('blog_id', resdata.blog_id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ message: 'Blog updated successfully', success: true, data: updatedBlog });
    }

    // Check for duplicate title by same author
    const { data: existing } = await supabase
      .from('blogs')
      .select('id')
      .eq('author_id', resdata.authorId)
      .eq('title', data.title)
      .eq('draft', false)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already published a blog with this title.' });
    }

    // CREATE new blog
    const blog_id = generateBlogId(resdata.authorId || 'unknown');

    const { data: savedBlog, error } = await supabase
      .from('blogs')
      .insert({
        blog_id,
        title: data.title,
        banner: data.banner,
        description: data.description,
        content: data.content,
        tags: data.tags,
        author_id: resdata.authorId,
        draft: Boolean(resdata.draft),
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ message: 'Blog published successfully', success: true, data: savedBlog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message, success: false });
  }
}

/**
 * SAVE DRAFT BLOG
 */
export async function DraftBlog(req, res) {
  const { blog, authorId, draft, blog_id } = req.body;

  if (!authorId) {
    return res.status(400).json({ success: false, message: 'Author ID is required' });
  }

  try {
    // UPDATE existing draft
    if (blog_id) {
      const { data: updatedBlog, error } = await supabase
        .from('blogs')
        .update({
          title: blog.title,
          banner: blog.banner,
          description: blog.description,
          content: blog.content,
          tags: blog.tags,
          draft: Boolean(draft),
          updated_at: new Date().toISOString(),
        })
        .eq('blog_id', blog_id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Blog updated successfully', data: updatedBlog });
    }

    // Check for duplicate draft title
    const { data: existing } = await supabase
      .from('blogs')
      .select('id')
      .eq('author_id', authorId)
      .eq('title', blog.title)
      .eq('draft', true)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already saved a draft with this title.' });
    }

    const newBlogId = generateBlogId(authorId);

    const { data: savedBlog, error } = await supabase
      .from('blogs')
      .insert({
        blog_id: newBlogId,
        title: blog.title,
        banner: blog.banner || null,
        description: blog.description || null,
        content: blog.content || null,
        tags: blog.tags || [],
        author_id: authorId,
        draft: Boolean(draft),
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ success: true, message: 'Blog saved as draft successfully', data: savedBlog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * UPDATE LIKE — increment or decrement blog like count + create/remove notification
 */
export async function updateLike(req, res) {
  const { blog_id, user_id, isLiked } = req.body;

  try {
    // Fetch current likes
    const { data: blog, error: fetchErr } = await supabase
      .from('blogs')
      .select('id, total_likes, author_id')
      .eq('_id', blog_id)    // blog_id here is the UUID _id
      .single();

    if (fetchErr || !blog) return res.status(404).json({ message: 'Blog not found' });

    const newLikes = isLiked ? blog.total_likes + 1 : Math.max(0, blog.total_likes - 1);

    await supabase.from('blogs').update({ total_likes: newLikes }).eq('id', blog.id);

    if (isLiked) {
      await supabase.from('notifications').insert({
        type: 'like',
        blog_id: blog.id,
        notification_for: blog.author_id,
        user_id: user_id,
      });
    } else {
      await supabase.from('notifications')
        .delete()
        .eq('blog_id', blog.id)
        .eq('type', 'like')
        .eq('user_id', user_id);
    }

    return res.status(200).json({ message: isLiked ? 'Like updated' : 'Like removed', updatedLikes: newLikes });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

/**
 * CHECK IF USER LIKED A BLOG
 */
export async function isLikedByUser(req, res) {
  const { blog_id, user_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('id')
      .eq('blog_id', blog_id)
      .eq('type', 'like')
      .eq('user_id', user_id)
      .maybeSingle();

    if (error) throw error;

    return res.status(200).json({ success: true, data: !!data });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

/**
 * ADD COMMENT — also creates notification
 */
export async function addComment(req, res) {
  const { user_id, blog_id, comment, replying_to, blog_author } = req.body;

  if (!comment || !comment.length) {
    return res.status(400).json({ message: 'Write something in the comment', success: false });
  }

  try {
    const commentObj = {
      blog_id,
      blog_author_id: blog_author,
      comment,
      commented_by: user_id,
      is_reply: !!replying_to,
      parent_id: replying_to || null,
    };

    const { data: newComment, error } = await supabase
      .from('comments')
      .insert(commentObj)
      .select('*, profiles:commented_by(id, name, image)')
      .single();

    if (error) throw error;

    // Increment comment counts on blog
    await supabase.rpc('increment_blog_comments', {
      blog_uuid: blog_id,
      is_reply: !!replying_to,
    }).catch(() => {
      // Fallback: manual update if RPC not set up
      supabase.from('blogs').select('total_comments, total_parent_comments').eq('id', blog_id).single()
        .then(({ data: b }) => {
          supabase.from('blogs').update({
            total_comments: (b?.total_comments || 0) + 1,
            total_parent_comments: replying_to ? b?.total_parent_comments : (b?.total_parent_comments || 0) + 1,
          }).eq('id', blog_id);
        });
    });

    // If this is a reply, add the new comment ID to the parent's children array
    if (replying_to) {
      const { data: parentComment } = await supabase
        .from('comments').select('children').eq('id', replying_to).single();

      const updatedChildren = [...(parentComment?.children || []), newComment.id];
      await supabase.from('comments').update({ children: updatedChildren }).eq('id', replying_to);
    }

    // Create notification
    await supabase.from('notifications').insert({
      type: replying_to ? 'reply' : 'comment',
      blog_id,
      notification_for: replying_to ? newComment.parent?.commented_by : blog_author,
      user_id,
      comment_id: newComment.id,
      replied_on_comment_id: replying_to || null,
    });

    return res.status(200).json({
      message: 'New Comment Added',
      data: newComment,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'An error occurred', success: false });
  }
}

/**
 * GET COMMENTS FOR A BLOG
 */
export async function getCommentData(req, res) {
  const { blog_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles:commented_by(id, name, image)')
      .eq('blog_id', blog_id)
      .eq('is_reply', false)
      .order('commented_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ message: 'Retrieved successfully', data, success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
}

/**
 * GET NOTIFICATIONS FOR A USER
 */
export async function getNotification(req, res) {
  const { user_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, type, seen, created_at')
      .eq('notification_for', user_id)
      .eq('seen', false)
      .neq('user_id', user_id);

    if (error) throw error;

    return res.status(200).json({
      new_notification_available: data && data.length > 0,
      data: data || [],
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

/**
 * GET ALL NOTIFICATIONS (paginated)
 */
export async function notification(req, res) {
  const { page = 1, filter, user_id } = req.body;
  const maxLimit = 5;
  const from = (page - 1) * maxLimit;
  const to = from + maxLimit - 1;

  try {
    let query = supabase
      .from('notifications')
      .select('id, type, seen, created_at, blogs:blog_id(title, blog_id), profiles:user_id(name, image), comments:comment_id(comment)')
      .eq('notification_for', user_id)
      .neq('user_id', user_id)
      .eq('seen', false)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filter && filter !== 'All') {
      query = query.eq('type', filter.toLowerCase());
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json({ message: 'Notifications retrieved', data, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}