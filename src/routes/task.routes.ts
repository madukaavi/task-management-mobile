import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;