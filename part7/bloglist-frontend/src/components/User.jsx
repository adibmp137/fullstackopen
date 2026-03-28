import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Paper from "@mui/material/Paper";
import DescriptionIcon from "@mui/icons-material/Description";
import { initializeUsers } from "../reducers/usersReducer";

const User = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const id = useParams().id;

  useEffect(() => {
    if (users.length === 0) {
      dispatch(initializeUsers());
    }
  }, [dispatch, users.length]);

  const user = users.find((u) => u.id === id);

  if (!user) {
    return null;
  }

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        {user.name}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Added blogs
      </Typography>
      <Paper elevation={2}>
        <List>
          {user.blogs.map((blog) => (
            <ListItem key={blog.id}>
              <ListItemIcon>
                <DescriptionIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={blog.title} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default User;
