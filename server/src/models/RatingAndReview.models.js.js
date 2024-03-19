import mongoose , {Schema} from "mongoose";

const ratingAndReviewsSchema = new Schema(
    {
        user:{
            type:Schema.Types.ObjectId,
            required:true,
            ref: "User",
        },
        rating: {
            type:Number,
            required:true,
        },
        review:{
            type:String,
            required:true,
        }
    },

    {
        timestamps:true,
    }
)

export const RatingAndReviews = mongoose.model("RatingAndReviews" ,ratingAndReviewsSchema);