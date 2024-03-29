import mongoose , {Schema} from "mongoose";
import mailSender from "../utils/mailSender.js";
import otpTemplate from "../mail/templates/emailVerification.mjs";

const OTPSchema = new Schema(
    {
        email:{
            type:String,
            required: true,
        },
        otp: {
            type:String,
            required:true,
        },
        createdAt: {
            type:Date,
            default:Date.now(),
            expires: 300,
        }
    }
)

const sendVerificationEmail = async (email, otp) => {
    try {
        const mailResponse = await mailSender(email, "Verification Email from SkillNest", otpTemplate(otp));
        console.log("Email sent Successfully: ", mailResponse);
    } catch(error) {
        console.log("error occurred while sending mails: ", error);
        throw error;
    }
};

OTPSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
});

export const OTP = mongoose.model("OTP" , OTPSchema);