import z from "zod";

const schema = z.object({
  id: z.string(),
  name: z.string(),
  grade: z.array(z.string()),
  isActive: z.boolean(),
});

export default schema;
