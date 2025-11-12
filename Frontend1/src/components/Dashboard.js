import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [inputData, setInputData] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    // Note: You'll need to replace 'your-id' with an actual data ID after creating data
    // For now, we'll skip the GET request on initial load
    // axios.get('http://localhost:5001/data/your-id', {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    // .then((response) => {
    //   setData(response.data);
    // })
    // .catch((error) => console.error('Error fetching data:', error));
  }, [navigate]);

  const handleSubmit = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      navigate('/');
      return;
    }
    
    axios.post('http://localhost:5001/data', 
      { data: inputData }, 
      { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        alert('Data stored successfully! ID: ' + response.data.id);
        setInputData('');
        // Optionally fetch the stored data using the returned ID
        if (response.data.id) {
          axios.get(`http://localhost:5001/data/${response.data.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then((fetchResponse) => {
            setData(fetchResponse.data);
          })
          .catch((fetchError) => {
            console.error('Error fetching stored data:', fetchError);
          });
        }
      })
      .catch((error) => {
        console.error('Error storing data:', error);
        alert('Error storing data: ' + (error.response?.data || error.message));
      });
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <input 
          type="text" 
          value={inputData} 
          onChange={(e) => setInputData(e.target.value)} 
          placeholder="Enter data to store" 
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div>
        <h3>Stored Data:</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Dashboard;
