import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { FiEdit, FiTrash2, FiCreditCard } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import apiCall from "../../Shared/Services/apiCalls";
import { AuthContext } from "../../Shared/authContext/authContext";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [cars, setCars] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch Reservations
  const fetchReservations = async () => {
    try {
      const endpoint =
        user?.userRole === "USER"
          ? `/api/Reservations/GetReservationDetailsByClient/${user.id}`
          :  user?.userRole === "LOCALADMIN"
          ? `/api/Reservations/GetReservationDetailsByClient/${user.id}`
          : "/api/Reservations/GetReservationDetails";
      const data = await apiCall({
        endpoint,
        method: "GET",
        isAuthenticated: true,
      });
      // setReservations(user?.userRole === "USER" ? [data] : data);
      setReservations(data);
    } catch (err) {
      setError("Failed to fetch reservations.");
    }
  };

  // Fetch Cars
  const fetchCars = async () => {
    try {
      const data = await apiCall({
        endpoint: `/api/Cars/GetByClient/${user.id}`,
        method: "GET",
        isAuthenticated: true,
      });
      setCars(data);
    } catch (err) {
      setError("Failed to fetch cars.");
    }
  };

  // Fetch Locations
  const fetchLocations = async () => {
    try {
      const data = await apiCall({
        //endpoint: "/api/Locations/GetAll",
        endpoint: `/api/Locations/GetAllLocationByID?id=${user.id}`,
        method: "GET",
        isAuthenticated: true,
      });
      setLocations(data);
    } catch (err) {
      setError("Failed to fetch locations.");
    }
  };

  const fetchLocationsById = async (id) => {
    try {
      const data = await apiCall({
        endpoint: `/api/Locations/Get/${id}`,
        method: "GET",
        isAuthenticated: true,
      });
      setValue("amount", data?.price || "");
    } catch (err) {
      setError("Failed to fetch location details.");
    }
  };

  // Handle Reservation Form Submission
  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        ClientId: user?.id,
        carId: Number(data.carId),
        locationId: Number(data.locationId),
        // startTime: new Date(data.startTime).toISOString(),
        // endTime: new Date(data.endTime).toISOString(),
        startTime: data.startTime,
        endTime: data.endTime,
      };
      if (editingReservation) {
        await apiCall({
          endpoint: `/api/Reservations/Complete/${editingReservation.reservationId}`,
          method: "PUT",
          payload,
          isAuthenticated: true,
        });
        toast.success("Reservation updated successfully.");
      } else {
        await apiCall({
          endpoint: "/api/Reservations/Create",
          method: "POST",
          payload,
          isAuthenticated: true,
        });
        toast.success("Reservation created successfully.");
      }
      fetchReservations();
      handleClose();
    } catch (err) {
      setError("Failed to save reservation.");
    }
  };

  const handlePaymentSubmit = async (data) => {
    console.log("click");
    const currentDateTime = new Date();
    const endTime = new Date(data.endTime);
    let isPenalty = 0;
    // Check if the current time exceeds the endTime
    if (currentDateTime > endTime) {
      // Calculate extra time and penalty
      const extraMinutes = Math.ceil((currentDateTime - endTime) / (1000 * 60)); // Extra minutes
      const penaltyAmount = 10; // Fixed penalty
      const totalAmount = Number(data.amount) + penaltyAmount;
      isPenalty = 1;
      const userConfirmed = window.confirm(
        `Your reservation has exceeded the allowed time by ${extraMinutes} minutes. A penalty of $${penaltyAmount} will be added. Total amount: $${totalAmount}. Do you wish to proceed?`
      );

      if (!userConfirmed) {
        setShowPaymentModal(false);
        toast.error("User denied the payment.");
        return;
      }

      // Update the payload with the penalty amount
      data.amount = totalAmount;
    }

    try {
      const payload = {
        reservationId: data.reservationId,
        locationId: data.locationId,
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod,
        isPenalty : isPenalty
      };
      await apiCall({
        endpoint: "/api/Payments/Create",
        method: "POST",
        payload,
        isAuthenticated: true,
      });
      toast.success("Payment added successfully.");
      setShowPaymentModal(false);
      fetchReservations();
    } catch (err) {
      toast.error("Failed to add payment.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        await apiCall({
          endpoint: `/api/Reservations/Delete/${id}`,
          method: "DELETE",
          isAuthenticated: true,
        });
        toast.success("Reservation deleted successfully.");
        setReservations((prev) => prev.filter((r) => r.reservationId !== id));
      } catch (err) {
        setError("Failed to delete reservation.");
      }
    }
  };

  const handleShow = (reservation = null) => {
    setEditingReservation(reservation);
    if (reservation) {
      setValue("carId", reservation.carId.toString());
      setValue("locationId", reservation.locationId.toString());
      setValue("startTime", reservation.startTime);
      setValue("endTime", reservation.endTime);
    } else {
      reset({
        carId: "",
        locationId: "",
        startTime: "",
        endTime: "",
      });
    }
    setShowModal(true);
  };

  const handleShowPaymentModal = (itemObj) => {
    console.log(itemObj, "itemObj");
    fetchLocationsById(itemObj.locationId);
    setValue("reservationId", itemObj.reservationId);
    setValue("locationId", itemObj.locationId);
    setValue("carId", itemObj.carId);
    setValue("startTime", itemObj.startTime);
    setValue("endTime", itemObj.endTime);

    // setValue("amount", "");
    setValue("paymentMethod", "");
    setShowPaymentModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setShowPaymentModal(false);
    setEditingReservation(null);
    reset();
  };

  useEffect(() => {
    fetchReservations();
    if (user.userRole === "USER" || user.userRole === "LOCALADMIN") {
      fetchCars();
      fetchLocations();
    }
  }, []);

  return (
    <div className="p-4">
      <h1>Reservations Management</h1>
      {user?.userRole !== "ADMIN" && (
        <Button onClick={() => handleShow()} className="mb-3">
          Add Reservation
        </Button>
      )}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Reservation ID</th>
            {user?.userRole === "ADMIN" && <th>Client Name</th>}
            <th>Car</th>
            <th>Location</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Payment Status</th>
            {user?.userRole !== "ADMIN" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.reservationId}>
              <td>{reservation.reservationId}</td>
              {user?.userRole === "ADMIN" && <td>{reservation.userName}</td>}
              <td>{reservation.carNumber}</td>
              <td>{reservation.locationName}</td>
              <td>{new Date(reservation.startTime).toLocaleString()}</td>
              <td>{new Date(reservation.endTime).toLocaleString()}</td>
              <td>{reservation.paymentStatus}</td>
              {user?.userRole !== "ADMIN" && (
                <td>
                  <FiEdit
                    className="text-warning me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleShow(reservation)}
                    title="Edit"
                  />
                  <FiTrash2
                    className="text-danger me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(reservation.reservationId)}
                    title="Cancel Reservation"
                  />
                  {reservation.paymentStatus === "PENDING" && (
                    <FiCreditCard
                      className={`text-success ${
                        reservation.paymentStatus === "PAID" ? "disabled" : ""
                      }`}
                      title="Make Payment"
                      style={{
                        cursor:
                          reservation.paymentStatus === "PAID"
                            ? "not-allowed"
                            : "pointer",
                        pointerEvents:
                          reservation.paymentStatus === "PAID"
                            ? "none"
                            : "auto",
                      }}
                      onClick={() => {
                        if (reservation.paymentStatus !== "PAID") {
                          handleShowPaymentModal(reservation);
                        }
                      }}
                    />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Reservation Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingReservation ? "Edit Reservation" : "Add Reservation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Car</Form.Label>
              <Form.Select
                {...register("carId", { required: "Car is required" })}
              >
                <option value="">Select a Car</option>
                {cars.map((car) => (
                  <option key={car.carId} value={car.carId}>
                    {car.carNumber}
                  </option>
                ))}
              </Form.Select>
              {errors.carId && (
                <small className="text-danger">{errors.carId.message}</small>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Select
                {...register("locationId", {
                  required: "Location is required",
                })}
              >
                <option value="">Select a Location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.locationId}>
                    {location.locationName}
                  </option>
                ))}
              </Form.Select>
              {errors.locationId && (
                <small className="text-danger">
                  {errors.locationId.message}
                </small>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                {...register("startTime", {
                  required: "Start time is required",
                })}
              />
              {errors.startTime && (
                <small className="text-danger">
                  {errors.startTime.message}
                </small>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                {...register("endTime", { required: "End time is required" })}
              />
              {errors.endTime && (
                <small className="text-danger">{errors.endTime.message}</small>
              )}
            </Form.Group>
            <Button type="submit" variant="primary">
              {editingReservation ? "Update" : "Add"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Payment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(handlePaymentSubmit)}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                {...register("amount")}
                disabled
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select {...register("paymentMethod")}>
                <option value="">Select Payment Method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Payment
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Reservations;
