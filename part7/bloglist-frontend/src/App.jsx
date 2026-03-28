import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Link as RouterLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import BlogView from "./components/BlogView";
import Users from "./components/Users";
import User from "./components/User";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import { showNotification } from "./reducers/notificationReducer";
import { initializeBlogs, createBlog } from "./reducers/blogReducer";
import { setUser, clearUser } from "./reducers/userReducer";

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  if (notification.message === null) {
    return null;
  }

  const severity = notification.color === "green" ? "success" : "error";

  return (
    <Snackbar
      open={notification.message !== null}
      autoHideDuration={5000}
      onClose={() => dispatch({ type: "notification/clearNotification" })}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={severity} variant="filled" sx={{ width: "100%" }}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

const BlogList = ({ blogs, blogFormRef, addBlog }) => {
  return (
    <Box>
      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </Box>
  );
};

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const blogFormRef = useRef();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(showNotification("Wrong username or password", "red"));
    }
  };

  const logOut = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(clearUser());
    blogService.setToken(null);
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    const newBlog = await dispatch(createBlog(blogObject));
    dispatch(
      showNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
        "green",
      ),
    );
  };

  if (user === null) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 8,
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <IconButton
                color="primary"
                sx={{ mb: 1, bgcolor: "primary.light" }}
              >
                <MenuBookIcon fontSize="large" />
              </IconButton>
              <Typography variant="h5" component="h2" fontWeight={500}>
                Sign in
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Log in to the Blog application
              </Typography>
            </Box>
            <Notification />
            <form onSubmit={handleLogin}>
              <TextField
                label="Username"
                data-testid="username"
                type="text"
                value={username}
                autoComplete="username"
                name="Username"
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={({ target }) => setUsername(target.value)}
              />
              <TextField
                label="Password"
                data-testid="password"
                type="password"
                value={password}
                autoComplete="current-password"
                name="Password"
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={({ target }) => setPassword(target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 1 }}
            component={RouterLink}
            to="/"
          >
            <MenuBookIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mr: 3, fontWeight: 500 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Blogs
          </Button>
          <Button color="inherit" component={RouterLink} to="/users">
            Users
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" sx={{ mr: 2, opacity: 0.9 }}>
            {user.name} logged in
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={logOut}
            sx={{ borderColor: "rgba(255,255,255,0.5)" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Notification />
        <Routes>
          <Route
            path="/"
            element={
              <BlogList
                blogs={blogs}
                blogFormRef={blogFormRef}
                addBlog={addBlog}
              />
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogView />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
