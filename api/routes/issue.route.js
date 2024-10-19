import express  from "express";
import { createIssue, deleteIssue, getAllIssues, getIssue, getIssuesByCollector, getResolvedIssuesByUser, updateIssue } from "../controllers/issue.controller.js";


const router = express.Router();

router.post('/create-issue', createIssue)
router.get('/get-all-issues', getAllIssues);
router.get('/get-a-issue/:id', getIssue);
router.get('/get-a-issue-collector/:id', getIssuesByCollector);
router.get('/resolved-issues-collector/:id', getResolvedIssuesByUser);
router.put('/update-issue/:id',updateIssue);
router.delete('/delete-issue/:id',deleteIssue);

export default router;