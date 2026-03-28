import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { likeBlog, removeBlog } from "../reducers/blogReducer";
import { showNotification } from "../reducers/notificationReducer";

const BlogView = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const id = useParams().id;
  const blog = blogs.find((b) => b.id === id);

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

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </div>
      <div>added by {blog.user ? blog.user.name : "Unknown user"}</div>
      <button onClick={handleDelete}>remove</button>
    </div>
  );
};

export default BlogView;
