import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const ExtendIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_EXTEND">
      <svg className={className} viewBox="0 0 20 20" fill="none">
        <path
          d="M2.5 5.83333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H5.83333M14.1667 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V5.83333M17.5 14.1667V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H14.1667M5.83333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V14.1667M6.66667 6.66667H13.3333C13.7936 6.66667 14.1667 7.03976 14.1667 7.5V12.5C14.1667 12.9602 13.7936 13.3333 13.3333 13.3333H6.66667C6.20643 13.3333 5.83333 12.9602 5.83333 12.5V7.5C5.83333 7.03976 6.20643 6.66667 6.66667 6.66667Z"
          stroke="currentColor"
          strokeWidth="1.04167"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default ExtendIcon;
