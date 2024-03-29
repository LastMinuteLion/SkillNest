import { SubSection } from "../models/Subsection.models.js";
import { Section } from "../models/Section.models.js";
import { Course } from "../models/Course.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createSubSection  = asyncHandler(async(res,req) =>{
    const{title ,description , timeDuration , sectionId} = req.body;

    const video = req.files.videoFile;


    if(!title || !description || !timeDuration || !sectionId || !video){
        throw new ApiError(400, "All details required")
    }

    const uploadDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME);

    const newSubSection = await SubSection.create({
        title:title,
        timeDuration:timeDuration,
        description:description,
        videoUrl:uploadDetails.secure_url
    })

    const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                          {$push:{
                                            subSection:newSubSection._id,
                                          }},
                                          {new:true}).populate("subSection").exec();

                                          

    return res.status(200).json(
        new ApiResponse(200 , updateSubsecton,"Subsection Created succesfully")
    )
})





const updateSubSection = asyncHandler(async(req,res) =>{
  const {sectionId , subSectionId , title , description} =req.body;

  const video = req.file.videoFile;

  if(!title || !description || !subSectionId || !subSectionId || !video){
    throw new ApiError(400, "All details required")
  }

  const subSection = await SubSection.findById({subSectionId});

  if(!subSection){
    throw new ApiError(404 , "SubSection does not exist")
  }


    subSection.title = title;
    subSection.description = description;

    // Upload new video and update videoUrl
    const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
    subSection.videoUrl = uploadDetails.secure_url;

    // Save the updated subSection
    await subSection.save();

    return res.status(200).json(
        new ApiResponse(200, subSection, "Subsection updated successfully")
    );
})

const deleteSubSection = asyncHandler(async(req,res) =>{
    const { subSectionId, sectionId } = req.body;

    if (!subSectionId  || !sectionId) {
        throw new ApiError(400, "all details are required");
    }

    // Find the subSection to delete
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
        throw new ApiError(404, "SubSection does not exist");
    }

    // Delete the subSection
    await subSection.remove();

    // If sectionId is provided, update the associated section to remove the reference to this subsection
    if (sectionId) {
        await Section.updateOne(
            { _id: sectionId },
            { $pull: { subSection: subSectionId } }
        );
    }

    return res.status(200).json(
        new ApiResponse(200, {} , "Subsection deleted successfully")
    );
})

export {
    createSubSection,
    updateSubSection,
    deleteSubSection
}