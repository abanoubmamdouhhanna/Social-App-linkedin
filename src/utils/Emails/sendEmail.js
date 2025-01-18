import nodemailer from "nodemailer";

async function sendEmail({
  to = [],
  cc,
  bcc,
  subject,
  text,
  html,
  attachments = [],
} = {}) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.APP_NAME} <${process.env.EMAIL}`,
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    attachments
  });
  return info.rejected.length ? false : true;
}
export default sendEmail;
