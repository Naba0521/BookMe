import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { User } from "../../../models";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";

export const postUserAuthSignUp: RequestHandler = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Имэйл хаяг бүртгэлтэй байна." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 2);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      username,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Амжилттай бүртгэгдлээ!",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Сайн байна уу, ${email}!</h2>
          <p>Та <strong>Bookme.mn</strong> платформд амжилттай бүртгүүллээ.</p>
          <p>Манай үйлчилгээг ашигласанд баярлалаа!</p>
          <img src="https://res.cloudinary.com/dqd01lbfy/image/upload/v1751271874/gb1v6olhagsfsogubl8r.jpg" alt="sheep" width="300">
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Бүртгэл амжилттай, нэвтэрсэн!",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Бүртгэл амжилтгүй боллоо" });
  }
};
