import mongoose , {Schema} from "mongoose";

const subSectionSchema = new Schema(
    {
        title:{
            type:String,
        },
        timeDuration: {
            type: String,
        },
        description: {
            type:String,
        },
        videoUrl:{
            type:String,
        },
    },

    {
        timestamps:true,
    }
);

export const SubSection = mongoose.model("SubSection" ,subSectionSchema);