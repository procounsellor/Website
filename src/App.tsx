import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ui/ScrollToTop";
import NoInternet from "./components/common/NoInternet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,  // prevents re-fetch flash when switching tabs
      retry: 1,                     // one retry on failure (not 3)
      staleTime: 60_000,            // 1-min default stale time
    },
  },
});

export default function App(){
  return(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <NoInternet />
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes/>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  )
}