import React, { useContext, useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap";
import { AuthContext } from "../../Shared/authContext/authContext";
import apiCall from "../../Shared/Services/apiCalls";

function ParkingHistory() {
    const [parkingHistories, setParkingHistories] = useState([]);
    const [error, setError] = useState("");
    const { user } = useContext(AuthContext);

    // Fetch Parking History
    const fetchParkingHistories = async () => {
        if (user?.userRole === "USER") {
            try {
                const data = await apiCall({ endpoint: `/api/Reservations/GetReservationDetailsByClient/${user.id}`, method: "GET", isAuthenticated: true });
                setParkingHistories(data);
            } catch (err) {
                setError("Failed to fetch parking histories.");
            }
        } else {
            try {
                const data = await apiCall({ endpoint: "/api/Reservations/GetReservationDetails", method: "GET", isAuthenticated: true });
                setParkingHistories(data);
            } catch (err) {
                setError("Failed to fetch parking histories.");
            }
        }
    };

    useEffect(() => {
        fetchParkingHistories();
    }, []);

    return (
        <div className="p-4">
            <h1>Parking History Management</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <div style={{ overflowX: 'auto' }}>
        
                    <Table striped bordered hover responsive style={{ tableLayout: 'auto', minWidth: '1200px' }}>
                        <thead>
                            <tr>
                                {/* <th style={{ width: '20%',whiteSpace: 'nowrap' }}>Client ID</th>
                                <th style={{ width: '20%',whiteSpace: 'nowrap' }}>Car ID</th>
                                <th style={{ width: '20%',whiteSpace: 'nowrap' }}>Reservation ID</th>
                                <th style={{ width: '20%',whiteSpace: 'nowrap' }}>Location ID</th> */}
                                <th style={{ width: '20%',whiteSpace: 'nowrap' }}>Location Name</th>
                                {user?.userRole === "ADMIN" && <th style={{ width: '20%',whiteSpace: 'nowrap' }}>User Name</th>}
                                <th style={{ width: '20%',whiteSpace: 'nowrap' }}>Phone Number</th>
                                <th style={{ width: '20%',whiteSpace: 'nowrap' }}>Email</th>
                                <th style={{ width: '20%',whiteSpace: 'nowrap' }}>Entry Time</th>
                                <th style={{ width: '20%',whiteSpace: 'nowrap' }}>Exit Time</th>
                                <th style={{ width: '20%', whiteSpace: 'nowrap' }}>Total Fee</th> {/* Prevent wrapping */}
                            </tr>
                        </thead>
                        <tbody>
                            {parkingHistories.map((history) => (
                                <tr >
                                    {/* <td>{history.clientId}</td>
                                    <td>{history.carId}</td>
                                    <td>{history.reservationId}</td>
                                    <td>{history.locationId}</td> */}
                                    <td>{history.locationName}</td>
                                    {user?.userRole === "ADMIN" && <td>{history.userName}</td>}
                                    <td>{history.phoneNumber}</td>
                                    <td>{history.email}</td>
                                    <td>{history.startTime}</td>
                                    <td>{history.endTime}</td>
                                    <td>{history.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
            
            </div>
        </div>
    );
}

export default ParkingHistory;
