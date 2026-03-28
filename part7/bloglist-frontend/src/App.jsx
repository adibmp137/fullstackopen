import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Link } from "react-router-dom";
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

  if (notification.message === null) {
    return null;
  }

  const className = `notification ${notification.color === "green" ? "success" : "error"}`;

  return <div className={className}>{notification.message}</div>;
};

const BlogList = ({ blogs, blogFormRef, addBlog }) => {
  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
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
      const user = await loginService.login({
        username,
        password,
      });
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
      <div className="login-form">
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            <label>username</label>
            <input
              data-testid="username"
              type="text"
              value={username}
              autoComplete="username"
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label>password</label>
            <input
              data-testid="password"
              type="password"
              value={password}
              autoComplete="current-password"
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <nav>
        <Link to="/">blogs</Link>
        <Link to="/users">users</Link>
        <span>{user.name} logged-in</span>
        <button onClick={logOut}>logout</button>
      </nav>
      <h2>blog app</h2>
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
    </div>
  );
};

export default App;
