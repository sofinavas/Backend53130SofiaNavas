import { TicketModel } from "../models/ticket.model.js";

class TicketController {
  async createTicket(req, res) {
    try {
      const { amount, purchaser } = req.body;
      const newTicket = new TicketModel({
        amount,
        purchaser,
      });

      await newTicket.save();
      res.status(201).json(newTicket);
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      res.status(500).json({ error: "Error al crear el ticket" });
    }
  }

  async getTickets(req, res) {
    try {
      const tickets = await TicketModel.find();
      res.status(200).json(tickets);
    } catch (error) {
      console.error("Error al obtener los tickets:", error);
      res.status(500).json({ error: "Error al obtener los tickets" });
    }
  }

  async getTicketById(req, res) {
    try {
      const ticket = await TicketModel.findById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket no encontrado" });
      }
      res.status(200).json(ticket);
    } catch (error) {
      console.error("Error al obtener el ticket:", error);
      res.status(500).json({ error: "Error al obtener el ticket" });
    }
  }
}

export default TicketController;
