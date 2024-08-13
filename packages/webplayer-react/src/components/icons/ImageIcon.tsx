import CustomizableIcon from "@/components/atoms/CustomizableIcon";

type Props = { className?: string };

const ImageIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_IMAGE">
      <svg className={className} viewBox="0 0 12 12" fill="none">
        <path
          d="M9.5 2.5V9.5H2.5V2.5H9.5ZM9.5 1.5H2.5C1.95 1.5 1.5 1.95 1.5 2.5V9.5C1.5 10.05 1.95 10.5 2.5 10.5H9.5C10.05 10.5 10.5 10.05 10.5 9.5V2.5C10.5 1.95 10.05 1.5 9.5 1.5ZM7.07 5.93L5.57 7.865L4.5 6.57L3 8.5H9L7.07 5.93Z"
          fill="currentColor"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default ImageIcon;
