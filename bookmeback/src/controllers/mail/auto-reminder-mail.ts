import cron from "node-cron";
import nodemailer from "nodemailer";
import { RequestHandler } from "express";
import { Booking } from "../../models/booking.schema";
import { Employee } from "../../models";
import { Company } from "../../models/company.schema";
import { User } from "../../models";
import { Document, Types } from "mongoose";
import moment from "moment-timezone";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mnbookme@gmail.com",
    pass: "gssz sdqi lteq hpaw",
  },
});

interface BookingDocument extends Document {
  _id: Types.ObjectId;
  selectedTime: string;
  status: "cancelled" | "confirmed";
  user?: Types.ObjectId;
  employee: Types.ObjectId;
  company: Types.ObjectId;
  reminderSent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserDoc {
  _id: Types.ObjectId;
  username: string;
  email: string;
  phoneNumber: string;
}

interface EmployeeDoc {
  _id: Types.ObjectId;
  name: string;
}

interface CompanyDoc {
  _id: Types.ObjectId;
  companyName: string;
}

interface PopulatedBookingDoc
  extends Omit<BookingDocument, "user" | "employee" | "company"> {
  user: UserDoc;
  employee: EmployeeDoc;
  company: CompanyDoc;
}

interface PopulatedUser {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
}

interface PopulatedEmployee {
  _id: string;
  name: string;
}

interface PopulatedCompany {
  _id: string;
  companyName: string;
}

interface PopulatedBooking {
  _id: string;
  selectedTime: string;
  status: "cancelled" | "confirmed";
  user: PopulatedUser | null;
  employee: PopulatedEmployee | null;
  company: PopulatedCompany | null;

