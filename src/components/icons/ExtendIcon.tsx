type Props = { className?: string };

const ExtendIcon: React.FC<Props> = ({ className = "" }) => {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path
        d="M4.66683 9.3335H3.3335V12.6668H6.66683V11.3335H4.66683V9.3335ZM3.3335 6.66683H4.66683V4.66683H6.66683V3.3335H3.3335V6.66683ZM11.3335 11.3335H9.3335V12.6668H12.6668V9.3335H11.3335V11.3335ZM9.3335 3.3335V4.66683H11.3335V6.66683H12.6668V3.3335H9.3335Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ExtendIcon;
