import z from "zod";

const schema = z.object({
  $schema: z.string(),
  id: z.string(),
  name: z.string(),
  grade: z.array(z.string()),
  isActive: z.boolean(),
});

export default schema;
