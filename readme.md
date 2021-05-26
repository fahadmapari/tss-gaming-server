# API Details

## Auth routes

POST
`/api/auth/register`
`{ name: string, email: string, password: string, mobile: number , profilePic: file (optional), referCode: string (optional)}`

POST
`/api/auth/login`
`{ email: string, password: string }`

after successful login/register server will respond with user data and access token which will be inside httpOnly cookie and also access token is headers with header name of api-key.

---

`Google auth`

Route to get google auth url

GET
`/auth/google/url`

it will generate and return google auth url which you can put in a button/a tag

---

Route for mobile app google login/signup

POST
`/auth/google/mobile`

data to send `{ token: string }`

- token is the access token received from google.

---

`Facebook auth`

Route to get facebook auth url

GET
`/auth/facebook/url`

it will generate and return facebook auth url which you can put in a button/a tag

---

`Discord auth`

Route to get discord auth url

GET
`/auth/discord/url`

it will generate and return discord auth url which you can put in a button/a tag

---

Route to get discord auth url for mobile auth.

GET
`/discord/url/mobile`

it will generate and return discord auth url which you can put in a button/a tag or webview

---

Route to login/signup for mobile app.

POST
`/auth/discord/mobile-auth`
data to send`{ code: string }`

- code will be available in url as a paramenter after authrorizing discord through auth url. Extract the code from url and send it.

---

## Referral route

Route to for user to enter referral code after signing up through google, facebook, discord.

POST
`/refer`

data to send
`{ referCode: string }`

## OTP verfification routes

Route to generate OTP for mobile number

GET
`/auth/otp/:method`

- replace :method in url to either `mobile` or `email`

- this route will generate otp and send it to registered mobile number / email

User have to be registered / logged in to hit this route

http cookie or Bearer token required

---

Route to verify OTP code

POST
`/auth/otp/:method`
data to send `{ otp: string }`

- replace :method in url to either `mobile` or `email`

- this route will verify otp and send result in response

User have to be registered / logged in to hit this route

- If user provided correct otp a response will sent back containing
  {status: "approved"}

- That means the provided otp was correct

http cookie or Bearer token required

## Notification routes

Route to send/register fcm token

POST
`/notification-registeration`

data to send `{fcmToken: string}`

---

Route to send custom push notifications to users

`mentioned in admin routes`

## Profile routes

Route to get details of logged in user

GET
`/profile`

it will return all the details of logged in user

http cookie or Bearer token required

---

Route to get all the tournaments user have joined

GET
`/profile/tournaments`

- it can be paginated too like this

`/profile/tournaments?page=2&limit=10 (optional)`

- you can also get specific tournaments from it. upcoming, completed, ongoing

- like this `/profile/tournaments?status=upcoming (optional)`

- like this `/profile/tournaments?page=1&limit=10&status=upcoming (optional)`

http cookie or Bearer token required

---

Route to update user profile

POST
`/profile/update`

Data to send / data that can be edited:

`{ name, mobile, email, currentPassword, newPassword, profilePic: file }`

- newPassword only when password change is needed

- currentPassword always needed to update profile

http cookie or Bearer token required

---

Route to get user's transactions

GET
`/profile/transactions`

- it can be paginated too like this

`/profile/transactions?page=2&limit=10 (optional)`

response will consist of { user, order_id, orderDetails}

http cookie or Bearer token required

---

Route to get user's withdrawals

GET
`/profile/withdrawals`

- it can be paginated too like this

`/profile/withdrawals?page=2&limit=10 (optional)`

response will consist of {user, amount, upiID, status}

http cookie or Bearer token required

---

Route to get user's referrals

GET
`/profile/referrals`

- it can be paginated too like this

`/profile/referrals?page=1&limit=10 (optional)`

http cookie or Bearer token required

---

Route to get specific user details

GET
`/profile/:id`

- replace :id with user's id in url

this route route will return user details for any specific user.

No auth required

## User tournament routes

Route to get all tournaments [ "upcoming", "ongoing", "completed"]

GET
`/tournament/list`

- It will give all the tournaments and it can be paginated too like this

`/tournament/list?page=2&limit=10`

- you can also get specific tournaments from it. upcoming, completed, ongoing like this

`/tournament/list?status=upcoming`

all query parameters are optional

No auth required

---

Route to get joined users for a tournament

GET
`/tournament/:id/users`

- replace :id with tournament's "\_id" in url

- all tournaments have a unique id with property name "\_id"

It will return all the users who joined the tournament.

---

Route for user to join a tournament

POST
`/tournament/join`

data to send `{ tournamentId: string, teamMembers: [string, string, string]//array, teamName: string }`

- all tournaments have a unique id with property name "\_id" you have pass that as tournamentId in this id

successful response will return joined match/tournament details

http cookie or Bearer token required

---

Route to view leaderboard of a tournament

GET
`/leaderboard/:id`

- replace :id with tournament's "\_id" in url

- all tournaments have a unique id with property name "\_id"

When all winners are declared then this route will return list of winners with prize and stats details

