import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "Last words API",
      version: "1.1.0",
    },
    basePath: "/",
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["src/controllers/*.ts", "src/controllers/*.js"],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
