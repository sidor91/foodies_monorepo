const TECHNICAL_AUTH_MESSAGES = new Set([
  "Authorization token required",
  "Invalid or expired token",
  "Refresh token required",
  "Invalid or expired refresh token",
]);

const SESSION_EXPIRED_MESSAGE = "Your session has expired. Please sign in again.";

const getErrorMessage = (error) => {
  const serverMessage = error.response?.data?.message;

  if (TECHNICAL_AUTH_MESSAGES.has(serverMessage)) {
    return SESSION_EXPIRED_MESSAGE;
  }

  if (serverMessage) {
    return serverMessage;
  }

  if (error.message) {
    return error.message;
  }

  return "Something went wrong";
};

export default getErrorMessage;
