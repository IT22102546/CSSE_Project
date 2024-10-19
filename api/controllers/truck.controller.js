import CollectionTruck from "../models/truck.model.js";
import { errorHandler } from "../utils/error.js";
import logger from "../utils/logger.js";

// Create a new truck
export const createTruck = async (req, res, next) => {
  const { truckId, driver, capacity, location, route, status } = req.body;

  // Validate inputs
  if (!truckId || !driver || !capacity ) {
    logger.warn("Validation failed: Missing required fields");
    return next(errorHandler(400, "All fields are required"));
  }

  if (typeof capacity !== 'number' || capacity <= 0) {
    logger.warn("Validation failed: Invalid capacity value");
    return next(errorHandler(400, "Capacity must be a positive number"));
  }

  try {
    const newTruck = new CollectionTruck({
      truckId,
      driver,
      capacity,
      location,
      route,
      status
    });

    await newTruck.save();
    logger.info(`Truck with ID ${truckId} created successfully`);
    res.status(201).json(newTruck);
  } catch (error) {
    logger.error(`Error creating truck: ${error.message}`);
    next(error);
  }
};

// Update a truck
export const updateTruck = async (req, res, next) => {
  const { id } = req.params;
  const { truckId, driver, capacity, location, route, status } = req.body;

  // Validate inputs if provided
  if (capacity !== undefined && (typeof capacity !== 'number' || capacity <= 0)) {
    logger.warn("Validation failed: Invalid capacity value");
    return next(errorHandler(400, "Capacity must be a positive number"));
  }

  try {
    const updatedTruck = await CollectionTruck.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(truckId && { truckId }),
          ...(driver && { driver }),
          ...(capacity && { capacity }),
          ...(location && { location }),
          ...(route && { route }),
          ...(status && { status})
        },
      },
      { new: true }
    );

    if (!updatedTruck) {
      logger.warn(`Truck with ID ${id} not found`);
      return next(errorHandler(404, "Truck not found"));
    }

    logger.info(`Truck with ID ${id} updated successfully`);
    res.status(200).json(updatedTruck);
  } catch (error) {
    logger.error(`Error updating truck: ${error.message}`);
    next(error);
  }
};

// Delete a truck
export const deleteTruck = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedTruck = await CollectionTruck.findByIdAndDelete(id);

    if (!deletedTruck) {
      logger.warn(`Truck with ID ${id} not found`);
      return next(errorHandler(404, "Truck not found"));
    }

    logger.info(`Truck with ID ${id} deleted successfully`);
    res.status(200).json({ message: "Truck has been deleted" });
  } catch (error) {
    logger.error(`Error deleting truck: ${error.message}`);
    next(error);
  }
};

export const getTruck = async (req, res, next) => {
    const { id } = req.params;
  
    try {
      const truck = await CollectionTruck.findById(id);
  
      if (!truck) {
        logger.warn(`Truck with ID ${id} not found`);
        return next(errorHandler(404, "Truck not found"));
      }
  
      logger.info(`Truck with ID ${id} retrieved successfully`);
      res.status(200).json(truck);
    } catch (error) {
      logger.error(`Error retrieving truck: ${error.message}`);
      next(error);
    }
  };
  
  // Get all trucks
  export const getAllTrucks = async (req, res, next) => {
    try {
      const trucks = await CollectionTruck.find();
  
      if (!trucks.length) {
        logger.warn("No trucks found");
        return next(errorHandler(404, "No trucks found"));
      }
  
      logger.info("All trucks retrieved successfully");
      res.status(200).json(trucks);
    } catch (error) {
      logger.error(`Error retrieving all trucks: ${error.message}`);
      next(error);
    }
  };