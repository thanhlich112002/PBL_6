const nodemailer = require("nodemailer");
const pug = require("pug");
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESEH_TOKEN });

module.exports = class Email {
  constructor(user, token, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.from = `FALTH`;
    this.url = url;
    this.token = token;
  }

  async newTransport() {
    const accessToken = await oAuth2Client.getAccessToken();
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "lehonganh1903@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.REFRESEH_TOKEN,
        accessToken: accessToken,
      },
    });
  }

  // Send the actual email

  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
      token: this.token,
    });
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };
    // 3) Create a transport and send email
    const transport = await this.newTransport();
    await transport.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("verifySignUp", "Welcome to FALTH!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
  async sendAcceptEmail() {
    await this.send("acceptedEmail", "Email xác nhận đăng ký");
  }
  async sendRefuseEmail() {
    await this.send("refuseEmail", "Email xác nhận đăng ký");
  }
};
