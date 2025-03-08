import EventEmitter from "events";
import sendEmail from "./Emails/sendEmail.js";

export const emitter = new EventEmitter();

//register email
emitter.on("register", async ({ email, html }) => {
  await sendEmail({
    to: email,
    subject: "Confirmation mail",
    html,
  }).catch((err) => {
    console.error("Failed to send email:", err);
  });
});

//Re-active account email
emitter.on("reActiveAccount", async ({ email, html }) => {
  await sendEmail({
    to: email,
    subject: "New Confirmation mail",
    html,
  }).catch((err) => {
    console.error("Failed to send email:", err);
  });
});

//forget password email
emitter.on("forgetPassword", async ({ email, html }) => {
  await sendEmail({
    to: email,
    subject: "Forget Password otp",
    html,
  }).catch((err) => {
    console.error("Failed to send email:", err);
  });
});

//delete user email
emitter.on("deleteUser", async ({ email, html }) => {
  await sendEmail({ to: email, subject: "reactivate account", html }).catch(
    (err) => {
      console.error("Failed to send email:", err);
    }
  );
});
