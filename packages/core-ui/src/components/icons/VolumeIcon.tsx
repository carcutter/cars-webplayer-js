import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const VolumeIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_VOLUME">
      <svg
        className={className}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 6V10H4.66667L8 13.3333V2.66667L4.66667 6H2ZM11 8C11 6.82 10.32 5.80667 9.33333 5.31334V10.68C10.32 10.1933 11 9.18 11 8ZM9.33333 2.15334V3.52667C11.26 4.1 12.6667 5.88667 12.6667 8C12.6667 10.1133 11.26 11.9 9.33333 12.4733V13.8467C12.0067 13.24 14 10.8533 14 8C14 5.14667 12.0067 2.76 9.33333 2.15334Z"
          fill="currentColor"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default VolumeIcon;
