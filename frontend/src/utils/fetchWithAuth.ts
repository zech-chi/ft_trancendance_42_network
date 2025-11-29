/**
 * Fetch wrapper that automatically handles token refresh on 401 errors
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  // Ensure credentials are included
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include',
  };

  // Make the initial request
  let response = await fetch(url, fetchOptions);

  // If we get a 401 or 403, try to refresh the token
  if (response.status === 401 || response.status === 403) {
    console.log('Access token expired. Attempting refresh...');

    // Try to refresh the token
    const refreshRes = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!refreshRes.ok) {
      console.warn('Refresh token invalid or expired. Redirecting to login...');
      // Redirect to login page but avoid infinite loops and unnecessary redirects
      // only redirect if im in a protected route  to avoid the pages of login/register/verify all the protected pages start with /protected
      
      if (window.location.pathname.startsWith('/protected')) {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please login again.');
    }

    console.log('Access token refreshed. Retrying request...');
    
    // Retry the original request with the new token
    response = await fetch(url, fetchOptions);
  }

  return response;
}
