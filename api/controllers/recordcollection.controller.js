import CollectionReport from "../models/recordcollection.model.js";
import { errorHandler } from "../utils/error.js";
import logger from "../utils/logger.js";

// Create a new collection report
export const createCollectionReport = async (req, res, next) => {
  const {  binId, foodBin, plasticBin, paperBin, userName, userEmail } = req.body;

  // Validate inputs
  if (!binId || !foodBin || !plasticBin || !paperBin || !userName || !userEmail) {
    logger.warn("Validation failed: Missing required fields");
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const newReport = new CollectionReport({
      binId,
      foodBin,
      plasticBin,
      paperBin,
      userName,
      userEmail,

    });

    await newReport.save();
    logger.info(`Collection report for Bin ID ${binId} created successfully`);
    res.status(201).json(newReport);
  } catch (error) {
    logger.error(`Error creating collection report: ${error.message}`);
    next(error);
  }
};

// Get all collection reports
export const getAllCollectionReports = async (req, res, next) => {
  try {
    const reports = await CollectionReport.find();

    if (!reports.length) {
      logger.warn("No collection reports found");
      return next(errorHandler(404, "No collection reports found"));
    }

    logger.info("All collection reports retrieved successfully");
    res.status(200).json(reports);
  } catch (error) {
    logger.error(`Error retrieving collection reports: ${error.message}`);
    next(error);
  }
};

// Get a single collection report by ID
export const getCollectionReportById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const report = await CollectionReport.findById(id);

    if (!report) {
      logger.warn(`Collection report with ID ${id} not found`);
      return next(errorHandler(404, "Collection report not found"));
    }

    logger.info(`Collection report with ID ${id} retrieved successfully`);
    res.status(200).json(report);
  } catch (error) {
    logger.error(`Error retrieving collection report: ${error.message}`);
    next(error);
  }
};

// Update a collection report
export const updateCollectionReport = async (req, res, next) => {
  const { id } = req.params;
  const { foodBin, plasticBin, paperBin, status, remarks } = req.body;

  try {
    const updatedReport = await CollectionReport.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(foodBin && { foodBin }),
          ...(plasticBin && { plasticBin }),
          ...(paperBin && { paperBin }),
          ...(status && { status }),
          ...(remarks && { remarks }),
        },
      },
      { new: true }
    );

    if (!updatedReport) {
      logger.warn(`Collection report with ID ${id} not found`);
      return next(errorHandler(404, "Collection report not found"));
    }

    logger.info(`Collection report with ID ${id} updated successfully`);
    res.status(200).json(updatedReport);
  } catch (error) {
    logger.error(`Error updating collection report: ${error.message}`);
    next(error);
  }
};

// Delete a collection report
export const deleteCollectionReport = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedReport = await CollectionReport.findByIdAndDelete(id);

    if (!deletedReport) {
      logger.warn(`Collection report with ID ${id} not found`);
      return next(errorHandler(404, "Collection report not found"));
    }

    logger.info(`Collection report with ID ${id} deleted successfully`);
    res.status(200).json({ message: "Collection report has been deleted" });
  } catch (error) {
    logger.error(`Error deleting collection report: ${error.message}`);
    next(error);
  }
};

// Get collection reports by collector ID
export const getCollectionReportsByCollector = async (req, res, next) => {
  const { id } = req.params; // This should be the collector ID

  try {
    const reports = await CollectionReport.find({ collectorId: id });

    if (!reports.length) {
      logger.warn(`No collection reports found for Collector ID ${id}`);
      return next(errorHandler(404, "No collection reports found for this collector"));
    }

    logger.info(`Collection reports for Collector ID ${id} retrieved successfully`);
    res.status(200).json(reports);
  } catch (error) {
    logger.error(`Error retrieving collection reports for Collector ID ${id}: ${error.message}`);
    next(error);
  }
};

// Get collection reports by user ID
export const getCollectionReportsByUser = async (req, res, next) => {
  const { id } = req.params; // This should be the user ID

  try {
    const reports = await CollectionReport.find({ userId: id });

    if (!reports.length) {
      logger.warn(`No collection reports found for User ID ${id}`);
      return next(errorHandler(404, "No collection reports found for this user"));
    }

    logger.info(`Collection reports for User ID ${id} retrieved successfully`);
    res.status(200).json(reports);
  } catch (error) {
    logger.error(`Error retrieving collection reports for User ID ${id}: ${error.message}`);
    next(error);
  }
};
