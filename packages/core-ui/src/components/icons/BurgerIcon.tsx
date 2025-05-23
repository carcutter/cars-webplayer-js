import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const BurgerIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_BURGER">
      <svg
        className={className}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 12H14V10.6667H2V12ZM2 8.66667H14V7.33333H2V8.66667ZM2 4V5.33333H14V4H2Z"
          fill="currentColor"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default BurgerIcon;
