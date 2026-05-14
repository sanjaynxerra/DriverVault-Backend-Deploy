const User = require("../../user/user.model");
const mongoose = require("mongoose")

exports.getUser = async () => {
 return await User.aggregate([

    {
      $match: {
        role: { $ne: "admin" },
      },
    },
    // DRIVER PROFILE
    {
      $lookup: {
        from: "drivers",
        localField: "_id",
        foreignField: "user",
        as: "driverProfile",
      },
    },

    // CARRIER PROFILE
    {
      $lookup: {
        from: "carriers",
        localField: "_id",
        foreignField: "user",
        as: "carrierProfile",
      },
    },

    // Convert arrays to object
    {
      $addFields: {
        driverProfile: {
          $arrayElemAt: ["$driverProfile", 0],
        },
        carrierProfile: {
          $arrayElemAt: ["$carrierProfile", 0],
        },
      },
    },

    // COMMON PROFILE FIELD
    {
      $addFields: {
        profile: {
          $cond: [
            { $eq: ["$role", "driver"] },
            "$driverProfile",
            "$carrierProfile",
          ],
        },
      },
    },

    // REMOVE EXTRA DATA
    {
      $project: {
        password: 0,
        driverProfile: 0,
        carrierProfile: 0,
        __v: 0,
      },
    },

    // SORT NEWEST FIRST
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);
};


exports.getUserById = async (id) =>{
    return await User.aggregate([

    {
      $match: {
         _id: new mongoose.Types.ObjectId(id),
        role: { $ne: "admin" },
      },
    },
    // DRIVER PROFILE
    {
      $lookup: {
        from: "drivers",  
        localField: "_id",
        foreignField: "user",
        as: "driverProfile",
      },
    },

    // CARRIER PROFILE
    {
      $lookup: {
        from: "carriers",
        localField: "_id",
        foreignField: "user",
        as: "carrierProfile",
      },
    },

    // Convert arrays to object
    {
      $addFields: {
        driverProfile: {
          $arrayElemAt: ["$driverProfile", 0],
        },
        carrierProfile: {
          $arrayElemAt: ["$carrierProfile", 0],
        },
      },
    },

    // COMMON PROFILE FIELD
    {
      $addFields: {
        profile: {
          $cond: [
            { $eq: ["$role", "driver"] },
            "$driverProfile",
            "$carrierProfile",
          ],
        },
      },
    },

    // REMOVE EXTRA DATA
    {
      $project: {
        password: 0,
        driverProfile: 0,
        carrierProfile: 0,
        __v: 0,
      },
    },

    // SORT NEWEST FIRST
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);
}