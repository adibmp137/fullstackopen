import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={addBlog}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          data-testid="title-input"
          type="text"
          value={title}
          name="Title"
          placeholder="title"
          fullWidth
          size="small"
          variant="outlined"
          onChange={({ target }) => setTitle(target.value)}
        />
        <TextField
          label="Author"
          data-testid="author-input"
          type="text"
          value={author}
          name="Author"
          placeholder="author"
          fullWidth
          size="small"
          variant="outlined"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <TextField
          label="URL"
          data-testid="url-input"
          type="text"
          value={url}
          name="Url"
          placeholder="url"
          fullWidth
          size="small"
          variant="outlined"
          onChange={({ target }) => setUrl(target.value)}
        />
        <Button type="submit" variant="contained">
          Create
        </Button>
      </Stack>
    </form>
  );
};

export default BlogForm;
