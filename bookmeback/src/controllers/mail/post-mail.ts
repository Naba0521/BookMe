import { RequestHandler } from "express";
import nodemailer from "nodemailer";

export const postMail: RequestHandler = async (req, res) => {
  const { to, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mnbookme@gmail.com",
      pass: "gssz sdqi lteq hpaw",
    },
  });

  const mailOptions = {
    from: "mnbookme@gmail.com",
    to,
    subject,
    html: `
      <div style="padding: 20px;">
        <h2>Сайн байна уу!</h2>
        <p>${text}</p>
        <a href="https://bookme.mn/login">Нэвтрэх</a>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Email failed to send" });
  }
};
