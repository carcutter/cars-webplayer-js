import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const Interior360PlayIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon
      className={className}
      customizationKey="UI_INTERIOR_360_PLAY"
    >
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="6 3 20 12 6 21 6 3" />
      </svg>
    </CustomizableIcon>
  );
};

export default Interior360PlayIcon;