  createdAt?: Date;
  updatedAt?: Date;
  reminderSent?: boolean;
}

const isPopulatedBooking = (booking: any): booking is PopulatedBookingDoc => {
  return (
    booking &&
    booking.user &&
    typeof booking.user === "object" &&
    typeof booking.user.email === "string" &&
    typeof booking.user.username === "string" &&
    booking.employee &&
    typeof booking.employee === "object" &&
    typeof booking.employee.name === "string" &&
    booking.company &&
    typeof booking.company === "object" &&
    typeof booking.company.companyName === "string"
  );
};

export const sendReminderEmail = async (booking: PopulatedBookingDoc) => {
  try {
    const mailOptions = {
      from: "mnbookme@gmail.com",
      to: booking.user.email,
      subject: "Цаг захиалгын сануулга - BookMe",
      html: `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h2>Сайн байна уу, ${booking.user.username}!</h2>
          <p>Та 1 цагийн дараа цаг захиалгатай байна.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Захиалгын мэдээлэл:</h3>
            <p><strong>Цаг:</strong> ${moment(booking.selectedTime)
              .tz("Asia/Ulaanbaatar")
              .format("YYYY-MM-DD HH:mm")}</p>
            <p><strong>Ажилтан:</strong> ${booking.employee.name}</p>
            <p><strong>Компани:</strong> ${booking.company.companyName}</p>
            <p><strong>Захиалгын дугаар:</strong> ${booking._id.toString()}</p>
          </div>
          <p>Хэрэв та цагаа цуцлах эсвэл өөрчлөх шаардлагатай бол доорх холбоосоор орж үүднэ үү.</p>
          <a href="https://bookme.mn/bookings" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Захиалга харах</a>
          <br><br>
          <p>Баярлалаа,<br>BookMe багийнхан</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${booking.user.email}:`, info.response);

    await Booking.findByIdAndUpdate(booking._id, { reminderSent: true });
  } catch (error) {
    console.error(
      `Error sending reminder email to ${booking.user.email}:`,
      error
    );
  }
};

export const sendReminderEmailPlain = async (booking: PopulatedBooking) => {
  try {
    if (!booking.user?.email) {
      console.log(`Skipping booking ${booking._id} - no user email`);
      return;
    }

    const mailOptions = {
      from: "mnbookme@gmail.com",
      to: booking.user.email,
      subject: "Цаг захиалгын сануулга - BookMe",
      html: `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h2>Сайн байна уу, ${booking.user.username}!</h2>
          <p>Та 1 цагийн дараа цаг захиалгатай байна.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Захиалгын мэдээлэл:</h3>
            <p><strong>Цаг:</strong> ${moment(booking.selectedTime)
              .tz("Asia/Ulaanbaatar")
              .format("YYYY-MM-DD HH:mm")}</p>
            <p><strong>Ажилтан:</strong> ${booking.employee?.name || "N/A"}</p>
            <p><strong>Компани:</strong> ${
              booking.company?.companyName || "N/A"
            }</p>
            <p><strong>Захиалгын дугаар:</strong> ${booking._id}</p>
          </div>
          <p>Хэрэв та цагаа цуцлах эсвэл өөрчлөх шаардлагатай бол доорх холбоосоор орж үүднэ үү.</p>
          <a href="https://bookme.mn/bookings" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Захиалга харах</a>
          <br><br>
          <p>Баярлалаа,<br>BookMe багийнхан</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${booking.user.email}:`, info.response);

    await Booking.findByIdAndUpdate(booking._id, { reminderSent: true });
  } catch (error) {
    console.error(
      `Error sending reminder email to ${booking.user?.email}:`,
      error
    );
  }
};

const checkAndSendReminders = async () => {
  try {
    console.log("Checking for upcoming bookings...");

    // Get current time in Ulaanbaatar timezone
    const nowUB = moment().tz("Asia/Ulaanbaatar");
    console.log(
      `Current Ulaanbaatar time: ${nowUB.format("YYYY-MM-DD HH:mm:ss")}`
    );

    // Calculate target times for 1 hour reminder window
    const oneHourFromNowUB = nowUB.clone().add(1, "hour");
    const reminderWindowStart = nowUB.clone().add(55, "minutes");
    const reminderWindowEnd = nowUB.clone().add(65, "minutes");

    console.log(`Looking for bookings between:`);
    console.log(
      `  Start: ${reminderWindowStart.format("YYYY-MM-DD HH:mm:ss")} (UB time)`
    );
    console.log(
      `  End: ${reminderWindowEnd.format("YYYY-MM-DD HH:mm:ss")} (UB time)`
    );

    // Since selectedTime might be stored as string, we need to handle both cases
    // First, let's fetch all confirmed bookings that haven't had reminders sent
    const rawBookings = await Booking.find({
      status: "confirmed",
      $or: [{ reminderSent: { $exists: false } }, { reminderSent: false }],
    })
      .populate<{ user: PopulatedUser }>("user", "username email phoneNumber")
      .populate<{ employee: PopulatedEmployee }>("employee", "name")
      .populate<{ company: PopulatedCompany }>("company", "companyName")
      .lean()
      .exec();

    console.log(
      `Found ${rawBookings.length} total bookings without reminders sent`
    );

    // Filter bookings that need reminders (client-side filtering for string dates)
    const bookingsNeedingReminders = rawBookings.filter((booking) => {
      try {
        // Parse the selectedTime (handle both string and date formats)
        let bookingTime: moment.Moment;

        if (typeof booking.selectedTime === "string") {
          // Try parsing as various string formats
          bookingTime = moment.tz(
            booking.selectedTime,
            [
              "YYYY-MM-DD HH:mm:ss",
              "YYYY-MM-DD HH:mm",
              "YYYY-MM-DDTHH:mm:ss.SSSZ",
              "YYYY-MM-DDTHH:mm:ssZ",
              moment.ISO_8601,
            ],
            "Asia/Ulaanbaatar"
          );

          // If parsing failed, try as UTC then convert
          if (!bookingTime.isValid()) {
            bookingTime = moment
              .utc(booking.selectedTime)
              .tz("Asia/Ulaanbaatar");
          }
        } else {
          // If it's already a Date object
          bookingTime = moment(booking.selectedTime).tz("Asia/Ulaanbaatar");
        }

        if (!bookingTime.isValid()) {
          console.error(
            `Invalid date format for booking ${booking._id}: ${booking.selectedTime}`
          );
          return false;
        }

        const currentTimeUB = moment().tz("Asia/Ulaanbaatar");
        const minutesUntilBooking = bookingTime.diff(currentTimeUB, "minutes");

        console.log(`Booking ${booking._id}:`);
        console.log(`  Raw selectedTime: ${booking.selectedTime}`);
        console.log(
          `  Parsed time: ${bookingTime.format("YYYY-MM-DD HH:mm:ss")} (UB)`
        );
        console.log(
          `  Current time: ${currentTimeUB.format("YYYY-MM-DD HH:mm:ss")} (UB)`
        );
        console.log(`  Minutes until booking: ${minutesUntilBooking}`);

        // Check if booking is in the 55-65 minute window
        return minutesUntilBooking >= 55 && minutesUntilBooking <= 65;
      } catch (error) {
        console.error(`Error processing booking ${booking._id}:`, error);
        return false;
      }
    });

    console.log(
      `Found ${bookingsNeedingReminders.length} bookings needing reminders`
    );

    // Convert to PopulatedBooking type and send reminders
    for (const booking of bookingsNeedingReminders) {
      const populatedBooking: PopulatedBooking = {
        _id: booking._id.toString(),
        selectedTime: booking.selectedTime,
        status: booking.status,
        user: booking.user
          ? {
              _id: booking.user._id.toString(),
              username: booking.user.username,
              email: booking.user.email,
              phoneNumber: booking.user.phoneNumber,
            }
          : null,
        employee: booking.employee
          ? {
              _id: booking.employee._id.toString(),
              name: booking.employee.name,
            }
          : null,
        company: booking.company
          ? {
              _id: booking.company._id.toString(),
              companyName: booking.company.companyName,
            }
          : null,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        reminderSent: booking.reminderSent,
      };

      if (populatedBooking.user?.email) {
        console.log(`Sending reminder for booking ${populatedBooking._id}`);
        await sendReminderEmailPlain(populatedBooking);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log("Reminder check completed");
  } catch (error) {
    console.error("Error checking for reminders:", error);
  }
};

// Test function to manually check reminders (for debugging)
export const testReminderCheck = async () => {
  console.log("=== MANUAL REMINDER CHECK ===");
  await checkAndSendReminders();
  console.log("=== MANUAL CHECK COMPLETED ===");
};

// Schedule the cron job to run every 10 minutes for better coverage
cron.schedule("*/10 * * * *", () => {
  console.log("Running scheduled reminder check...");
  checkAndSendReminders();
});

export { checkAndSendReminders };
