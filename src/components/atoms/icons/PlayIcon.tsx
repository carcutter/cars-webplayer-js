type Props = { className?: string };

const PlayIcon: React.FC<Props> = ({ className = "" }) => {
  return (
    <img
      className={`size-full ${className}`}
      src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/play.svg"
      alt="Play"
    />
  );
};

export default PlayIcon;