## User coins routes

Route to buy coins

POST
`/coins/buy`

data to send `{ coins: string|number }`

- "coins" is the amount of coins users wants to purchase.

In response you will get order details which you will have to pass in razorpay sdk to complete the payment.

---

Route to withdraw coins

POST
`/coins/withdraw/request`

data to send `{ withdrawAmount: string|number, upiID: string }`

- minimum withdrawal amount is 1000

- "withdrawAmount" is the amount of coins users wants to withdraw.

User's coin will be deducted immediately and will placed for approval of admin.
Admin will accept or decline the withdraw request.
If declined coins will be returned to user.

Successful response will give withdrawal details back

---

- Admin routes will require an admin account.

## Admin routes

Route to get all users registered users on website.

GET
`/users`

- it can be paginated too like this

`/user?page=1&limit=10 (optional)`

- specific type of user can also be searched by adding `role` query parameter to url.

`/user?page=1&limit=10&role=sub-admin (optional)`

roles
`admin`
`sub-admin`
`user`

---

Route to search users by their name/gamername

POST
`/users/search`

data to send `{searchTerm: string}`

- "searchTerm" will be user's name/gamername.

- results can be paginated too like this

`/users/search?page=1&limit=10 (optional)`

---

Route to block users from the tss-gaming

GET
`/users/:id/block`

- replace ':id' in url with user's '\_id' every user have unique a unique id with property name '\_id'

- admin and sub-admin can block users. sub-admin can not block admin or other sub-admins.

---

Route to get all blocked users

GET
`/users/blocked`

- it can be paginated too like this

`/users/blocked?page=1&limit=10 (optional)`

- specific type of user can also be searched by adding `role` query parameter to url.

`/users/blocked?page=1&limit=10&role=sub-admin (optional)`

roles
`admin`
`sub-admin`
`user`

---

Route to unblock an user from tss-gaming

GET
`/users/:id/unblock`

- replace ':id' in url with user's '\_id' every user have unique a unique id with property name '\_id'

---

Admin route to create tournament

POST
`/tournament/create`
data to send

`{ title: string, thumbnails: [ files ], description: string, entryFee: number, date: Date (date and time both), tournamentType: string ("solo", "duo", "team"), kills: number, streak: number, damage: number, prize: number, roomId: string, roomPassword: string, stream: string, slots: number, game: string}`

- value of `game` will be '\_id' of game. Every game contains a unique '\_id' property.

successful response will return created tournament back

---

Route to get details of tournament to fill in fields to edit

GET
`/tournament/:id/edit`

- replace :id with tournament's "\_id" in url

- all tournaments have a unique id with property name "\_id"

---

Admin route to create tournament

POST
`/tournament/:id/edit`

data to send/can be edited
`{ title: string, thumbnails: [ files ], description: string, entryFee: number, date: Date (date and time both), tournamentType: string ("solo", "duo", "team"), kills: number, streak: number, damage: number, prize: number, roomId: string, roomPassword: string, stream: string, slots: number, game: string}`

- replace :id with tournament's "\_id" in url

- all tournaments have a unique id with property name "\_id"

- value of `game` will be '\_id' of game. Every game contains a unique '\_id' property.

---

Route to get pending withdrawal requests for admin

GET
`/coins/withdraw/pending`

- it can be paginated too like this

`/coins/withdraw/pending?page=2&limit=10 (optional)`

response will consist of { user, amount, upiID ,status }

---

Route to get all withdrawal requests for admin

GET
`/coins/withdraw`

- it can be paginated too like this

`/coins/withdraw?page=2&limit=10 (optional)`

response will consist of { user, amount, upiID ,status }

---

Route to respond to withdrawal requests

POST
`/coins/withdraw/respond/:id`
data to send`{ action: string ("accept || "decline")}`

- replace :id with withdrawal request's "\_id" in url

- all withdrawal requests have a unique id with property name "\_id"

- action can either be `accept` or `decline`

after admins send the payment to users the admin can click on accept or if admin don't to send and decline the request admin can click decline and the coins will return to users account.

---

Route to get all players to declare winners / add stats of match of all users who joined the tournament.

GET
`/tournament/leaderboard/:id/edit`

- replace :id with tournament's "\_id" in url

- all tournaments have a unique id with property name "\_id"

the result will consist of

`{ tournament, player, team, leaderboard, prize, kills, streak, damage, created_at, updated_at}`

---

Route declare winners / add stats of match of all users who joined the tournament.

POST
`/tournament/leaderboard/declare`

data to send
`userStats: [{ prizeWon: number, kills: number, streak: number, damage: number, matchId: string }]`

- every object received from GET `tournament/leaderboard/:id/edit` will have a unique "\_id" put that as matchId in userStats.

---

Route to get all games

GET
`/games`

---

Route to add new game.

POST
`"/new-game"`
data to send `title: string ,gameCover: file(image)`

it will create a new game which can used to link to tournaments.

---

Route to send custom push notifications to users

POST
`/send-push-notification`

data to send `{ title: string, body: string }`
