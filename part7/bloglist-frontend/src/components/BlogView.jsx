import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { likeBlog, removeBlog, addComment } from "../reducers/blogReducer";
import { showNotification } from "../reducers/notificationReducer";

const BlogView = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const id = useParams().id;
  const blog = blogs.find((b) => b.id === id);
  const [comment, setComment] = useState("");

  if (!blog) {
    return null;
  }

  const handleLike = async () => {
    try {
      await dispatch(likeBlog(blog));
    } catch (exception) {
      dispatch(showNotification("Failed to update likes", "red"));
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await dispatch(removeBlog(blog.id));
        dispatch(
          showNotification(
            `Blog "${blog.title}" deleted successfully`,
            "green",
          ),
        );
      } catch (exception) {
        dispatch(
          showNotification(
            "Failed to delete blog - unauthorized or server error",
            "red",
          ),
        );
      }
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();
    try {
      await dispatch(addComment(blog.id, comment));
      setComment("");
    } catch (exception) {
      dispatch(showNotification("Failed to add comment", "red"));
    }
  };

  return (
    <div className="blog-view">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div className="likes">
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </div>
      <div className="user-info">
        added by {blog.user ? blog.user.name : "Unknown user"}
      </div>
      <button className="remove" onClick={handleDelete}>
        remove
      </button>
      <div className="comments">
        <h3>comments</h3>
        <form onSubmit={handleComment}>
          <input
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <button type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments
            ? blog.comments.map((c, i) => <li key={i}>{c}</li>)
            : null}
        </ul>
      </div>
    </div>
  );
};

export default BlogView;
