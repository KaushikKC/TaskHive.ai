const axios = require("axios");

const fetchFlights = async (origin, destination, date, maxPrice) => {
  try {
    const response = await axios.get(
      `https://api.skyscanner.net/flights?origin=${origin}&destination=${destination}&date=${date}`
    );
    const flights = response.data.filter((flight) => flight.price <= maxPrice);
    return flights.map((flight) => ({
      id: flight.id,
      origin: flight.origin,
      destination: flight.destination,
      date: flight.date,
      price: flight.price,
      airline: flight.airline,
    }));
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error("Failed to fetch flights");
  }
};

const bookFlight = async (userId, flightId, paymentDetails) => {
  try {
    // Validate booking with AI
    const aiValidation = await axios.post(
      `${process.env.AI_AGENT_URL}/validate-flight-booking`,
      { userId, flightId }
    );

    if (!aiValidation.data.isValid) {
      throw new Error(aiValidation.data.reason);
    }

    // Process payment using Solana
    const paymentResult = await processFlightPayment(paymentDetails);

    // Log booking for AI learning
    await axios.post(`${process.env.AI_AGENT_URL}/log-transaction`, {
      type: "FLIGHT_BOOKING",
      userId,
      flightId,
      transaction: paymentResult,
    });

    return {
      status: "success",
      bookingId: `booking-${Date.now()}`,
      paymentId: paymentResult.id,
    };
  } catch (error) {
    console.error("Error booking flight:", error);
    throw new Error("Failed to book flight");
  }
};
module.exports = { fetchFlights, bookFlight };
