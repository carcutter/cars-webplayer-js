type Props = { currentIndex: number; maxIndex: number };

const IndexIndicator: React.FC<Props> = ({ currentIndex, maxIndex }) => {
  return (
    <div className="rounded-ui bg-foreground/40 px-2 py-1 text-xs text-background/75 sm:text-sm">
      {currentIndex + 1} / {maxIndex + 1}
    </div>
  );
};

export default IndexIndicator;
