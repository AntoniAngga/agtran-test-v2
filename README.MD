# Agtran Test

i join freelance project, from agtran test. wish me luck guys 😇, so this code writing with Typescript.

## Docker

if you want, to running docker. make sure your docker has installer.
so running this

```script
npm run docker
```

the url using localhost:5000

## REST API List of Authentification routes

| Routes                              | HTTP | Auth  | Description                  |
| ----------------------------------- | ---- | ----- | ---------------------------- |
| /api/v1/auth/login                  | POST | false | Login and get Token User JWT |
| /api/v1/auth/:userId/changepassword | POST | false | Change Password with user id |

## REST API List of User routes

| Routes               | HTTP   | Auth  | Description                   |
| -------------------- | ------ | ----- | ----------------------------- |
| /api/v1/user         | GET    | false | Get All User or find all user |
| /api/v1/user/:userId | PUT    | false | Update user from user Id      |
| /api/v1/user/:userId | Delete | false | Delete user from user Id      |
| /api/v1/user/        | POST   | false | Create new User               |
| /api/v1/user/:userId | GET    | false | Get User with user id         |

## OAuth Login

| Routes             | HTTP | Auth | Description             |
| ------------------ | ---- | ---- | ----------------------- |
| /api/v1/auth/login | GET  | true | With Google ouath login |

Thanks
