type Props = {
  //
};

const HotspotIcon: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <div className="flex size-6 items-center justify-center rounded-full bg-primary text-background">
      {children}
    </div>
  );
};

export default HotspotIcon;
