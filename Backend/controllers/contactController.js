import contactModel from "../models/contactModel.js";

export const contactUs = async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
    }

    try {
        const newContact = new contactModel({ name, email, phone, subject, message });
        await newContact.save();
        res.status(201).json({ message: "Send successfully", contact: newContact });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const getContact = async (req, res) => {
    try {
        const contacts = await contactModel.find();
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: "Error fetching contacts" });
    }
}