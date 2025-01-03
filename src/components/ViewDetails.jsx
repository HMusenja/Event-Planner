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
  const { event } = location.state; // Get event data from the passed state
  const [attendees, setAttendees] = useState([]);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);

  // Calculate days left for the event
  useEffect(() => {
    const calculateDaysLeft = () => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const timeDiff = eventDate - today;
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setDaysLeft(days);
    };
    calculateDaysLeft();
  }, [event.date]);

  // Fetch attendees and calculate tickets sold and revenue
  const fetchAttendees = async (ticketPrice) => {
    try {
      const attendeesCollection = collection(db, `events/${event.id}/attendees`);
      const attendeeSnapshot = await getDocs(attendeesCollection);

      const attendeeList = attendeeSnapshot.docs.map((doc) => doc.data());

      // Calculate total tickets sold and total revenue
      const ticketsSold = attendeeList.reduce((sum, attendee) => sum + (attendee.ticketCount || 0), 0);
      const totalRevenue = attendeeList.reduce(
        (sum, attendee) => sum + (attendee.ticketCount || 0) * ticketPrice,
        0
      );

      setAttendees(attendeeList);
      setTotalTicketsSold(ticketsSold); // Update total tickets sold
      setTotalRevenue(totalRevenue);
    } catch (err) {
      console.error("Error fetching attendees:", err);
    }
  };

  // Fetch event data
  const fetchEventData = async () => {
    try {
      const eventDocRef = doc(db, "events", event.id);
      const eventDoc = await getDoc(eventDocRef);

      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        const ticketPrice = eventData.ticketPrice || 0;

        fetchAttendees(ticketPrice);
      } else {
        console.log("No such event found!");
      }
    } catch (err) {
      console.error("Error fetching event data:", err);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  // Prepare data for chart
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
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-500 rounded-md text-white mb-6"
      >
        Go Back
      </button>

      {/* Event Name */}
      <h1 className="text-4xl font-bold text-center mb-6">{event.eventName}</h1>

      {/* Countdown Timer */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold">Days Left to Event</h2>
        <p className="text-4xl font-bold mt-4">{daysLeft} days</p>
      </div>

      {/* Event Summary */}
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

      {/* Chart: Tickets per Attendee */}
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

      {/* Attendee List */}
      <div className="bg-purple-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Attendee List</h2>
        {attendees.length > 0 ? (
          <table className="table-auto w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Tickets Purchased</th>
                <th className="px-4 py-2">Amount Paid</th>
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
                  <td className="px-4 py-2">{attendee.name}</td>
                  <td className="px-4 py-2">{attendee.ticketCount}</td>
                  <td className="px-4 py-2">
                    ${attendee.ticketCount * event.ticketPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No attendees yet.</p>
        )}
      </div>
    </div>
  );
}

export default ViewDetails;



