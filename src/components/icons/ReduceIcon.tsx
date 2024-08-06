type Props = { className?: string };

const ReduceIcon: React.FC<Props> = ({ className = "" }) => {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path
        d="M3.33325 10.6668H5.33325V12.6668H6.66659V9.3335H3.33325V10.6668ZM5.33325 5.3335H3.33325V6.66683H6.66659V3.3335H5.33325V5.3335ZM9.33325 12.6668H10.6666V10.6668H12.6666V9.3335H9.33325V12.6668ZM10.6666 5.3335V3.3335H9.33325V6.66683H12.6666V5.3335H10.6666Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ReduceIcon;
