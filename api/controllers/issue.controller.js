import Issue from "../models/issues.model.js";
import { errorHandler } from "../utils/error.js";
import logger from "../utils/logger.js";

// Create a new issue
export const createIssue = async (req, res, next) => {
  const { userId,collectorId, binId, issueType, description, status } = req.body;

  // Validate inputs
  if (!collectorId || !binId || !issueType || !description) {
    logger.warn("Validation failed: Missing required fields");
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const newIssue = new Issue({
        userId,
      collectorId,
      binId,
      issueType,
      description,
      status,
    });

    await newIssue.save();
    logger.info(`Issue for Bin ID ${binId} created successfully`);
    res.status(201).json(newIssue);
  } catch (error) {
    logger.error(`Error creating issue: ${error.message}`);
    next(error);
  }
};

// Update an issue
export const updateIssue = async (req, res, next) => {
  const { id } = req.params;
  const { collectorId, binId, issueType, description, status, solution } = req.body;

  try {
    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(collectorId && { collectorId }),
          ...(binId && { binId }),
          ...(issueType && { issueType }),
          ...(description && { description }),
          ...(status && { status }),
          ...(solution && {solution})
        },
      },
      { new: true }
    );

    if (!updatedIssue) {
      logger.warn(`Issue with ID ${id} not found`);
      return next(errorHandler(404, "Issue not found"));
    }

    logger.info(`Issue with ID ${id} updated successfully`);
    res.status(200).json(updatedIssue);
  } catch (error) {
    logger.error(`Error updating issue: ${error.message}`);
    next(error);
  }
};

// Delete an issue
export const deleteIssue = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedIssue = await Issue.findByIdAndDelete(id);

    if (!deletedIssue) {
      logger.warn(`Issue with ID ${id} not found`);
      return next(errorHandler(404, "Issue not found"));
    }

    logger.info(`Issue with ID ${id} deleted successfully`);
    res.status(200).json({ message: "Issue has been deleted" });
  } catch (error) {
    logger.error(`Error deleting issue: ${error.message}`);
    next(error);
  }
};

// Get one issue by ID
export const getIssue = async (req, res, next) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      logger.warn(`Issue with ID ${id} not found`);
      return next(errorHandler(404, "Issue not found"));
    }

    logger.info(`Issue with ID ${id} retrieved successfully`);
    res.status(200).json(issue);
  } catch (error) {
    logger.error(`Error retrieving issue: ${error.message}`);
    next(error);
  }
};

// Get all issues
export const getAllIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find();

    if (!issues.length) {
      logger.warn("No issues found");
      return next(errorHandler(404, "No issues found"));
    }

    logger.info("All issues retrieved successfully");
    res.status(200).json(issues);
  } catch (error) {
    logger.error(`Error retrieving all issues: ${error.message}`);
    next(error);
  }
};

// Get issues by collector ID (current user)
export const getIssuesByCollector = async (req, res, next) => {
    const { id } = req.params; // This should be the collector ID
    console.log(id);
    
    try {
      // Use collectorId as the field in the query
      const issues = await Issue.find({ userId: id });
  
      if (!issues.length) {
        logger.warn(`No issues found for Collector ID ${id}`);
        return next(errorHandler(404, "No issues found for this collector"));
      }
  
      logger.info(`Issues for Collector ID ${id} retrieved successfully`);
      res.status(200).json(issues);
    } catch (error) {
      logger.error(`Error retrieving issues for Collector ID ${id}: ${error.message}`);
      next(error);
    }
  };
  
  // Get resolved issues by user ID
export const getResolvedIssuesByUser = async (req, res, next) => {
    const { id } = req.params; // This should be the user ID
    console.log(id);
    
    try {
      // Query to find issues where userId matches and status is "Resolved"
      const issues = await Issue.find({ userId: id, status: "Resolved" });
  
      if (!issues.length) {
        logger.warn(`No resolved issues found for User ID ${id}`);
        return next(errorHandler(404, "No resolved issues found for this user"));
      }
  
      logger.info(`Resolved issues for User ID ${id} retrieved successfully`);
      res.status(200).json(issues);
    } catch (error) {
      logger.error(`Error retrieving resolved issues for User ID ${id}: ${error.message}`);
      next(error);
    }
  };
  