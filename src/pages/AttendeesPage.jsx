import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc, // Import deleteDoc to remove attendee
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";

function AttendeesPage() {
  const location = useLocation();
  const { eventId } = location.state || {};
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [ticketForm, setTicketForm] = useState({
    name: "",
    ticketCount: "",
    specialRequirements: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    const fetchEventAndAttendees = async () => {
      if (!eventId) {
        setError("No event ID provided!");
        setLoading(false);
        return;
      }

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !user.uid) {
          throw new Error("User is not logged in.");
        }

        // Fetch event details
        const eventRef = doc(db, `users/${user.uid}/events`, eventId);
        const eventSnapshot = await getDoc(eventRef);

        if (!eventSnapshot.exists()) {
          setError("No such event found!");
          setLoading(false);
          return;
        }

        const eventData = eventSnapshot.data();
        console.log("Fetched event data:", eventData);

        setEvent({
          id: eventSnapshot.id,
          ...eventData,
          totalTickets: eventData.totalTickets || eventData.ticketQuantity || 0, // Ensure totalTickets is set
        });

        // Fetch attendees list
        const attendeesCollection = collection(
          db,
          `users/${user.uid}/events/${eventId}/attendees`
        );
        const attendeesSnapshot = await getDocs(attendeesCollection);

        const attendeesList = attendeesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched attendees:", attendeesList);
        setAttendees(attendeesList);
      } catch (err) {
        console.error("Error fetching event or attendees:", err);
        setError("An error occurred while fetching the event or attendees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndAttendees();
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketForm({ ...ticketForm, [name]: value });
  };

  const handleTicketPurchase = async (e) => {
    e.preventDefault();

    if (
      !ticketForm.name ||
      !ticketForm.ticketCount ||
      isNaN(ticketForm.ticketCount)
    ) {
      setFormError("Please provide a valid name and ticket count.");
      return;
    }

    const ticketCount = parseInt(ticketForm.ticketCount);

    if (ticketCount <= 0) {
      setFormError("Ticket count must be a positive number.");
      return;
    }

    if (event.ticketQuantity < ticketCount) {
      setFormError("Not enough tickets available.");
      return;
    }

    setFormError("");
    setFormSuccess("");

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user || !user.uid) {
        throw new Error("User is not logged in.");
      }

      // Update the event's ticket quantity and tickets sold in Firestore
      const eventRef = doc(db, `users/${user.uid}/events`, eventId);
      const updatedTicketQuantity = event.ticketQuantity - ticketCount;
      const updatedTicketsSold =
        (event.ticketsSold || 0) + ticketCount;

      console.log("Updating Firestore with:", {
        ticketQuantity: updatedTicketQuantity,
        ticketsSold: updatedTicketsSold,
      });

      await updateDoc(eventRef, {
        ticketQuantity: updatedTicketQuantity,
        ticketsSold: updatedTicketsSold,
        totalTickets: event.totalTickets, // Ensure totalTickets is retained
      });

      // Add the attendee's details to the attendees subcollection
      const attendeesCollection = collection(
        db,
        `users/${user.uid}/events/${eventId}/attendees`
      );
      await addDoc(attendeesCollection, {
        name: ticketForm.name,
        ticketCount,
        specialRequirements: ticketForm.specialRequirements || "",
      });

      // Update local state
      setEvent((prevEvent) => {
        const updatedEvent = {
          ...prevEvent,
          ticketQuantity: updatedTicketQuantity,
          ticketsSold: updatedTicketsSold,
        };
        console.log("Updated event state:", updatedEvent);
        return updatedEvent;
      });

      setAttendees((prevAttendees) => {
        const updatedAttendees = [
          ...prevAttendees,
          {
            name: ticketForm.name,
            ticketCount,
            specialRequirements: ticketForm.specialRequirements || "",
          },
        ];
        console.log("Updated attendees state:", updatedAttendees);
        return updatedAttendees;
      });

      setFormSuccess("Tickets purchased successfully!");
      setTicketForm({
        name: "",
        ticketCount: "",
        specialRequirements: "",
      });
    } catch (err) {
      console.error("Error processing ticket purchase:", err);
      setFormError(
        "An error occurred while purchasing tickets. Please try again."
      );
    }
  };

  const handleRemoveAttendee = async (attendeeId, ticketCount) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user || !user.uid) {
        throw new Error("User is not logged in.");
      }

      // Remove the attendee from Firestore
      const attendeeRef = doc(
        db,
        `users/${user.uid}/events/${eventId}/attendees`,
        attendeeId
      );
      await deleteDoc(attendeeRef);

      // Update the event's ticket quantity in Firestore
      const eventRef = doc(db, `users/${user.uid}/events`, eventId);
      const updatedTicketQuantity = event.ticketQuantity + ticketCount;
      const updatedTicketsSold = event.ticketsSold - ticketCount;

      await updateDoc(eventRef, {
        ticketQuantity: updatedTicketQuantity,
        ticketsSold: updatedTicketsSold,
        totalTickets: event.totalTickets,
      });

      // Update local state
      setEvent((prevEvent) => {
        const updatedEvent = {
          ...prevEvent,
          ticketQuantity: updatedTicketQuantity,
          ticketsSold: updatedTicketsSold,
        };
        console.log("Updated event state after removal:", updatedEvent);
        return updatedEvent;
      });

      // Remove attendee from local state
      setAttendees((prevAttendees) =>
        prevAttendees.filter((attendee) => attendee.id !== attendeeId)
      );
    } catch (err) {
      console.error("Error removing attendee:", err);
      setError("An error occurred while removing the attendee.");
    }
  };

  // Calculate tickets sold, remaining, and progress percentage
  const totalTickets = event?.totalTickets || 0;
  const ticketsRemaining = event?.ticketQuantity || 0;
  const progress =
    totalTickets > 0 ? Math.round(((totalTickets - ticketsRemaining) / totalTickets) * 100) : 0;

  console.log(`Tickets Left: ${ticketsRemaining}, Total Tickets: ${totalTickets}, Progress: ${progress}`);

  // Determine progress bar color
  const progressBarColor =
    progress > 50 ? "green" : progress > 20 ? "orange" : "red";

  return (
    <div className="container mx-auto mt-10 px-4 sm:px-6 md:px-8 bg-gray-900 text-white">
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : loading ? (
        <p className="text-gray-500 text-center">
          Loading event and attendees...
        </p>
      ) : event ? (
        <div>
          <h1 className="text-3xl font-semibold mb-6 text-center">
            Attendees for {event.eventName}
          </h1>
          <div className="text-center mb-6">
            <p>
              Tickets Sold: {totalTickets - ticketsRemaining} of {totalTickets}
            </p>
                <div className="w-full bg-gray-700 rounded-full h-6 mt-4 overflow-hidden">
                  
              <div
                className="h-6 text-sm text-center text-white"
                style={{
                  width: `${progress}%`,
                  backgroundColor: progressBarColor,
                }}
              >
                  {progress}% Sold
              </div>
            </div>
          </div>
          <form
            onSubmit={handleTicketPurchase}
            className="space-y-4 max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Purchase Tickets</h2>
            {formError && <p className="text-red-500">{formError}</p>}
            {formSuccess && <p className="text-green-500">{formSuccess}</p>}
            <div>
              <label className="block text-gray-300">Name</label>
              <input
                type="text"
                name="name"
                value={ticketForm.name}
                onChange={handleInputChange}
                className="w-full p-3 mt-2 bg-gray-700 text-white border border-gray-600 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-300">Number of Tickets</label>
              <input
                type="number"
                name="ticketCount"
                value={ticketForm.ticketCount}
                onChange={handleInputChange}
                className="w-full p-3 mt-2 bg-gray-700 text-white border border-gray-600 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-300">
                Special Requirements
              </label>
              <textarea
                name="specialRequirements"
                value={ticketForm.specialRequirements}
                onChange={handleInputChange}
                className="w-full p-3 mt-2 bg-gray-700 text-white border border-gray-600 rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Purchase Tickets
            </button>
          </form>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Attendees List</h2>
            {attendees.length > 0 ? (
              <ul className="space-y-4">
                {attendees.map((attendee) => (
                  <li
                    key={attendee.id}
                    className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-4"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{attendee.name}</h3>
                      <p className="text-sm text-gray-400">
                        Tickets: {attendee.ticketCount}
                      </p>
                      {attendee.specialRequirements && (
                        <p className="text-sm text-gray-400">
                          Special Requirements:{" "}
                          {attendee.specialRequirements}
                        </p>
                      )}
                    </div>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() =>
                        handleRemoveAttendee(attendee.id, attendee.ticketCount)
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No attendees registered yet.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No event details available.</p>
      )}
    </div>
  );
}

export default AttendeesPage;
