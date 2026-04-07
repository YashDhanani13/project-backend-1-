import { Router } from "express";
import {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
  // getSearch,
} from "./contacts.controller.js";

import { authMiddleware } from "../../auth/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

// router.get("/search", getSearch);

router.post("/", createContact);
router.get("/", getContacts);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
