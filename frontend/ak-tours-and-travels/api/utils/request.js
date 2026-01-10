// Helper functions for parsing Vercel serverless function requests

export async function parseRequest(req) {
  try {
    const body = await req.json();
    return body;
  } catch (e) {
    return {};
  }
}

export function getUrlParam(req, paramName) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    // Find the parameter index and return the value
    // This is a simple implementation - adjust based on your route structure
    return pathParts[pathParts.length - 1] || null;
  } catch (e) {
    return null;
  }
}

export function getMethod(req) {
  return req.method || 'GET';
}
