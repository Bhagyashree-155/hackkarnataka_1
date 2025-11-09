# Debug: Empty Page Issue

## Quick Checks:

1. **Check if you're logged in:**
   - Open browser console (F12)
   - Type: `localStorage.getItem('user')`
   - If it returns `null`, you need to login first

2. **Check for JavaScript errors:**
   - Open browser console (F12)
   - Look for any red error messages
   - Share the error if you see any

3. **Check the URL:**
   - Make sure you're on `/dashboard` or `/admin-dashboard` or `/borrower-dashboard`
   - If you're on `/login`, login first

4. **Check if backend is running:**
   - Backend should be running on `http://localhost:5000`
   - Check: `http://localhost:5000/health`

5. **Check if frontend is running:**
   - Frontend should be running on `http://localhost:5173` (or similar)
   - Make sure the dev server is running

## Quick Fix:

If the page is completely empty (white screen):

1. **Clear browser cache and localStorage:**
   ```javascript
   // In browser console (F12):
   localStorage.clear()
   location.reload()
   ```

2. **Check if you're logged in:**
   - Go to `/login`
   - Login with your credentials
   - Should redirect to `/dashboard`

3. **If still empty, check console for errors**

## Common Issues:

- **Not logged in:** Page redirects to login (should see login page)
- **Backend not running:** API calls fail, page might be empty
- **JavaScript error:** Check browser console
- **Wrong route:** Make sure you're on the correct URL

