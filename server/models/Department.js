import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  description: String,
  categories: [
    {
      type: String,
      enum: [
        "Roads & Transportation",
        "Water Supply",
        "Electricity",
        "Sanitation",
        "Street Lighting",
        "Public Safety",
        "Healthcare",
        "Education",
        "Others",
      ],
    },
  ],
  jurisdiction: {
    type: String,
    enum: ["city", "zone", "ward", "state"],
    default: "city",
  },
  contactEmail: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
  },
  contactPhone: String,
  officers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      designation: String,
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  workloadCapacity: {
    type: Number,
    default: 50,
  },
  currentWorkload: {
    type: Number,
    default: 0,
  },
  performanceMetrics: {
    totalResolved: {
      type: Number,
      default: 0,
    },
    avgResolutionTime: Number,
    satisfactionRating: {
      type: Number,
      min: 0,
      max: 5,
    },
    slaComplianceRate: Number,
  },
  slaTargets: {
    critical: Number,
    high: Number,
    medium: Number,
    low: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

departmentSchema.index({ code: 1 });
departmentSchema.index({ categories: 1 });

const Department = mongoose.model("Department", departmentSchema);

export default Department;
