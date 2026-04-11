import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ui/ScrollToTop";
import NoInternet from "./components/common/NoInternet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, 
    },
  },
});

export default function App(){
  return(
    <QueryClientProvider client={queryClient}>
      <NoInternet />
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes/>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}