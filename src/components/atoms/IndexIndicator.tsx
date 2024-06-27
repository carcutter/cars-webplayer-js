type Props = { currentIndex: number; length: number };

const IndexIndicator: React.FC<Props> = ({ currentIndex, length }) => {
  return (
    <div className="rounded-full bg-foreground/40 px-2 py-1 text-sm text-background/75">
      {currentIndex + 1} / {length}
    </div>
  );
};

export default IndexIndicator;
