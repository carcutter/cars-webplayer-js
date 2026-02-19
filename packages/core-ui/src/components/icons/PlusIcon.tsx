import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const PlusIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_PLUS">
      <svg className={className} viewBox="0 0 13 13" fill="none">
        <path
          d="M0.520874 6.35409H12.1875M6.35421 0.520752V12.1874"
          stroke="currentColor"
          strokeWidth="1.04167"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default PlusIcon;
