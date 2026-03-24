import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

const HotspotsIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_HOTSPOTS">
      <svg className={className} viewBox="0 0 11 11" fill="none">
        <path
          d="M0.400024 5.3999H1.90002M1.90002 5.3999C1.90002 7.3329 3.46703 8.8999 5.40002 8.8999M1.90002 5.3999C1.90002 3.46691 3.46703 1.8999 5.40002 1.8999M8.90002 5.3999H10.4M8.90002 5.3999C8.90002 7.3329 7.33302 8.8999 5.40002 8.8999M8.90002 5.3999C8.90002 3.46691 7.33302 1.8999 5.40002 1.8999M5.40002 0.399902V1.8999M5.40002 8.8999V10.3999M6.90002 5.3999C6.90002 6.22833 6.22845 6.8999 5.40002 6.8999C4.5716 6.8999 3.90002 6.22833 3.90002 5.3999C3.90002 4.57148 4.5716 3.8999 5.40002 3.8999C6.22845 3.8999 6.90002 4.57148 6.90002 5.3999Z"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default HotspotsIcon;
