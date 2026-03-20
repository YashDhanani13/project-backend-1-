import { Router } from "express";


import {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
} from "./contacts.controller.js";

const router = Router();
router.post("/", createContact);
router.get("/", getContacts);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
