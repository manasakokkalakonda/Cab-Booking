const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Ride = require('../models/Ride');

// Mock Express app for testing API routes
const app = express();
app.use(express.json());

// Import or define routes for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Backend server is active and healthy' });
});

app.post('/api/rides', async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, rideType, fare } = req.body;
    if (!pickupLocation || !dropoffLocation) {
      return res.status(400).json({ success: false, error: 'Locations required' });
    }
    const newRide = new Ride({
      riderId: new mongoose.Types.ObjectId(),
      pickupLocation,
      dropoffLocation,
      rideType: rideType || 'Economy',
      fare: fare || 299,
    });
    res.status(201).json({ success: true, ride: newRide });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

describe('Cab Booking API Unit Tests', () => {
  test('GET /api/health should return active status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Backend server is active and healthy');
  });

  test('POST /api/rides should create a ride request successfully', async () => {
    const response = await request(app)
      .post('/api/rides')
      .send({
        pickupLocation: 'Downtown Station',
        dropoffLocation: 'Tech Park',
        rideType: 'Economy',
        fare: 299,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.ride.pickupLocation).toBe('Downtown Station');
  });

  test('POST /api/rides should fail if locations are missing', async () => {
    const response = await request(app)
      .post('/api/rides')
      .send({
        pickupLocation: '',
        dropoffLocation: '',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });
});