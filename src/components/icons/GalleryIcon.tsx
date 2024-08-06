import CustomizableIcon from "@/components/atoms/CustomizableIcon";

type Props = { className?: string };

const GalleryIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="GALLERY">
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <path
          d="M13.3334 2.66683V10.6668H5.33337V2.66683H13.3334ZM13.3334 1.3335H5.33337C4.60004 1.3335 4.00004 1.9335 4.00004 2.66683V10.6668C4.00004 11.4002 4.60004 12.0002 5.33337 12.0002H13.3334C14.0667 12.0002 14.6667 11.4002 14.6667 10.6668V2.66683C14.6667 1.9335 14.0667 1.3335 13.3334 1.3335ZM7.66671 7.78016L8.79337 9.28683L10.4467 7.22016L12.6667 10.0002H6.00004L7.66671 7.78016ZM1.33337 4.00016V13.3335C1.33337 14.0668 1.93337 14.6668 2.66671 14.6668H12V13.3335H2.66671V4.00016H1.33337Z"
          fill="currentColor"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default GalleryIcon;
