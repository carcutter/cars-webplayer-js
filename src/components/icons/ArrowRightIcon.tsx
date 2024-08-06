import CustomizableIcon from "@/components/atoms/CustomizableIcon";

type Props = { className?: string };

const ArrowRightIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="ARROW_RIGHT">
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <path
          d="M4.07666 13.4868L5.25666 14.6668L11.9233 8.00016L5.25666 1.3335L4.07666 2.5135L9.56333 8.00016L4.07666 13.4868Z"
          fill="currentColor"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default ArrowRightIcon;
