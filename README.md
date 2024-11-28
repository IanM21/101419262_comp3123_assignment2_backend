# COMP3123 Assignment Two - Employee Management System
### Ian McDonald - 101419262

## Table of Contents
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Employee Management](#employee-management)

## Installation

### Prerequisites
- NodeJS installed
- MongoDB installed and running

### Setup Instructions
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/emp_db
   JWT_SECRET=your_generated_secret
   ```

4. Generate JWT secret:
   ```bash
   node
   > require('crypto').randomBytes(64).toString('hex')
   ```
   Copy the output and set it as your JWT_SECRET in the .env file

5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

#### Create New User
```
POST /api/v1/user/signup
```
Request body:
```json
{
    "username": "user123",
    "email": "user@domain.com",
    "password": "pass123"
}
```

#### User Login
```
POST /api/v1/user/login
```
Request body:
```json
{
    "email": "user@domain.com",
    "password": "pass123"
}
```

### Employee Management
All employee endpoints require JWT authentication token in the request header:
```
Authorization: Bearer <your_jwt_token>
```

#### List All Employees
```
GET /api/v1/emp/employee
```

#### Create Employee
```
POST /api/v1/emp/employee
```
Request body:
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "johnd@gmail.com",
    "position": "Designer",
    "salary": 10000,
    "department": "Design"
}
```

#### Get Single Employee
```
GET /api/v1/emp/employee/{eid}
```

#### Update Employee
```
PUT /api/v1/emp/employee/{eid}
```
Request body example (partial update supported):
```json
{
    "salary": 100000
}
```

#### Delete Employee
```
DELETE /api/v1/emp/employee/{eid}
```

## Response Formats

All endpoints return JSON responses in the following format:

### Success Response
```json
{
    "message": "Operation successful",
    "data": { ... }
}
```

### Error Response
```json
{
    "message": "Error description",
    "error": "Error details"
}
```