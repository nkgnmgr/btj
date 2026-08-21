import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CountryPage from "@/pages/CountryPage";
import AdminPage from "@/pages/AdminPage";
import EditorPage from "@/pages/EditorPage";
import PayPalButton from "@/components/PayPalButton";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/country/:code" component={CountryPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/edit/:id" component={EditorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <PayPalButton />
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
