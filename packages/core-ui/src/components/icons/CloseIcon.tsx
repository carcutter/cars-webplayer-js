import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const CloseIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_CLOSE">
      <svg className={className} viewBox="0 0 12 12" fill="none">
        <path
          d="M10.5209 0.520752L0.520874 10.5208M0.520874 0.520752L10.5209 10.5208"
          stroke="currentColor"
          strokeWidth="1.04167"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default CloseIcon;
