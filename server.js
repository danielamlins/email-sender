let express = require("express");
let app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

let whitelist = ['https://email.danielalins.com', 'https://portifolio.danielalins.com'];

const cors = require('cors');

let corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.options('/email', cors(corsOptionsDelegate));

app.post("/email", cors(corsOptionsDelegate), function (req, res) {
  body = req.body;
  email = body.email;
  subject = body.subject;
  message = body.message;

  const msg = {
    to: "danielamlins@gmail.com", // Change to your recipient
    from: "contact@danielalins.com", // Change to your verified sender
    subject: subject,
    text: `${message} from ${email}`,
    html: `${message} from ${email}`,
  };

  const msgConfirmation = {
    to: email, // Change to your recipient
    from: "contact@danielalins.com", // Change to your verified sender
    subject: "Thank you for the message",
    text:
      "Thank you for the contact. We have received your message and will answer as soon as possible.",
    html:
      "Thank you for the contact. We have received your message and will answer as soon as possible.",
  };

  let emailSent = sendEmail(msg);
  let confirmationSent = sendEmail(msgConfirmation);
  res.send([emailSent, confirmationSent]);
});

function sendEmail(msg) {
  const sgMail = require("@sendgrid/mail");
  const errorMessage = "";
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  sgMail
    .send(msg)
    .then(() => {
      console.log("Confirmation email sent");
    })
    .catch((error) => {
      errorMessage = error;
    });
  return errorMessage;
}

// Initiate server
let port = 8000;
if (process.env.PORT) {
    port = process.env.PORT;
}

let server = app.listen(port, function () {
  let host = server.address().address;
  let port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
