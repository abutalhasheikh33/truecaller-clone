// Function to extract the Bearer token from the request headers
const extractBearerToken = (req) => {
    const authHeader = req.headers.authorization;
    return authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
  }

module.exports = extractBearerToken;