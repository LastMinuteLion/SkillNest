import { instance } from "../utils/razorpay";
import { Course } from "../models/Course.models.js";
import { User } from "../models/User.models.js";
import { mailSender } from "../utils/mailSender.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose"
import courseEnrollmentEmail from "../mail/templates/courseEnrollmentEmail";


//capture Payment and initiate the Razorpay order

const capturePayment = asyncHandler(async(req,res)=>{
    const {course_id} = req.body;
    const userId = req.user.id;

    if(!course_id){
        throw new ApiError(400 , "Course id not valid")
    }

    let course ;
    try {
        course = await Course.findById(course_id);
        if(!course){
            throw new ApiError(400 , "Could not find course")
        }

        //user already paid for course

        const uid = Types.ObjectId(userId);

        if(course.studentsEnrolled.includes(uid)){
            throw new ApiError(402,"Student is already enrolled")
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }

    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount *100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId
        }
    };

    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount
        })
    } catch (error) {
        console.log(error);
        res.status(409).json({
            success:false,
            message:"Could not initiate order"
        })
    }

})

const verifySignature = asyncHandler(async(req,res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256" , webhookSecret);

    shasum.update(JSON.stringify(req.body));

    const digest = shasum.digest("hex");

    if(signature == digest){
        console.log("Payment is Authorised");
        const {courseId , userId} = req.body.payload.payment.entity.notes;

        try{
            const enrolledCourse = await Course.findByIdAndUpdate(
                courseId,
                {
                    $push:{
                        studentsEnrolled:userId,
                    },
                },
                {
                    new:true
                }
            );
            if(!enrolledCourse){
                throw new ApiError(500,"Course not found")
            }

            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push:{
                        courses:courseId,
                    },
                },
                {new:true}
            );

            console.log(enrolledCourse);
            console.log(enrolledStudent);

            if(!enrolledStudent){
                throw new ApiError(500,"Student not found")
            }

            const mailResponse = mailSender(
                enrolledStudent.email,
                "Congratulaions",
                "Congratulations, you are enrolled in our Course"
            )

            return res.status(200)
                      .json(
                        new ApiResponse(200,{} , "Signature verified course addes")
                      )

        }catch(error){
            console.log(error);
            return res.status(500).json(
                {success:false,
                  message:error.message
                }

            )
        }
    }
    else{
        throw new ApiError(500,"Invalid request")
    }
})


export{
    capturePayment,
    verifySignature
}