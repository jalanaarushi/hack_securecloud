# Secure Cloud Storage Solution

A full-stack application with AWS integration for secure data storage with encryption at rest using AWS KMS and DynamoDB.

## Features

- **User Authentication**: AWS Cognito-based login system
- **Secure Data Storage**: Data encrypted using AWS KMS before storing in DynamoDB
- **Data Retrieval**: Encrypted data is decrypted on retrieval
- **Token-based Authorization**: Cognito JWT token-based API access control

## Project Structure

```
hack/
├── Frontend1/          # React frontend application
│   ├── src/
│   │   ├── components/ # React components (Login, Dashboard, Navbar)
│   │   ├── App.js     # Main app component
│   │   └── index.js   # Entry point
│   └── package.json   # Frontend dependencies
├── backend/            # Express.js backend API
│   ├── config/         # AWS configuration
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Authentication middleware
│   ├── routes/         # API routes
│   ├── app.js          # Server entry point
│   └── package.json    # Backend dependencies
└── package.json        # Root package.json (legacy)
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- AWS Account with:
  - AWS Cognito User Pool configured
  - AWS KMS key created
  - DynamoDB table named "SecureData"
  - IAM credentials configured (via AWS CLI or environment variables)

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5001
AWS_REGION=ap-south-1
KMS_KEY_ID=your-kms-key-id-here
JWT_SECRET=your-jwt-secret-here  # Optional if using Cognito tokens
```

**Note**: AWS credentials should be configured via:
- AWS CLI: `aws configure`
- Or environment variables: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- Or IAM role (if running on EC2)

### 2. Frontend Setup

```bash
cd Frontend1
npm install
```

Update `Frontend1/src/aws-exports.js` with your AWS Cognito configuration:
- User Pool ID
- App Client ID
- Region

### 3. AWS Resources Setup

1. **DynamoDB Table**: Create a table named `SecureData` with:
   - Partition key: `id` (String)

2. **KMS Key**: Create a KMS key and note the Key ID

3. **Cognito User Pool**: 
   - Create a User Pool
   - Create an App Client
   - Enable USER_PASSWORD_AUTH flow
   - Update `aws-exports.js` and `Login.js` with your credentials

## Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

Server will run on `http://localhost:5001`

### Start Frontend

```bash
cd Frontend1
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### POST /data
Store encrypted data

**Headers:**
```
Authorization: Bearer <cognito-token>
```

**Body:**
```json
{
  "data": "your data here"
}
```

**Response:**
```json
{
  "message": "Data added successfully",
  "id": "uuid-of-stored-data"
}
```

### GET /data/:id
Retrieve and decrypt data

**Headers:**
```
Authorization: Bearer <cognito-token>
```

**Response:**
```json
{
  "data": "your decrypted data"
}
```

## Authentication Flow

1. User logs in via Cognito (Login component)
2. Cognito returns JWT token (IdToken)
3. Token is stored in localStorage
4. Token is sent with API requests in Authorization header
5. Backend middleware decodes and validates token

## Troubleshooting

### Frontend won't start
- Make sure all dependencies are installed: `cd Frontend1 && npm install`
- Check that `package.json` includes all required dependencies

### Backend authentication errors
- Verify Cognito token is being sent correctly
- Check that token hasn't expired
- Ensure middleware is properly configured

### AWS connection errors
- Verify AWS credentials are configured
- Check AWS_REGION matches your resources
- Ensure KMS_KEY_ID is correct
- Verify DynamoDB table exists and is accessible

### CORS errors
- Backend has CORS enabled, but verify frontend URL is allowed

## Development Notes

- Authentication middleware currently decodes Cognito tokens without full verification for development
- For production, implement proper Cognito token verification using public keys
- Ensure all sensitive data is in `.env` files (not committed to git)

## License

This project is part of a hackathon submission.

