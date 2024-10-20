// test/binController.test.js
import request from 'supertest';
import app from '../app'; // Express app
import Bin from '../../../api/models/bin.model.js';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import app from '../firebase.js'; 

// Mocking the Bin model and QRCode library
jest.mock('../models/bin.model.js');
jest.mock('qrcode');

describe('Bin Controller', () => {
  afterAll(async () => {
    await mongoose.connection.close(); // Closing DB connection after tests
  });

  // Test case for createOrUpdateBin
  describe('POST /bin', () => {
    it('should create a new bin request', async () => {
      QRCode.toDataURL.mockResolvedValue('mockQRCode');
      
      Bin.findOne.mockResolvedValue(null); // Simulate no existing bin
      Bin.prototype.save = jest.fn().mockResolvedValue({});

      const res = await request(app)
        .post('/bin')
        .send({
          userId: '123',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          longitude: 79.8612,
          latitude: 6.9271,
          address: 'Colombo, Sri Lanka',
          binLevels: { foodBin: 50, plasticBin: 30, paperBin: 20 },
          overallPercentage: 50,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Bin request saved successfully');
      expect(Bin.prototype.save).toHaveBeenCalled();
      expect(QRCode.toDataURL).toHaveBeenCalledWith('123-John Doe');
    });

    it('should update an existing bin request', async () => {
      const existingBin = { save: jest.fn() }; 
      Bin.findOne.mockResolvedValue(existingBin);

      const res = await request(app)
        .post('/bin')
        .send({
          userId: '123',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          longitude: 79.8612,
          latitude: 6.9271,
          address: 'Colombo, Sri Lanka',
          binLevels: { foodBin: 70, plasticBin: 40, paperBin: 30 },
          overallPercentage: 60,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Bin request saved successfully');
      expect(existingBin.save).toHaveBeenCalled();
    });
  });

  // Test case for getAllBins
  describe('GET /bins', () => {
    it('should return all bins', async () => {
      const mockBins = [{ userId: '123', address: 'Colombo' }, { userId: '456', address: 'Kandy' }];
      Bin.find.mockResolvedValue(mockBins);

      const res = await request(app).get('/bins');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.bins).toHaveLength(2);
    });

    it('should handle errors in fetching bins', async () => {
      Bin.find.mockRejectedValue(new Error('Server error'));

      const res = await request(app).get('/bins');

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Server error');
    });
  });

  // Test case for updateBinRequest
  describe('PUT /bin/:id/request', () => {
    it('should update a bin request', async () => {
      const mockBin = { _id: 'binId', isRequested: true, save: jest.fn() };
      Bin.findByIdAndUpdate.mockResolvedValue(mockBin);

      const res = await request(app).put('/bin/binId/request').send({ isRequested: false });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Bin request updated successfully');
    });

    it('should return 404 if bin not found', async () => {
      Bin.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app).put('/bin/binId/request').send({ isRequested: false });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Bin not found');
    });
  });

  // Test case for resetBins
  describe('PUT /bin/:id/reset', () => {
    it('should reset the bin levels', async () => {
      Bin.updateOne.mockResolvedValue({ nModified: 1 });

      const res = await request(app).put('/bin/binId/reset');

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Bin levels reset successfully.');
    });

    it('should handle errors when resetting bins', async () => {
      Bin.updateOne.mockRejectedValue(new Error('Error resetting bin'));

      const res = await request(app).put('/bin/binId/reset');

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Error resetting bin levels.');
    });
  });

  // Test case for getUserRequests
  describe('GET /user/:userId/requests', () => {
    it('should return user requests', async () => {
      const mockUserRequests = [{ userId: '123', binLevels: { foodBin: 50 } }];
      Bin.find.mockResolvedValue(mockUserRequests);

      const res = await request(app).get('/user/123/requests');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    it('should return 404 if no requests found', async () => {
      Bin.find.mockResolvedValue(null);

      const res = await request(app).get('/user/123/requests');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('No requests found for this user');
    });
  });
});
