import mongoose , {Schema} from "mongoose";

const userSchema = new Schema(
    {
      firstName:{
        type:String,
        required:true,
        trim:true,
      },

      lastName:{
        type:String,
        required:true,
        trim:true,
      },
      email:{
        type:String,
        required:true,
        trim:true,
      },
      password:{
        type:String,
        required:[true,"Password is required"]
      
      }
      ,

      accountType:{
        type:String,
        enum:["Admin" , "Student" , "Instructor"],
        required:true,
      },

      additionalDetails:{
        type:Schema.Types.ObjectId,
        ref:"Profile",
        required:true,
      },
      courses:[
        {
            type:Schema.Types.ObjectId,
            ref:"Courses"
        }
      ],
      image:{
        type:String,
        required:true,
      },
      token:{
        type:String,
      },

      resetPasswordExpires:{
        type:Date,
      },
      
      courseProgress:[
        {
            type:Schema.Types.ObjectId,
            ref:"CourseProgress",
        }
      ]

    },

    {
        timestamps:true,
    }
)

export const User = mongoose.model("User" ,userSchema);