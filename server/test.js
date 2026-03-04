const { isEmail, isEmpty, isJWT } = require("validator")

console.log(isJWT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTlmYzA1NDYxZDkwZTIxOTMyNGMxNTMiLCJpYXQiOjE3NzIwODEwODksImV4cCI6MTc3MjA4MTk4OX0.pGtXWvqpZ2k47VHmJhkHLVa42BqPylLII9EUMarqQLAs"))
