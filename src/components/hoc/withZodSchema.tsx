import { ZodSchema } from "zod";

function withZodSchema<T extends object, P extends React.PropsWithChildren<T>>(
  WrappedComponent: React.FC<P>,
  schema: ZodSchema<T>
) {
  return (props: P) => {
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
