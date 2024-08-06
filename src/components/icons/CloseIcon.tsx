import CustomizableIcon from "@/components/atoms/CustomizableIcon";

type Props = { className?: string };

const CloseIcon: React.FC<Props> = ({ className = "" }) => {
  return (
    <CustomizableIcon customizationKey="CONTROLS_CLOSE">
      <svg className={className} viewBox="0 -960 960 960">
        <path d="M480-438 270-228q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522-480l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480-438Z" />
      </svg>
    </CustomizableIcon>
  );
};

export default CloseIcon;
