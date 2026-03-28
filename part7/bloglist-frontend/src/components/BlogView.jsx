import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PersonIcon from "@mui/icons-material/Person";
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
          showNotification(`Blog "${blog.title}" deleted successfully`, "green"),
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
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          by {blog.author}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<OpenInNewIcon />}
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {blog.url}
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Chip
            icon={<FavoriteIcon />}
            label={`${blog.likes} likes`}
            variant="outlined"
            color="primary"
            size="medium"
            sx={{ borderRadius: 2 }}
          />
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            startIcon={<FavoriteIcon />}
            onClick={handleLike}
            sx={{ borderRadius: 2 }}
          >
            Like
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            added by {blog.user ? blog.user.name : "Unknown user"}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Remove
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>

        <form onSubmit={handleComment} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <TextField
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            placeholder="Add a comment..."
            size="small"
            fullWidth
            variant="outlined"
          />
          <Button type="submit" variant="contained" size="small" sx={{ whiteSpace: "nowrap" }}>
            Add Comment
          </Button>
        </form>

        <List dense>
          {blog.comments
            ? blog.comments.map((c, i) => (
                <ListItem key={i} disablePadding>
                  <ListItemText
                    primary={c}
                    sx={{
                      bgcolor: "primary.light",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      mb: 0.5,
                    }}
                  />
                </ListItem>
              ))
            : null}
        </List>
      </CardContent>
    </Card>
  );
};

export default BlogView;
