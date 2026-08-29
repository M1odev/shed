import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Auth from "./pages/auth";
import Home from "./pages/home";
import Onboarding from "./pages/onboarding";
import Manual from "./pages/manual_session";
import SessionDetails from "./pages/session_details";
import PreviousSessions from "./pages/previous_sessions";
import Live from "./pages/live_session";

function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        console.log("user: ", user);
        console.log("error: ", error);
        if (location.pathname !== "/") {
          setDestination("/");
          setLoading(false);
          return;
        } else {
          setLoading(false);
          return;
        }
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      profileError && console.log(profileError);

      const onboarding_completed = profile?.onboarding_completed;

      if (!onboarding_completed && location.pathname !== "/onboarding") {
        setDestination("/onboarding");
        setLoading(false);
        return;
      }

      if (onboarding_completed && location.pathname === "/onboarding") {
        setDestination("/home");
        setLoading(false);
        return;
      }

      if (onboarding_completed && location.pathname === "/") {
        setDestination("/home");
        setLoading(false);
        return;
      }

      setDestination(null);
      setLoading(false);
    }

    checkUser();
  }, [location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (destination) {
    console.log("Manual Route to ", destination);
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/manual_session" element={<Manual />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/sessions/:sessionId" element={<SessionDetails />} />
        <Route path="/previous_sessions" element={<PreviousSessions />} />
        <Route path="/live_session" element={<Live />} />
      </Route>
    </Routes>
  );
}
