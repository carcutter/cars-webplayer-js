import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const GalleryIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_GALLERY">
      <svg className={className} viewBox="0 0 20 20" fill="none">
        <path
          d="M15 18.3334H3.33335C2.89133 18.3334 2.4674 18.1578 2.15484 17.8453C1.84228 17.5327 1.66669 17.1088 1.66669 16.6667V5.00008M18.3334 10.8334L17.2534 9.75345C16.8767 9.37688 16.3659 9.16532 15.8334 9.16532C15.3008 9.16532 14.79 9.37688 14.4134 9.75345L9.16669 15.0001M11.6667 6.66675C11.6667 7.58722 10.9205 8.33342 10 8.33342C9.07955 8.33342 8.33335 7.58722 8.33335 6.66675C8.33335 5.74627 9.07955 5.00008 10 5.00008C10.9205 5.00008 11.6667 5.74627 11.6667 6.66675ZM6.66669 1.66675H16.6667C17.5872 1.66675 18.3334 2.41294 18.3334 3.33341V13.3334C18.3334 14.2539 17.5872 15.0001 16.6667 15.0001H6.66669C5.74621 15.0001 5.00002 14.2539 5.00002 13.3334V3.33341C5.00002 2.41294 5.74621 1.66675 6.66669 1.66675Z"
          stroke="currentColor"
          strokeWidth="1.04167"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default GalleryIcon;
