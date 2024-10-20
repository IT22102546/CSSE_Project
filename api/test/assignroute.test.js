import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';  // Assuming you have an Express app instance in this file
import AssignRoute from '../api/models/assignedRoute.model';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Mock logger
jest.mock('../utils/logger.js', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('AssignedRoute Controller', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await AssignRoute.deleteMany(); // Clear the collection after each test
  });

  describe('POST /api/assigned-routes', () => {
    it('should create a new assigned route', async () => {
      const routeData = {
        binId: '123',
        userId: 'user1',
        userName: 'John Doe',
        longitude: 79.8612,
        latitude: 6.9271,
        address: 'Some address',
        truckId: 'truck1',
        status: 'pending',
      };

      const response = await request(app).post('/api/assigned-routes').send(routeData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.userName).toBe(routeData.userName);
    });

    it('should return 400 if required fields are missing', async () => {
      const routeData = {
        userId: 'user1',
        userName: 'John Doe',
        longitude: 79.8612,
        latitude: 6.9271,
      };

      const response = await request(app).post('/api/assigned-routes').send(routeData);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });
  });

  describe('PUT /api/assigned-routes/:id', () => {
    it('should update an existing assigned route', async () => {
      const route = new AssignRoute({
        binId: '123',
        userId: 'user1',
        userName: 'John Doe',
        longitude: 79.8612,
        latitude: 6.9271,
        address: 'Old address',
        truckId: 'truck1',
        status: 'pending',
      });
      await route.save();

      const updateData = { address: 'New address', status: 'completed' };
      const response = await request(app).put(`/api/assigned-routes/${route._id}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.address).toBe('New address');
      expect(response.body.status).toBe('completed');
    });

    it('should return 404 if the assigned route is not found', async () => {
      const response = await request(app).put('/api/assigned-routes/invalid-id').send({
        address: 'New address',
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Assigned route not found');
    });
  });

  describe('DELETE /api/assigned-routes/:id', () => {
    it('should delete an existing assigned route', async () => {
      const route = new AssignRoute({
        binId: '123',
        userId: 'user1',
        userName: 'John Doe',
        longitude: 79.8612,
        latitude: 6.9271,
        address: 'Some address',
        truckId: 'truck1',
        status: 'pending',
      });
      await route.save();

      const response = await request(app).delete(`/api/assigned-routes/${route._id}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Assigned route has been deleted');
    });

    it('should return 404 if the assigned route is not found', async () => {
      const response = await request(app).delete('/api/assigned-routes/invalid-id');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Assigned route not found');
    });
  });

  describe('GET /api/assigned-routes/:id', () => {
    it('should retrieve an assigned route by ID', async () => {
      const route = new AssignRoute({
        binId: '123',
        userId: 'user1',
        userName: 'John Doe',
        longitude: 79.8612,
        latitude: 6.9271,
        address: 'Some address',
        truckId: 'truck1',
        status: 'pending',
      });
      await route.save();

      const response = await request(app).get(`/api/assigned-routes/${route._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.userName).toBe(route.userName);
    });

    it('should return 404 if the assigned route is not found', async () => {
      const response = await request(app).get('/api/assigned-routes/invalid-id');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Assigned route not found');
    });
  });

  describe('GET /api/assigned-routes/truck/:truckId', () => {
    it('should retrieve assigned routes by truck ID', async () => {
      const route1 = new AssignRoute({
        binId: '123',
        userId: 'user1',
        userName: 'John Doe',
        longitude: 79.8612,
        latitude: 6.9271,
        address: 'Some address',
        truckId: 'truck1',
        status: 'pending',
      });
      const route2 = new AssignRoute({
        binId: '456',
        userId: 'user2',
        userName: 'Jane Doe',
        longitude: 79.8600,
        latitude: 6.9300,
        address: 'Another address',
        truckId: 'truck1',
        status: 'completed',
      });

      await route1.save();
      await route2.save();

      const response = await request(app).get('/api/assigned-routes/truck/truck1');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it('should return 404 if no routes are found for the truck ID', async () => {
      const response = await request(app).get('/api/assigned-routes/truck/nonexistentTruck');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No assigned routes found for this truck');
    });
  });
});
