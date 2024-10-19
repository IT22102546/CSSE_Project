import AssignRoute from "../models/assignRoute.model.js";
import { errorHandler } from "../utils/error.js";
import logger from "../utils/logger.js";

// Create a new assigned route
export const createAssignedRoute = async (req, res, next) => {
  const { userId, userName, longitude, latitude, address, driverId, truckId, status } = req.body;

  // Validate inputs
  if (!userId || !userName || !longitude || !latitude || !address || !driverId || !truckId) {
    logger.warn("Validation failed: Missing required fields");
    return next(errorHandler(400, "All fields are required"));
  }

  if (typeof longitude !== 'number' || typeof latitude !== 'number') {
    logger.warn("Validation failed: Invalid longitude or latitude value");
    return next(errorHandler(400, "Longitude and latitude must be numbers"));
  }

  try {
    const newAssignedRoute = new AssignRoute({
      userId,
      userName,
      longitude,
      latitude,
      address,
      driverId,
      truckId,
      status
    });

    await newAssignedRoute.save();
    logger.info(`Assigned route for user ${userId} created successfully`);
    res.status(201).json(newAssignedRoute);
  } catch (error) {
    logger.error(`Error creating assigned route: ${error.message}`);
    next(error);
  }
};

// Update an assigned route
export const updateAssignedRoute = async (req, res, next) => {
  const { id } = req.params;
  const { userId, userName, longitude, latitude, address, driverId, truckId, status } = req.body;

  // Validate inputs if provided
  if ((longitude !== undefined && typeof longitude !== 'number') ||
      (latitude !== undefined && typeof latitude !== 'number')) {
    logger.warn("Validation failed: Invalid longitude or latitude value");
    return next(errorHandler(400, "Longitude and latitude must be numbers"));
  }

  try {
    const updatedRoute = await AssignRoute.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(userId && { userId }),
          ...(userName && { userName }),
          ...(longitude && { longitude }),
          ...(latitude && { latitude }),
          ...(address && { address }),
          ...(driverId && { driverId }),
          ...(truckId && { truckId }),
          ...(status && { status })
        },
      },
      { new: true }
    );

    if (!updatedRoute) {
      logger.warn(`Assigned route with ID ${id} not found`);
      return next(errorHandler(404, "Assigned route not found"));
    }

    logger.info(`Assigned route with ID ${id} updated successfully`);
    res.status(200).json(updatedRoute);
  } catch (error) {
    logger.error(`Error updating assigned route: ${error.message}`);
    next(error);
  }
};

// Delete an assigned route
export const deleteAssignedRoute = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedRoute = await AssignRoute.findByIdAndDelete(id);

    if (!deletedRoute) {
      logger.warn(`Assigned route with ID ${id} not found`);
      return next(errorHandler(404, "Assigned route not found"));
    }

    logger.info(`Assigned route with ID ${id} deleted successfully`);
    res.status(200).json({ message: "Assigned route has been deleted" });
  } catch (error) {
    logger.error(`Error deleting assigned route: ${error.message}`);
    next(error);
  }
};

// Get a single assigned route by ID
export const getAssignedRoute = async (req, res, next) => {
  const { id } = req.params;

  try {
    const assignedRoute = await AssignRoute.findById(id);

    if (!assignedRoute) {
      logger.warn(`Assigned route with ID ${id} not found`);
      return next(errorHandler(404, "Assigned route not found"));
    }

    logger.info(`Assigned route with ID ${id} retrieved successfully`);
    res.status(200).json(assignedRoute);
  } catch (error) {
    logger.error(`Error retrieving assigned route: ${error.message}`);
    next(error);
  }
};

// Get all assigned routes
export const getAllAssignedRoutes = async (req, res, next) => {
  try {
    const assignedRoutes = await AssignRoute.find();

    if (!assignedRoutes.length) {
      logger.warn("No assigned routes found");
      return next(errorHandler(404, "No assigned routes found"));
    }

    logger.info("All assigned routes retrieved successfully");
    res.status(200).json(assignedRoutes);
  } catch (error) {
    logger.error(`Error retrieving all assigned routes: ${error.message}`);
    next(error);
  }
};

// Get assigned routes by truck ID
export const getAssignedRoutesByTruckId = async (req, res, next) => {
  const { truckId } = req.params;

  try {
    const routes = await AssignRoute.find({ truckId });

    if (!routes.length) {
      logger.warn(`No assigned routes found for truck ID ${truckId}`);
      return next(errorHandler(404, "No assigned routes found for this truck"));
    }

    logger.info(`Assigned routes for truck ID ${truckId} retrieved successfully`);
    res.status(200).json(routes);
  } catch (error) {
    logger.error(`Error retrieving routes for truck ID ${truckId}: ${error.message}`);
    next(error);
  }
};
