type Props = {
  //
};

const HotspotIcon: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <div className="size-6 flex justify-center items-center bg-primary text-background rounded-full">
      {children}
    </div>
  );
};

export default HotspotIcon;
