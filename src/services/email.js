const nodemailer = require("nodemailer");

class EmailManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "sofianavasd@gmail.com",
        pass: "tpmg gqja agpk deqt",
      },
    });
  }

  async sendEmail(email, first_name, ticket) {
    try {
      const mailOptions = {
        from: "<sofianavasd@gmail.com>",
        to: email,
        subject: "Confirmacion de compra",
        html: (
          <div>
            <h1>Confirmación de compra</h1>
            <p>Hola ${first_name}. Gracias por tu compra!</p>
            <p>Tu ticket es: ${ticket}</p>
          </div>
        ),
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }
  }
  async enviarCorreoRestablecimiento(email, first_name, token) {
    try {
      const mailOptions = {
        from: "<sofianavasd@gmail.com>",
        to: email,
        subject: "Restablecer contraseña",
        html: (
          <div>
            <h1>Restablecer contraseña</h1>
            <p>
              Hola ${first_name}. Haz click en el siguiente enlace para
              restablecer tu contraseña:
            </p>
            <p>
              <a href="http://localhost:8080/api/users/resetpassword/${token}">
                Restablecer contraseña
              </a>
            </p>
          </div>
        ),
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }
  }
}
module.exports = EmailManager;
