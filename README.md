# Agtran Test

i join freelance project, from agtran test. wish me luck guys 😇

# API DOCS

To start the api all link goes to <br>
Url Server Development = https://agtran-test.herokuapp.com

When you want access the User Table, you should bring JWT Token from Login. Set to your header

```javascript
  Authorization: <TOKEN>
```

## REST API List of Authentification routes :

| Routes                               | HTTP | Auth  | Description                  |
| ------------------------------------ | ---- | ----- | ---------------------------- |
| /api/v1/auth/login                   | POST | false | Login and get Token User JWT |
| /api/v1/auth/change_password/:userId | POST | true  | Change Password with user id |

## REST API List of User routes :

| Routes               | HTTP   | Auth  | Description                   |
| -------------------- | ------ | ----- | ----------------------------- |
| /api/v1/user         | GET    | true  | Get All User or find all user |
| /api/v1/user/:userId | PUT    | true  | Update user from user Id      |
| /api/v1/user/:userId | Delete | true  | Delete user from user Id      |
| /api/v1/user/        | POST   | false | Create new User               |
| /api/v1/user/:userId | GET    | true  | Get User with user id         |
