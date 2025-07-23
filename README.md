# Urban cab 

## Overview
Urban cab is a backend prototype designed to manage user authentication and service requests efficiently. Built during an internship at Softcolon Technology Private Limited, this project showcases RESTful API development with secure JWT authentication and MongoDB integration.
I will continue this project as I get some time.

## Features
- User registration, login, logout, and account updates via secure APIs.
- Service request management with endpoints to add and retrieve services.
- Optimized performance with MongoDB indexing and logging for error tracking.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Security**: JSON Web Tokens (JWT)
- **Logging**: Winston

## Installation
1. Clone the repository: `git clone https://github.com/hbking00/Urban-cab.git`
2. Navigate to the project directory: `cd Urban-cab`
3. Install dependencies: `npm install`
4. Set up environment variables (e.g., JWT secret) in a `.env` file.
5. Start the server: `npm start`

## Usage
- Register a user via `POST /register` with `{ email, password }`.
- Log in via `POST /login` to receive a JWT token.
- Change password via `POST/change-password` to change password.
- to get current user via `GET / current-user` to get current user details 
- Add a service via `POST /add-service` with `{ description, userId }`.
- Retrieve services via `GET /get-all-services`.
- There are many more functionalities  you can clone it and check it. 

## Contributing
Contributions are welcome! Please fork the repository and submit pull requests. For major changes, please open an issue first to discuss.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
