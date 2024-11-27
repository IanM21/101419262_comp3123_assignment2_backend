# COMP3123 Assignment Two
## Ian McDonald - 101419262

### Installation Details
<li>Download & Install NodeJS</li>
<li>Install Dependencies: npm install</li>
<li>Create a .ENV file with paramaters of: PORT, MONGODB_URI & JWT_SECRET</li>
<li>Generate JWT_SECRET: open terminal, type 'node' and hit enter, finally run this code:
require('crypto').randomBytes(64).toString('hex') and enter the printed value to your env
</li>
<li>Run Project: npm run start</li>

### Endpoints
`/` accepts GET requests, displays welcome message <br>

`/api/v1/user/signup` POST request to sign up a new user, requires username, email, password <br>

`/api/v1/user/login` POST request to login, requires email & password <br>

`/api/v1/emp/employee` GET request to display all employees in JSON format <br>

`/api/v1/emp/employee` POST request to create a new employee (JWT AUTHENTICATED) <br>

`/api/v1/emp/employee/{eid}` GET request to list a singular employees details (JWT AUTHENTICATED) <br>

`/api/v1/emp/employee/{eid}` PUT request to update a singular employees details (JWT AUTHENTICATED) <br>

`/api/v1/emp/employee/{eid}` DELETE request to delete a singular employee (JWT AUTHENTICATED) <br>

### Endpoint Example Body Data
POST:
`/api/v1/user/signup` -> {"username": "user123", "email": "user@domain.com", "password": "pass123"} <br>

POST:
`/api/v1/user/login` -> {"email": "user@domain.com", "password": "pass123"} <br>

POST:
`/api/v1/emp/employee` -> {"first_name": "john", "last_name": "doe", "email": "johnd@gmail.com", "position": "Designer", "salary: 10000, "department": "Design"} <br>

PUT: 
`/api/v1/emp/employee/{eid}` -> {"salary": 100000}