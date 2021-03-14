# API Routes

* GET /api/user/<username> - for account management, gives user details (need to secure)
* GET /api/session/<session UUID> - for running sessions, gives session details
* POST /api/login - login a specific user, try to use CSRF token; Probably need to call /api/user/<username> first for login credential validation
* POST /api/logout - logout a specific user (passed through POST data); server-side delete session
* CREATE /api/register
