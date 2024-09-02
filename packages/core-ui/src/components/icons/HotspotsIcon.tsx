import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const HotspotsIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_HOTSPOTS">
      <svg
        className={className}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_418_982)">
          <path
            d="M6 4C4.895 4 4 4.895 4 6C4 7.105 4.895 8 6 8C7.105 8 8 7.105 8 6C8 4.895 7.105 4 6 4ZM10.47 5.5C10.24 3.415 8.585 1.76 6.5 1.53V0.5H5.5V1.53C3.415 1.76 1.76 3.415 1.53 5.5H0.5V6.5H1.53C1.76 8.585 3.415 10.24 5.5 10.47V11.5H6.5V10.47C8.585 10.24 10.24 8.585 10.47 6.5H11.5V5.5H10.47ZM6 9.5C4.065 9.5 2.5 7.935 2.5 6C2.5 4.065 4.065 2.5 6 2.5C7.935 2.5 9.5 4.065 9.5 6C9.5 7.935 7.935 9.5 6 9.5Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_418_982">
            <rect width="12" height="12" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </CustomizableIcon>
  );
};

export default HotspotsIcon;
