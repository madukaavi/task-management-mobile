
import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";

import {
  getMyProfile,
  updateMyProfile,
  changePassword,
} from "../controllers/user.controller";

const router = Router();

router.use(authMiddleware);

router.get("/me", getMyProfile);
router.patch("/me", updateMyProfile);
router.patch("/change-password", changePassword);

export default router;
