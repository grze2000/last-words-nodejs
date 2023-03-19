import { userDto } from './../dto/user.dto';
import { Router } from "express";
import { checkSchema } from "express-validator";
import passport from "passport";
import { handleValidationErrors } from "../middlewares/express/handleValidationErrors";
import profileService from "../services/profile.service";

const profileController = Router();

/**
 * @swagger
 * /v1/profile:
 *  get:
 *    tags: [Profile]
 *    summary: Get user's profile
 *    security:
 *     - bearerAuth: []
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                fullname:
 *                  type: string
 *                email:
 *                  type: string
 */
profileController.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileService.getUserProfile
);

/**
 * @swagger
 * /v1/profile:
 *  patch:
 *    tags: [Profile]
 *    summary: Update user's profile
 *    security:
 *     - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              fullName:
 *                type: string
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 */
profileController.patch(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkSchema(userDto),
  handleValidationErrors,
  profileService.updateUserProfile
);

export { profileController };
