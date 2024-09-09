import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

// Authentication middleware
const auth = asyncHandler(async (req, res, next) => {
    try {
        // Extract token from headers or cookies
        const authHeader = req.header("Authorization");
        const token = req.cookies.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : req.body.token);

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded); // Optional: for debugging
            req.user = decoded;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
        }

        next();
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Authentication failed",
        });
    }
});

// Role-based middleware
const isStudent = asyncHandler(async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Students only',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to verify user role',
        });
    }
});

const isInstructor = asyncHandler(async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Instructors only',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to verify user role',
        });
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Admins only',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to verify user role',
        });
    }
});

export {
    isAdmin,
    isInstructor,
    auth,
    isStudent
};
