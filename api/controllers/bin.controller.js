// controllers/binController.js
import Bin from '../models/bin.model.js';

// Create or Update Bin Request
export const createOrUpdateBin = async (req, res) => {
  const { userId, userName, userEmail, longitude, latitude, address, binLevels, overallPercentage } = req.body;

  try {
    let bin = await Bin.findOne({ userId });

    if (bin) {
      // Update existing bin
      bin.longitude = longitude;
      bin.latitude = latitude;
      bin.address = address;
      bin.binLevels = binLevels;
      bin.overallPercentage = overallPercentage;
    } else {
      // Create a new bin
      bin = new Bin({
        userId,
        userName,
        userEmail,
        longitude,
        latitude,
        address,
        binLevels,
        overallPercentage,
      });
    }

    await bin.save();
    res.status(200).json({ message: 'Bin request saved successfully', bin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
