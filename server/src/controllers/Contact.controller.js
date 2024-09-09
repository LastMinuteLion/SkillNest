import { contactUsEmail } from "../mail/templates/contactFormRes.js";
import mailSender from "../utils/mailSender.js";

const contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;
  console.log(req.body);

  try {
    const emailRes = await mailSender(
      email,
      "Your Data sent successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );
    console.log("Email Res ", emailRes);

    return res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log("Error", error);
    console.log("Error message:", error.message);

    return res.json({
      success: false,
      message: "Something went wrong...",
    });
  }
};

export{
    contactUsController
}