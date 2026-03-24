import { Router } from "express";
import {
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getSearch,
} from "./employee.controller.js";
// import { authMiddleware } from "../../Auth/auth.middleware.js";

const router = Router();
// router.use(authMiddleware);

router.get("/search", getSearch);
router.post("/", createEmployee);
router.get("/", getEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
