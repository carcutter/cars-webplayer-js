type Props = { currentIndex: number; maxIndex: number };

const IndexIndicator: React.FC<Props> = ({ currentIndex, maxIndex }) => {
  return (
    <div className="space-x-0.5 rounded-ui bg-foreground/40 px-1.5 py-0.5 text-xs text-background/75 transition-radius small:space-x-1 small:px-2 small:py-1 small:text-sm">
      <span>{currentIndex + 1}</span>
      <span>/</span>
      <span>{maxIndex + 1}</span>
    </div>
  );
};

export default IndexIndicator;
