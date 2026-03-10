import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const ImageIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_IMAGE">
      <svg className={className} viewBox="0 0 14 14" fill="none">
        <path
          d="M12.25 8.74997L10.4498 6.9498C10.2311 6.73108 9.93436 6.60822 9.625 6.60822C9.31564 6.60822 9.01895 6.73108 8.80017 6.9498L3.5 12.25M2.91667 1.75H11.0833C11.7277 1.75 12.25 2.27233 12.25 2.91667V11.0833C12.25 11.7277 11.7277 12.25 11.0833 12.25H2.91667C2.27233 12.25 1.75 11.7277 1.75 11.0833V2.91667C1.75 2.27233 2.27233 1.75 2.91667 1.75ZM6.41667 5.25C6.41667 5.89433 5.89433 6.41667 5.25 6.41667C4.60567 6.41667 4.08333 5.89433 4.08333 5.25C4.08333 4.60567 4.60567 4.08333 5.25 4.08333C5.89433 4.08333 6.41667 4.60567 6.41667 5.25Z"
          stroke="currentColor"
          strokeWidth="0.729167"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default ImageIcon;
