import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const MinusIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_MINUS">
      <svg className={className} viewBox="0 0 13 2" fill="none">
        <path
          d="M0.520874 0.520752H12.1875"
          stroke="currentColor"
          strokeWidth="1.04167"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default MinusIcon;
