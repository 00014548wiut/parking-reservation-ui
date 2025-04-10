import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCar, FaMapMarker, FaHistory, FaCreditCard, FaBan, FaCalendarCheck, FaUsers } from 'react-icons/fa';

const Sidebar = () => {

    return (
        <div>
            <ListGroup>
                <ListGroup.Item><Link to="/cars"><FaCar /> Cars</Link></ListGroup.Item>
                <ListGroup.Item><Link to="/locations"><FaMapMarker /> Locations</Link></ListGroup.Item>
                <ListGroup.Item><Link to="/parking-history"><FaHistory /> Parking History</Link></ListGroup.Item>
                {/* <ListGroup.Item><Link to="/payments"><FaCreditCard /> Payments</Link></ListGroup.Item> */}
                <ListGroup.Item><Link to="/penalties"><FaBan /> Penalties</Link></ListGroup.Item>
                <ListGroup.Item><Link to="/reservations"><FaCalendarCheck /> Reservations</Link></ListGroup.Item>
                <ListGroup.Item><Link to="/users"><FaUsers /> Users1</Link></ListGroup.Item>
                <ListGroup.Item><Link to="/localadmins"><FaUsers /> Local Admin</Link></ListGroup.Item>
                {/* <ListGroup.Item><Link to="/logout"><FaSignOut /> Logout</Link></ListGroup.Item> */}
            </ListGroup>
        </div>
    );
};

export default Sidebar;
