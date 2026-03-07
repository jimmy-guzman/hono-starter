import { createRoute, z } from "@hono/zod-openapi";

import { ApiError, NewTacoBody, Taco, UpdateTacoBody } from "./tacos.schema";

const TacoIdParam = z
  .object({
    tacoId: z.string().openapi({ example: "taco_01h2xcejqtf2nbrexx3vqjhp41" }),
  })
  .openapi("TacoIdParam");

const internalServerError = {
  content: { "application/json": { schema: ApiError } },
  description: "Internal server error.",
  summary: "Internal Server Error",
};

export const ListTacosRoute = createRoute({
  description: "Retrieve a list of all tacos.",
  method: "get",
  path: "/tacos",
  responses: {
    200: {
      content: { "application/json": { schema: z.array(Taco) } },
      description: "List of tacos",
      summary: "OK",
    },
    500: internalServerError,
  },
  summary: "List Tacos",
  tags: ["Tacos"],
});

export const CreateTacoRoute = createRoute({
  description: "Create a new taco.",
  method: "post",
  path: "/tacos",
  request: {
    body: { content: { "application/json": { schema: NewTacoBody } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: Taco } },
      description: "Taco created successfully.",
      summary: "Created",
    },
    422: {
      content: { "application/json": { schema: ApiError } },
      description: "Validation Error",
      summary: "Validation Error",
    },
    500: internalServerError,
  },
  summary: "Create Taco",
  tags: ["Tacos"],
});

export const GetTacoRoute = createRoute({
  description: "Retrieve a specific taco by its ID.",
  method: "get",
  path: "/tacos/{tacoId}",
  request: { params: TacoIdParam },
  responses: {
    200: {
      content: { "application/json": { schema: Taco } },
      description: "The requested taco.",
      summary: "OK",
    },
    404: {
      content: { "application/json": { schema: ApiError } },
      description: "Taco not found.",
      summary: "Not Found",
    },
    422: {
      content: { "application/json": { schema: ApiError } },
      description: "Validation Error",
      summary: "Validation Error",
    },
    500: internalServerError,
  },
  summary: "Get Taco by ID",
  tags: ["Tacos"],
});

export const UpdateTacoRoute = createRoute({
  description: "Update an existing taco by its ID.",
  method: "patch",
  path: "/tacos/{tacoId}",
  request: {
    body: { content: { "application/json": { schema: UpdateTacoBody } } },
    params: TacoIdParam,
  },
  responses: {
    200: {
      content: { "application/json": { schema: Taco } },
      description: "Taco updated successfully.",
      summary: "Updated",
    },
    404: {
      content: { "application/json": { schema: ApiError } },
      description: "Taco not found.",
      summary: "Not Found",
    },
    422: {
      content: { "application/json": { schema: ApiError } },
      description: "Validation Error",
      summary: "Validation Error",
    },
    500: internalServerError,
  },
  summary: "Update Taco",
  tags: ["Tacos"],
});

export const DeleteTacoRoute = createRoute({
  description: "Delete a specific taco by its ID.",
  method: "delete",
  path: "/tacos/{tacoId}",
  request: { params: TacoIdParam },
  responses: {
    204: {
      description: "Taco deleted successfully.",
      summary: "No Content",
    },
    404: {
      content: { "application/json": { schema: ApiError } },
      description: "Taco not found.",
      summary: "Not Found",
    },
    422: {
      content: { "application/json": { schema: ApiError } },
      description: "Validation Error",
      summary: "Validation Error",
    },
    500: internalServerError,
  },
  summary: "Delete Taco",
  tags: ["Tacos"],
});
