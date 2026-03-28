import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Blog = ({ blog }) => {
  return (
    <Card sx={{ mb: 1.5 }} elevation={1}>
      <CardActionArea component={RouterLink} to={`/blogs/${blog.id}`}>
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography variant="body1" fontWeight={500}>
            {blog.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {blog.author}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
  }).isRequired,
};

export default Blog;
