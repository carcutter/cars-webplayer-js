type Props = { orientation?: "horizontal" | "vertical" };

const Separator: React.FC<Props> = ({ orientation = "horizontal" }) => {
  return (
    <div
      className={`bg-neutral/50 ${
        orientation === "horizontal" ? "h-px w-full" : "w-px"
      }`}
    />
  );
};

export default Separator;
