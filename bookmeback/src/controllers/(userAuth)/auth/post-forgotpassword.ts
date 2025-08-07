import { RequestHandler } from "express";
import { User } from "../../../models";
import nodemailer from "nodemailer";
import crypto from "crypto";
export const Forgotpass: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      res.status(404).json({ message: "Бүртгэлгүй Email хаяг байна." });
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = Date.now() + 5 * 60 * 1000;
    oldUser.resetCode = code;
    oldUser.resetCodeExpires = new Date(expires);
    await oldUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Нууц үг сэргээх код",
      html: `
        <h2>Сайн байна уу, ${oldUser.username}!</h2>
        <p>Таны сэргээх код: <strong style="font-size: 24px;">${code}</strong></p>
        <p>Энэ код 5 минутын хугацаанд хүчинтэй.</p>
      `,
    });
    res.status(200).json({ message: "Код амжилттай илгээгдлээ." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Серверийн алдаа." });
  }
};
