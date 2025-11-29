import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ui/ScrollToTop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import LiveStreamView from "./components/live/userView";
import { useLiveStreamStore } from "./store/LiveStreamStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, 
    },
  },
});

export default function App(){
  const { isStreamActive, platform, videoId, embedUrl, streamTitle, description } = useLiveStreamStore();

  return(
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
     <AppRoutes/>
     {/* Global Live Stream Overlay */}
     {isStreamActive && videoId && (
       <LiveStreamView 
         platform={platform}
         videoId={videoId}
         embedUrl={embedUrl}
         streamTitle={streamTitle}
         description={description}
         isLive={true}
         allowMinimize={true}
       />
     )}
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}