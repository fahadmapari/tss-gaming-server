# API Details

## Routes

Auth routes

post
/api/auth/register
{ name: string, email: string, password: string, profilePic: file}

post
/api/auth/login
{ email: string, password: string }

after successful login/register server will respond with user data and access token which will be inside httpOnly cookie.
