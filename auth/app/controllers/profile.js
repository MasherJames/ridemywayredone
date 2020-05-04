import { UserInputError, ApolloError } from "apollo-server";

import models from "../db/models";
import validProfileRegistration from "../utils/validations/profile";
import fileUuid from "../utils/generateUuid";
import uploadFile from "../utils/fileUploads";

const Profile = models.Profile;
const User = models.User;
const sequelize = models.sequelize;

class ProfileController {
  static async updateProfile(profileInput, ctx) {
    // de-structure the profile inputs
    let {
      profilePicture,
      userName,
      middleNae,
      address,
      gender,
      country,
    } = profileInput;

    // handle user input validations
    const { errors, isError } = validProfileRegistration({
      userName,
      middleNae,
      address,
      gender,
      country,
    });
    if (isError) {
      throw new UserInputError("Profile inputs invalid", errors);
    }

    // User must have finished phone and email verification
    const user = await User.findOne({
      where: {
        uuid: ctx.user.uuid,
      },
    });

    if (!user.isEmailVerified || !user.isPhoneVerified) {
      throw new ApolloError(
        `Please verify your ${!isEmailVerified ? "email" : "phone number"}`,
        `${!isEmailVerified ? "EMAIL" : "PHONE_NUMBER"}_VERIFICATION_ERROR`
      );
    }
    /*
    fetch profile if it exists and update it, else create a new profile
    for the logged in user
    */

    // if a profile picture is provided, upload it to a third party service and record the url
    let profilePictureUrl;

    if (profilePicture) {
      let { createReadStream, filename, mimetype } = await profilePicture;

      filename = `${filename.split(".")[0]}${fileUuid()}.${
        filename.split(".")[1]
      }`;

      try {
        profilePictureUrl = await uploadFile(
          "profile-picture",
          filename,
          createReadStream,
          mimetype
        );
      } catch (error) {
        throw new ApolloError(
          "An error occurred while uploading the profile picture",
          "PROFILE_PICTURE_UPLOAD_ERROR",
          error
        );
      }
    }

    // start a transaction to be used be either of the operation
    const t = await sequelize.transaction();

    const existingProfile = await Profile.findOne({
      where: {
        userId: ctx.user.uuid,
      },
    });

    try {
      let profile;
      if (existingProfile) {
        // Update profile
        profilePictureUrl = profilePictureUrl
          ? profilePictureUrl[1]
          : existingProfile.profilePicture;
        userName = userName ? userName : existingProfile.userName;
        middleNae = middleNae ? middleNae : existingProfile.middleNae;
        address = address ? address : existingProfile.address;
        gender = gender ? gender : existingProfile.gender;
        country = country ? country : existingProfile.country;

        const updatedProfile = await Profile.update(
          {
            profilePicture: profilePictureUrl,
            userName,
            middleNae,
            address,
            gender,
            country,
          },
          {
            returning: true,
            where: {
              uuid: existingProfile.uuid,
            },
            transaction: t,
          }
        );

        profile = updatedProfile[1][0];

        // commit the transaction if no error
        await t.commit();
      } else {
        // Create new profile
        profile = await Profile.create(
          {
            profilePicture: profilePicture ? profilePictureUrl[1] : null,
            userName,
            middleNae,
            address,
            gender,
            country,
            userId: ctx.user.uuid,
          },
          {
            transaction: t,
          }
        );

        // commit the transaction if no erro
        await t.commit();
      }

      return {
        success: true,
        message: "Profile updated successfully",
        profile,
      };
    } catch (error) {
      // rollback the transaction if an error occurred
      await t.rollback();

      throw new ApolloError(
        `Error ${error.message}`,
        "PROFILE_UPDATE_ERROR",
        error
      );
    }
  }
}

export default ProfileController;
