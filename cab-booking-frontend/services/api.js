const API_URL = 'http://localhost:5000/api';

export const createRideBooking = async (rideData) => {
  try {
    const response = await fetch(`${API_URL}/rides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rideData),
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
  }
};