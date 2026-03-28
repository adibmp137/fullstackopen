import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return { toggleVisibility };
  });

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={hideWhenVisible}>
        <Button variant="contained" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </Box>
      <Box sx={showWhenVisible}>
        <Paper elevation={2} sx={{ p: 3 }}>
          {props.children}
          <Button
            variant="outlined"
            onClick={toggleVisibility}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Paper>
      </Box>
    </Box>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

Togglable.displayName = "Togglable";

export default Togglable;
