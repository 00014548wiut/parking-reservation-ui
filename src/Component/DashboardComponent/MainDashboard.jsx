import React, { useContext, useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa'; // Importing the user icon
import { AuthContext } from '../../Shared/authContext/authContext';
import apiCall from '../../Shared/Services/apiCalls';

function MainDashboard() {
  // You can replace the following value with the actual total user count
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
      try {
          const data = await apiCall({ endpoint: "/api/Users/GetAll", method: "GET", isAuthenticated: true });
          setUsers(data); // Assuming the response is an array of users
      } catch (err) {
          setError("Failed to fetch users.");
      }
  };

  useEffect(() => {
      fetchUsers();
  }, []);

  const { user } = useContext(AuthContext);

  return (
    <Container className="mt-5">
      <h1>Welcome {user?.userRole === "USER" ? "User" : user?.userRole === "LOCALADMIN" ? "Local Admin" : "Admin"}!</h1>

      {/* Card displaying the total number of users */}
      {user?.userRole === "USER" || user?.userRole === "LOCALADMIN" ? null :
      <Row className="mt-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text className='d-flex justify-content-center align-items-center'>
                {/* Add the user icon with the number of users */}
                <FaUser style={{ fontSize: '25px', marginRight: '10px' }} />
                <h3 className='m-0'>{users.length}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
}
    </Container>
  );
}

export default MainDashboard;
