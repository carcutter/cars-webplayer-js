import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const PlusIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_PLUS">
      <svg
        className={className}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.6666 8.66634H8.66659V12.6663H7.33325V8.66634H3.33325V7.33301H7.33325V3.33301H8.66659V7.33301H12.6666V8.66634Z"
          fill="currentColor"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default PlusIcon;
