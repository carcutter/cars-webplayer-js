import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const PauseIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_PAUSE">
      <svg
        className={className}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 12.6667H6.66667V3.33333H4V12.6667ZM9.33333 3.33333V12.6667H12V3.33333H9.33333Z"
          fill="currentColor"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default PauseIcon;
