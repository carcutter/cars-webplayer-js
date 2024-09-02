type Props = { progress: number };

const ProgressBar: React.FC<Props> = ({ progress }) => {
  return (
    <div className="h-1 w-full overflow-hidden rounded-ui-sm bg-background/25">
      <div
        className="size-full rounded-ui-sm bg-background transition-transform"
        style={{ transform: `translateX(-${100 * (1 - progress)}%)` }}
      />
    </div>
  );
};

export default ProgressBar;
