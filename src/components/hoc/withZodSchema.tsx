import { ZodSchema } from "zod";

import ErrorTemplate from "@/components/template/ErrorTemplate";

function withZodSchema<T extends object, P extends React.PropsWithChildren<T>>(
  WrappedComponent: React.FC<P>,
  schema: ZodSchema<T>
) {
  return (props: P) => {
    const result = schema.safeParse(props);

    if (!result.success) {
      return (
        <ErrorTemplate
          title="Prop validation failed"
          error={result.error.issues}
        />
      );
    }

    return <WrappedComponent {...props} />;
  };
}

export default withZodSchema;
