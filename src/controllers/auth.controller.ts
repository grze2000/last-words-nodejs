import { Router } from "express";
import { checkSchema } from "express-validator";
import { externalLoginDto } from "../dto/externalLogin.dto";
import { loginDto } from "../dto/login.dto";
import { registerDto } from "../dto/register.dto";
import { tokenDto } from "../dto/token.dto";
import { handleValidationErrors } from "../middlewares/express/handleValidationErrors";
import authService from "../services/auth.service";

const authController = Router();

/**
 * @swagger
 * /v1/auth/login:
 *  post:
 *    tags: [Auth]
 *    summary: Log in a user
 *    security: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *                format: password
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                refreshToken:
 *                  type: string
 *                email:
 *                  type: string
 *
 */
authController.post(
  "/login",
  checkSchema(loginDto),
  handleValidationErrors,
  authService.login
);

/**
 * @swagger
 * /v1/auth/external-login:
 *  post:
 *    tags: [Auth]
 *    summary: Log or register a user with an external provider
 *    security: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *              provider:
 *                type: string
 *                enum: [google]
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                refreshToken:
 *                  type: string
 *                email:
 *                  type: string
 *
 */
authController.post(
  "/external-login",
  checkSchema(externalLoginDto),
  handleValidationErrors,
  authService.loginWithProvider
);

/**
 * @swagger
 * /v1/auth/register:
 *  post:
 *    tags: [Auth]
 *    summary: Create a new user
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *             confirmPassword:
 *               type: string
 *               format: password
 *    responses:
 *      201:
 *        description: Account has been created
 */
authController.post(
  "/register",
  checkSchema(registerDto),
  handleValidationErrors,
  authService.register
);

/**
 * @swagger
 * /v1/auth/refresh-token:
 *  post:
 *    tags: [Auth]
 *    security: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                refreshToken:
 *                  type: string
 */
authController.post(
  "/refresh-token",
  checkSchema(tokenDto),
  handleValidationErrors,
  authService.refreshToken
);

/**
 * @swagger
 * /v1/auth/revoke-token:
 *  post:
 *    tags: [Auth]
 *    security: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Invalid token
 */
authController.post(
  "/revoke-token",
  checkSchema(tokenDto),
  handleValidationErrors,
  authService.revokeToken
);

/**
 * @swagger
 * /v1/auth/me:
 *  get:
 *    tags: [Auth]
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

export { authController };
