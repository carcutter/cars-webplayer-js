type Props = { className?: string };

const ThreeSixtyIcon: React.FC<Props> = ({ className = "" }) => {
  return (
    <img
      className={`size-full ${className}`}
      src="https://cdn.car-cutter.com/libs/web-player/v3/assets/icons/ui/360.svg"
      alt="360"
    />
  );
};

export default ThreeSixtyIcon;
