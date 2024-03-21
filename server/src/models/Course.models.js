import mongoose , {Schema} from "mongoose";

const courseSchema = new Schema(
    {
        courseName: {
            type:String,
        },
        courseDescription: {
            type:String,
        },
        instructor: {
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        whatYouWillLearn: {
            type:String,
        },
        courseContent: [
            {
                type:Schema.Types.ObjectId,
                ref:"Section",
            }
        ],
        ratingAndReviews: [
            {
                type:Schema.Types.ObjectId,
                ref:"RatingAndReview",
            }
        ],
        price:{
            type:Number,
        },
        thumbnail:{
            type:String,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref:"Category",
        },
        studentsEnrolled: [{
            type:Schema.Types.ObjectId,
            required:true,
            ref:"User",
        }]

    },

    {
        timestamps:true,
    }
)

export const Course = mongoose.model("Course" ,courseSchema);