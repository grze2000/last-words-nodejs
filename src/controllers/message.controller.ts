import { Router } from "express";
import { checkSchema, param } from "express-validator";
import passport from "passport";
import { messageDto } from "../dto/message.dto";
import { paginationDto } from "../dto/pagination.dto";
import { handleValidationErrors } from "../middlewares/express/handleValidationErrors";
import messageService from "../services/message.service";

const messageController = Router();

/**
 * @swagger
 * /v1/messages:
 *  get:
 *    tags: [Messages]
 *    summary: Get a list user's messages
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: pageSize
 *        schema:
 *          type: integer
 *      - in: query
 *        name: pageNumber
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                      triggerType:
 *                        type: string
 *                        enum: [INACTIVITY, DATE]
 *                      triggerDate:
 *                        type: string
 *                        format: date-time
 *                      afterInactivity:
 *                        type: integer
 *                      sent:
 *                        type: string
 *                        format: date-time
 *                      phoneNumber:
 *                        type: string
 *                      smsMessage:
 *                        type: string
 *                      email:
 *                        type: string
 *                      emailMessage:
 *                        type: string
 *                      user:
 *                        type: object
 *                        properties:
 *                          _id:
 *                            type: string
 *                          email:
 *                            type: string
 *                          fullName:
 *                            type: string
 *                      files:
 *                        type: array
 *                        items:
 *                          type: string
 *
 *                pageSize:
 *                  type: integer
 *                pageNumber:
 *                  type: integer
 *                totalPages:
 *                  type: integer
 */
messageController.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkSchema(paginationDto),
  handleValidationErrors,
  messageService.getMessages
);

/**
 * @swagger
 * /v1/messages/{messageId}:
 *  get:
 *    tags: [Messages]
 *    summary: Get user's message by id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: messageId
 *        required: true
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                triggerType:
 *                  type: string
 *                  enum: [INACTIVITY, DATE]
 *                triggerDate:
 *                  type: string
 *                  format: date-time
 *                afterInactivity:
 *                  type: integer
 *                sent:
 *                  type: string
 *                  format: date-time
 *                phoneNumber:
 *                  type: string
 *                smsMessage:
 *                  type: string
 *                email:
 *                  type: string
 *                emailMessage:
 *                  type: string
 *                user:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                    email:
 *                      type: string
 *                    fullName:
 *                      type: string
 *                files:
 *                  type: array
 *                  items:
 *                    type: string
 */
messageController.get(
  "/:messageId",
  passport.authenticate("jwt", { session: false }),
  param("messageId").isMongoId(),
  handleValidationErrors,
  messageService.getMessage
);

/**
 * @swagger
 * /v1/messages:
 *  post:
 *    tags: [Messages]
 *    summary: Add a message
 *    security:
 *     - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              triggerType:
 *                type: string
 *                enum: [INACTIVITY, DATE]
 *              triggerDate:
 *                type: string
 *                format: date-time
 *              afterInactivity:
 *                type: integer
 *              phoneNumber:
 *                type: string
 *              smsMessage:
 *                type: string
 *              email:
 *                type: string
 *              emailMessage:
 *                type: string
 *    responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 */
messageController.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkSchema(messageDto),
  handleValidationErrors,
  messageService.createMessage
);

/**
 * @swagger
 * /v1/messages/{messageId}:
 *  patch:
 *    tags: [Messages]
 *    summary: Update a message
 *    security:
 *     - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              triggerType:
 *                type: string
 *                enum: [INACTIVITY, DATE]
 *              triggerDate:
 *                type: string
 *                format: date-time
 *              afterInactivity:
 *                type: integer
 *              phoneNumber:
 *                type: string
 *              smsMessage:
 *                type: string
 *              email:
 *                type: string
 *              emailMessage:
 *                type: string
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 */
messageController.patch(
  "/",
  passport.authenticate("jwt", { session: false }),
  param("messageId").isMongoId(),
  checkSchema(messageDto),
  handleValidationErrors,
  messageService.updateMessage
);

/**
 * @swagger
 * /v1/messages/{messageId}:
 *  delete:
 *    tags: [Messages]
 *    summary: Delete a message
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: messageId
 *        required: true
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 */
messageController.delete(
  "/:messageId",
  passport.authenticate("jwt", { session: false }),
  param("messageId").isMongoId(),
  handleValidationErrors,
  messageService.deleteMessage
);

export { messageController };
