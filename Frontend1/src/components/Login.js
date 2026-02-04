import React, { useState } from 'react';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { useNavigate } from 'react-router-dom';

const client = new CognitoIdentityProviderClient({ region: 'ap-south-1' });

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: '5v4df4vuq3f3009eu8m5srhp05', // Replace with your Cognito User Pool Client ID
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    try {
      const command = new InitiateAuthCommand(params);
      const response = await client.send(command);
      const jwtToken = response.AuthenticationResult.IdToken;
      localStorage.setItem('token', jwtToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error('Error logging in:', err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
