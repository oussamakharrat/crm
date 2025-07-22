import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const LogoContext = createContext();
const backendUrl = "http://localhost:5000";

export const LogoProvider = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState("");
  const [appName, setAppNameState] = useState("");

  // Fetch logo and app name on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/settings");
        const data = res.data;
        const logoSetting = data.find(s => s.key === "logo");
        if (logoSetting && logoSetting.value) {
          const url = logoSetting.value.startsWith("http")
            ? logoSetting.value
            : backendUrl + logoSetting.value;
          setLogoUrl(url);
        } else {
          setLogoUrl("");
        }
        const appNameSetting = data.find(s => s.key === "app_name");
        if (appNameSetting && appNameSetting.value) {
          setAppNameState(appNameSetting.value);
        } else {
          setAppNameState("");
        }
      } catch {
        setLogoUrl("");
        setAppNameState("");
      }
    };
    fetchSettings();
  }, []);

  // Wrap setLogoUrl to always use full backend URL
  const setLogoUrlWithBackend = (value) => {
    const url = value && !value.startsWith("http") ? backendUrl + value : value;
    setLogoUrl(url);
  };

  // Update app name in state and backend
  const setAppName = async (newName, token) => {
    setAppNameState(newName);
    try {
      await axios.post(
        "http://localhost:5000/settings/app-name",
        { app_name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {
      // Optionally handle error
    }
  };

  return (
    <LogoContext.Provider value={{ logoUrl, setLogoUrl: setLogoUrlWithBackend, appName, setAppName }}>
      {children}
    </LogoContext.Provider>
  );
};

export const useLogoContext = () => useContext(LogoContext); 