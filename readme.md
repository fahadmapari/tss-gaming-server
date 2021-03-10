# API Details

## Routes

Auth routes

post
/api/auth/register
{ name, email, password, profile pic}

post
/api/auth/login
{ email, password }

after successful login/register server will respond with user data and access token which will be inside httpOnly cookie.
