import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true
    },
    password: { 
      type: String,
      required: true, 
      select: false
    },
    image: { 
      type: String 
    },
    resumeUrl: {
      type: String,
      default: null
    },
    resumeData: {
      skills: [String],
      experience: String,
      education: String,
      summary: String,
      // Add more fields as needed
    },
    provider: { 
      type: String, 
      default: "credentials",
      enum: ["credentials", "google", "linkedin"]
    },
    providerId: { 
      type: String 
    },
    applications: [{
      jobId: String,
      companyName: String,
      jobTitle: String,
      dateApplied: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ["Applied", "Interview", "Rejected", "Withdrawn"],
        default: "Applied"
      },
      resumeShared: {
        type: Boolean,
        default: false
      }
    }]
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
