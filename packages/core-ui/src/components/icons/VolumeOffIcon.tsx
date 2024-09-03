import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const VolumeOffIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_VOLUME_OFF">
      <svg
        className={className}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 8C11 6.82 10.32 5.80667 9.33333 5.31333V6.78667L10.9667 8.42C10.9867 8.28667 11 8.14667 11 8ZM12.6667 8C12.6667 8.62667 12.5333 9.21333 12.3067 9.76L13.3133 10.7667C13.7533 9.94 14 9 14 8C14 5.14667 12.0067 2.76 9.33333 2.15333V3.52667C11.26 4.1 12.6667 5.88667 12.6667 8ZM2.84667 2L2 2.84667L5.15333 6H2V10H4.66667L8 13.3333V8.84667L10.8333 11.68C10.3867 12.0267 9.88667 12.3 9.33333 12.4667V13.84C10.2533 13.6333 11.0867 13.2067 11.7933 12.6333L13.1533 14L14 13.1533L2.84667 2ZM8 2.66667L6.60667 4.06L8 5.45333V2.66667Z"
          fill="currentColor"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default VolumeOffIcon;
