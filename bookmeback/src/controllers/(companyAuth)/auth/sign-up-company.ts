import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Company } from "../../../models/company.schema";
import nodemailer from "nodemailer";
export const signupCompanyController: RequestHandler = async (req, res) => {
  try {
    const {
      email,
      password,
      companyName,
      address,
      city,
      lat,
      lng,
      companyLogo,
      phoneNumber,
      description,
      companyImages,
      workingHours,
      lunchBreak,
      backGroundImage,
      aboutUsImage,
      experience,
      clientNumber,
    } = req.body;

    if (!email || !password || !companyName || !address || !phoneNumber) {
      res.status(400).json({
        message: "Имэйл, нууц үг, компанийн нэр, хаяг, утас шаардлагатай.",
      });
      return;
    }

    const existing = await Company.findOne({ email });
    if (existing) {
      res.status(409).json({ message: "Имэйл бүртгэлтэй байна" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const company = await Company.create({
      email,
      password: hashedPassword,
      companyName,
      address,
      city,
      lat,
      lng,
      companyLogo: companyLogo || "",
      phoneNumber,
      description: description || "",
      companyImages: companyImages || [],
      workingHours: workingHours || {},
      lunchBreak: lunchBreak || {},
      backGroundImage: backGroundImage || "",
      aboutUsImage: aboutUsImage || "",
      experience: experience || "",
      clientNumber: clientNumber || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const token = jwt.sign(
      { companyId: company._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "mnbookme@gmail.com",
      to: email,
      subject: "Бүртгэл амжилттай боллоо",
      html: `
    <div style="padding: 20px;">
      <h2>Сайн байна уу, ${companyName}!</h2>
      <p>Таны бүртгэл амжилттай бүртгэгдлээ. Манай системийг ашигласанд баярлалаа.</p>
      <p>Та дараах холбоосоор нэвтэрч орно уу:</p>
      <a href="https://bookme.mn/login" style="color:blue;">Нэвтрэх</a>
    </div>
  `,
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json({
      message: "Компани амжилттай бүртгэгдлээ",
      token,
      company,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Серверийн алдаа",
      error: error instanceof Error ? error.message : "Тодорхойгүй алдаа",
    });
  }
};
