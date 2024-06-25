type Props = { currentIndex: number; length: number };

const IndexIndicator: React.FC<Props> = ({ currentIndex, length }) => {
  return (
    <div className="px-2 py-1 text-sm bg-foreground/40 text-background/75 rounded-full">
      {currentIndex + 1} / {length}
    </div>
  );
};

export default IndexIndicator;
