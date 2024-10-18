// controllers/binController.js
import Bin from '../models/bin.model.js';

// Create or Update Bin Request
export const createOrUpdateBin = async (req, res) => {
    const { userId, userName, userEmail, longitude, latitude, address, binLevels, overallPercentage } = req.body;
  
    try {
      let bin = await Bin.findOne({ userId });
  
      if (bin) {
     
        bin.longitude = longitude;
        bin.latitude = latitude;
        bin.address = address;
        bin.binLevels = binLevels;
        bin.overallPercentage = overallPercentage;
        bin.isRequested = true;
      } else {
        
        bin = new Bin({
          userId,
          userName,
          userEmail,
          longitude,
          latitude,
          address,
          binLevels,
          overallPercentage,
          isRequested: true, 
        });
      }
  
      await bin.save();
      res.status(200).json({ message: 'Bin request saved successfully', bin });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

export const getAllBins = async (req, res) => {
    try {
      const bins = await Bin.find(); 
      res.status(200).json({ bins });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  export const updateBinRequest = async (req, res) => {
    try {
      const { id } = req.params;
      const { isRequested } = req.body;
  
      let updateFields = { isRequested };
  
      // Reset bin levels and overallPercentage to 0 if request is completed
      if (!isRequested) {
        updateFields = {
          ...updateFields,
          binLevels: {
            foodBin: 0,
            plasticBin: 0,
            paperBin: 0,
          },
          overallPercentage: 0,
        };
      }
  
      const updatedBin = await Bin.findByIdAndUpdate(id, updateFields, { new: true });
  
      if (!updatedBin) {
        return res.status(404).json({ message: 'Bin not found' });
      }
  
      res.json({ message: 'Bin request updated successfully', bin: updatedBin });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

export const resetBins = async (req, res) => {

    const { id } = req.params;
  try {
   
    await Bin.updateOne({ _id: id }, { foodBin: 0, plasticBin: 0, paperBin: 0 });
    res.status(200).json({ message: 'Bin levels reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting bin levels.', error });
  }
};

  
  