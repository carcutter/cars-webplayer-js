import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const MinusIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_MINUS">
      <svg
        className={className}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.6666 8.66634H3.33325V7.33301H12.6666V8.66634Z"
          fill="currentColor"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default MinusIcon;
