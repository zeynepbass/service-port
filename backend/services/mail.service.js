import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transport;

function getTransport() {
  if (!transport) {
    transport =
      env.NODE_ENV === "test"
        ? nodemailer.createTransport({ jsonTransport: true })
        : nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: env.SMTP_PORT === 465,
            auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
          });
  }
  return transport;
}

export async function sendPasswordResetMail({ to, firstName, resetUrl, expiresInMinutes }) {
  return getTransport().sendMail({
    from: env.MAIL_FROM,
    to,
    subject: "Hizmet Kap parola sıfırlama",
    text: [
      `Merhaba ${firstName},`,
      "",
      "Parolanı sıfırlamak için aşağıdaki bağlantıyı kullanabilirsin:",
      resetUrl,
      "",
      `Bağlantı ${expiresInMinutes} dakika boyunca ve yalnızca bir kez geçerlidir.`,
      "Bu isteği sen yapmadıysan bu e-postayı görmezden gelebilirsin.",
    ].join("\n"),
  });
}
