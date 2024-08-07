import { Router } from "express";
import TicketController from "../controllers/ticket.controller.js";

const router = Router();
const ticketController = new TicketController();

router.post("/", ticketController.createTicket);
router.get("/", ticketController.getTickets);
router.get("/tickets/:id", ticketController.getTicketById);

export default router;
