import CustomizableIcon from "../atoms/CustomizableIcon";

type Props = { className?: string };

// The glyph is designed against the whole hotspot circle (24px outer diameter
// centered in a 28px canvas), but Hotspot renders icons in a box 57% of the
// circle. The viewBox crops to that box and overflow stays visible so the
// mountain line still reaches the circle border as in the design.
const HotspotImageIcon: React.FC<Props> = ({ className }) => {
  return (
    <CustomizableIcon className={className} customizationKey="UI_IMAGE">
      <svg
        className={className}
        viewBox="7.16 7.16 13.68 13.68"
        fill="none"
        style={{ overflow: "visible" }}
      >
        <path
          d="M23.5 17L19.1197 12.6557C18.7697 12.3113 18.295 12.1179 17.8 12.1179C17.305 12.1179 16.8303 12.3113 16.4803 12.6557L7.5 21.5M12.6667 9.83674C12.6667 10.8511 11.8309 11.6735 10.8 11.6735C9.76907 11.6735 8.93333 10.8511 8.93333 9.83674C8.93333 8.82234 9.76907 8 10.8 8C11.8309 8 12.6667 8.82234 12.6667 9.83674Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CustomizableIcon>
  );
};

export default HotspotImageIcon;
