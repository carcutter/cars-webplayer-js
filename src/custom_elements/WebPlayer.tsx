import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import GlobalContextProvider from "@/providers/GlobalContext";
import { WebPlayerProps } from "@/types/props";

import WebPlayerContainer from "./WebPlayerContainer";

const queryClient = new QueryClient();

const WebPlayer: React.FC<React.PropsWithChildren<WebPlayerProps>> = ({
  aspectRatio = "4:3",
  flatten = false,
  maxItemsShown = 1,

  children,
}) => {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider
        {...{
          aspectRatio,
          flatten,
          maxItemsShown,
        }}
      >
        <div className="relative size-full overflow-hidden">
          <WebPlayerContainer>{children}</WebPlayerContainer>
        </div>
      </GlobalContextProvider>
    </QueryClientProvider>
  );
};

// TODO: Add HOC with zod validation
export default WebPlayer;
