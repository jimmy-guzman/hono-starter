import { OpenAPIHono } from "@hono/zod-openapi";

export const hono = () => {
  const app = new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            details: result.error.flatten(),
            message: "Your request did not match the expected schema.",
            status: 422,
          },
          422,
        );
      }
    },
  });

  return app;
};
