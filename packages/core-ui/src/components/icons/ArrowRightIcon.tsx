import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const ArrowRightIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_ARROW_RIGHT">
      <svg className={className} viewBox="0 0 20 20" fill="none">
        <path
          d="M7.5 15L12.5 10L7.5 5"
          stroke="currentColor"
          strokeWidth="1.04167"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default ArrowRightIcon;
