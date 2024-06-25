import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WebPlayerContainer from "./WebPlayerContainer";
import GlobalContextProvider from "@/providers/GlobalContext";

const queryClient = new QueryClient();

type WebPlayerProps = { aspectRatio?: "4:3" | "16:9" };

const WebPlayer: React.FC<React.PropsWithChildren<WebPlayerProps>> = ({
  aspectRatio,
  children,
}) => {
  const aspectRatioClass =
    aspectRatio === "16:9" ? "aspect-[16/9]" : "aspect-[4/3]";

  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider aspectRatioClass={aspectRatioClass}>
        <div
          className={`relative size-full overflow-hidden ${aspectRatioClass}`}
        >
          <WebPlayerContainer>{children}</WebPlayerContainer>
        </div>
      </GlobalContextProvider>
    </QueryClientProvider>
  );
};

export default WebPlayer;
