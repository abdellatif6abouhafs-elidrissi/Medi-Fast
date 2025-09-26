const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5,
  },
  specialties: [
    {
      type: String,
    },
  ],
  workingHours: {
    type: String,
    required: true,
    default: "8:00 ص - 9:00 م",
  },
  image: {
    type: String,
    default: "🏪",
  },
  medicines: [
    {
      name: {
        type: String,
        required: true,
      },
      description: String,
      price: Number,
      inStock: {
        type: Boolean,
        default: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

pharmacySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

pharmacySchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);

module.exports = Pharmacy;
