import { ZodSchema } from "zod";

function withZodSchema<T extends object>(
  WrappedComponent: React.FC<T>,
  schema: ZodSchema<T>
) {
  return (props: T) => {
    const result = schema.safeParse(props);

    if (!result.success) {
      // eslint-disable-next-line no-console
      console.error("Prop validation failed:", result.error);
      return null; // TODO: render a fallback UI
    }

    return <WrappedComponent {...props} />;
  };
}

export default withZodSchema;
