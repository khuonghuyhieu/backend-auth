Overview of dependencies

- express: the web framework
- jsonwebtoken: library for signing/creating and verifying/validating JSON Web Tokens (JWT), often pronounced 'JOT' for some reason.
- bcryptjs: library for hashing strings like password and then comparing the hash to strings for validation.
- morgan: library for logs that can be helpful for debugging
- dotenv: library to allow for use of .env files
- mercedlogger: A library I created for colorful logs
- mongoose: ODM for connecting and sending queries to a mongo database
- cors: adds cors headers so our frontend app can make requests

- Read docs:

* handle with mongodb: https://mongoosejs.com/docs/guide.html
* jwt: https://jwt.io/introduction

Store token

1. Local store
   Attack with XSS
2. Cookies
   Attack with CSRF -> firewall with samesite
3. HTTPONLY Cookies an toàn nhất

Using:
Redux store -> access token
HTTPONLY Cookies -> refresh token

bảo mật tối ưu nhất: BFF PATTEN (Backend for Fontend)
