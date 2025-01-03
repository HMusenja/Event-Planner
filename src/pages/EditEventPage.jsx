import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/EditEventPage.css'

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    eventName: "",
    location: "",
    date: "",
    time: "",
    ticketQuantity: "",
    ticketPrice: "",
    eventImage: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEvent = () => {
    setLoading(true);
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const event = events.find((event) => event.id === parseInt(id));
    if (event) {
      setEventData(event);
      setLoading(false);
    } else {
      setLoading(false);
      navigate("/manage-events");
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!eventData.eventName) newErrors.eventName = "Event name is required.";
    if (!eventData.location) newErrors.location = "Location is required.";
    if (!eventData.date) newErrors.date = "Date is required.";
    if (!eventData.time) newErrors.time = "Time is required.";
    if (
      !eventData.ticketQuantity ||
      isNaN(eventData.ticketQuantity) ||
      eventData.ticketQuantity <= 0
    )
      newErrors.ticketQuantity = "Ticket quantity must be a positive number.";
    if (
      !eventData.ticketPrice ||
      isNaN(eventData.ticketPrice) ||
      eventData.ticketPrice <= 0
    )
      newErrors.ticketPrice = "Ticket price must be a positive number.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const events = JSON.parse(localStorage.getItem("events")) || [];
    const updatedEvents = events.map((event) =>
      event.id === parseInt(id) ? { ...event, ...eventData } : event
    );

    localStorage.setItem("events", JSON.stringify(updatedEvents));

    setSuccessMessage("Event updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);

    navigate("/manage-events");
  };

  return (
    <div className="edit-event-page">
      <div className="edit-event-container">
        <h1 className="page-title">Edit Event</h1>
        {successMessage && <p className="success-message">{successMessage}</p>}

        {loading ? (
          <p className="loading-message">Loading event details...</p>
        ) : (
          <form onSubmit={handleSubmit} className="edit-event-form">
            <div className="form-group">
              <label>Event Name</label>
              <input
                type="text"
                name="eventName"
                value={eventData.eventName}
                onChange={handleInputChange}
                placeholder="Enter event name"
              />
              {errors.eventName && <p className="error-text">{errors.eventName}</p>}
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={eventData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
              />
              {errors.location && <p className="error-text">{errors.location}</p>}
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleInputChange}
              />
              {errors.date && <p className="error-text">{errors.date}</p>}
            </div>

            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                name="time"
                value={eventData.time}
                onChange={handleInputChange}
              />
              {errors.time && <p className="error-text">{errors.time}</p>}
            </div>

            <div className="form-group">
              <label>Ticket Quantity</label>
              <input
                type="number"
                name="ticketQuantity"
                value={eventData.ticketQuantity}
                onChange={handleInputChange}
                placeholder="Enter ticket quantity"
              />
              {errors.ticketQuantity && (
                <p className="error-text">{errors.ticketQuantity}</p>
              )}
            </div>

            <div className="form-group">
              <label>Ticket Price</label>
              <input
                type="number"
                name="ticketPrice"
                value={eventData.ticketPrice}
                onChange={handleInputChange}
                placeholder="Enter ticket price"
              />
              {errors.ticketPrice && <p className="error-text">{errors.ticketPrice}</p>}
            </div>

            <button type="submit" className="submit-btn">
              Update Event
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditEventPage;
