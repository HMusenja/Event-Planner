import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { FaUsers, FaDollarSign, FaTicketAlt } from "react-icons/fa";

function ViewDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId } = location.state || {}; // Get eventId from location state
  const [event, setEvent] = useState(null); // State for event details
  const [attendees, setAttendees] = useState([]);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);

  // Log location state for debugging
  console.log("Location State:", location.state);

  // Check if eventId exists
  if (!eventId) {
    console.error("Event ID is not passed to the ViewDetails component");
    return (
      <div className="container mx-auto mt-10 px-4 py-6 text-center text-white">
        <h1 className="text-4xl font-bold">Event Not Found</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 mt-4 bg-gray-500 rounded-md text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Fetch event details using eventId
  const fetchEventDetails = async () => {
    try {
      const eventDocRef = doc(db, "events", eventId);
      const eventDoc = await getDoc(eventDocRef);

      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        setEvent({ id: eventDoc.id, ...eventData });
        console.log("Fetched Event Data:", eventData);

        // Calculate days left
        const eventDate = new Date(eventData.date);
        const today = new Date();
        const timeDiff = eventDate - today;
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        setDaysLeft(days);

        // Fetch attendees
        fetchAttendees(eventId, eventData.ticketPrice || 0);
      } else {
        console.log("No such event found!");
      }
    } catch (err) {
      console.error("Error fetching event data:", err);
    }
  };

  // Fetch attendees and calculate tickets sold and revenue
  const fetchAttendees = async (eventId, ticketPrice) => {
    try {
      const attendeesCollection = collection(db, `events/${eventId}/attendees`);
      const attendeeSnapshot = await getDocs(attendeesCollection);

      const attendeeList = attendeeSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        specialRequirements: doc.data().specialRequirements || "None",
      }));

      console.log("Fetched Attendees:", attendeeList);

      const ticketsSold = attendeeList.reduce(
        (sum, attendee) => sum + (attendee.ticketCount || 0),
        0
      );
      const totalRevenue = attendeeList.reduce(
        (sum, attendee) => sum + (attendee.ticketCount || 0) * ticketPrice,
        0
      );

      setAttendees(attendeeList);
      setTotalTicketsSold(ticketsSold);
      setTotalRevenue(totalRevenue);
    } catch (err) {
      console.error("Error fetching attendees:", err);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const chartData = {
    labels: attendees.map((attendee) => attendee.name),
    datasets: [
      {
        label: "Tickets Purchased",
        data: attendees.map((attendee) => attendee.ticketCount || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto mt-10 px-4 py-6 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 min-h-screen text-white">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-500 rounded-md text-white mb-6"
      >
        Go Back
      </button>

      {event ? (
        <>
          <h1 className="text-4xl font-bold text-center mb-6">{event.eventName}</h1>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Days Left to Event</h2>
            <p className="text-4xl font-bold mt-4">{daysLeft} days</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-purple-800 p-6 rounded-lg text-center shadow-lg">
              <FaUsers size={36} className="mx-auto mb-3 text-blue-400" />
              <h3 className="text-xl font-semibold">Number of Attendees</h3>
              <p className="text-3xl font-bold">{attendees.length}</p>
            </div>
            <div className="bg-purple-800 p-6 rounded-lg text-center shadow-lg">
              <FaTicketAlt size={36} className="mx-auto mb-3 text-green-400" />
              <h3 className="text-xl font-semibold">Total Tickets Sold</h3>
              <p className="text-3xl font-bold">{totalTicketsSold}</p>
            </div>
            <div className="bg-purple-800 p-6 rounded-lg text-center shadow-lg">
              <FaDollarSign size={36} className="mx-auto mb-3 text-yellow-400" />
              <h3 className="text-xl font-semibold">Total Revenue</h3>
              <p className="text-3xl font-bold">${totalRevenue}</p>
            </div>
          </div>

          <div className="bg-purple-900 p-6 rounded-lg shadow-lg mb-10">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Tickets Purchased per Attendee
            </h2>
            {attendees.length > 0 ? (
              <Bar data={chartData} />
            ) : (
              <p className="text-center">No attendees yet.</p>
            )}
          </div>

          <div className="bg-purple-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6">Attendee List</h2>
            {attendees.length > 0 ? (
              <table className="table-auto w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Tickets Purchased</th>
                    <th className="px-4 py-2">Amount Paid</th>
                    <th className="px-4 py-2">Special Requirements</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((attendee, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-purple-800" : "bg-purple-700"
                      }`}
                    >
                      <td className="px-4 py-2">{attendee.name || "N/A"}</td>
                      <td className="px-4 py-2">{attendee.ticketCount || 0}</td>
                      <td className="px-4 py-2">
                        $
                        {attendee.ticketCount
                          ? attendee.ticketCount * (event.ticketPrice || 0)
                          : 0}
                      </td>
                      <td className="px-4 py-2">{attendee.specialRequirements || "None"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center">No attendees yet.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading event details...</p>
      )}
    </div>
  );
}

export default ViewDetails;

