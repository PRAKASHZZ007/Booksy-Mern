import { Alert, Box } from "@mui/material";

const ErrorMessage = () => (
  <Box display="flex" justifyContent="center" mt={3}>
    <Alert severity="error" sx={{ width: "100%", maxWidth: 400 }}>
      Something went wrong!
    </Alert>
  </Box>
);

export default ErrorMessage;