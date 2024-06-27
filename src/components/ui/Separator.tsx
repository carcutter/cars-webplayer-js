type Props = { orientation?: "horizontal" | "vertical" };

const Separator: React.FC<Props> = ({ orientation = "horizontal" }) => {
  const sizingClasses = orientation === "horizontal" ? "h-px w-full" : "w-px";

  return <div className={`bg-neutral/50 ${sizingClasses}`} />;
};

export default Separator;
