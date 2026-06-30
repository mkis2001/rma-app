import { JwtPayload } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../../services/Supabase";

export const useAuth = () => {
  const [claims, setClaims] = useState<JwtPayload | null>(null);
  useEffect(() => {
    supabase.auth.getClaims().then(({ data }) => {
      setClaims(data?.claims || null);
    });
    supabase.auth.onAuthStateChange(() => {
      supabase.auth.getClaims().then(({ data }) => {
        setClaims(data?.claims || null);
      });
    });
  }, []);

  return { claims };
};
