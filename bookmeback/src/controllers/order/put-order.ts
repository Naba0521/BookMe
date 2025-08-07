import { RequestHandler } from "express";
import { Booking } from "../../models/booking.schema";

export const CreateOrderController: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            res.status(404).json({ message: "захиалгын ID олдсонгүй" });
            return;
        }
        const {
            company,
            user,
            status,
            employee,
            selectedTime
        } = req.body;

        const updatedData = {
            company,
            user,
            status,
            employee,
            selectedTime,
            updatedAt: new Date(),
        }
        if (!company || !user || !selectedTime || !employee) {
            res.status(404).json({ message: "Бүх талбарыг бөглө" })
            return;
        }
        const updatedOrder = await Booking.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        );
        res.status(200).json({ message: "order updated", updatedData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error updating order" });
        return
    }
}