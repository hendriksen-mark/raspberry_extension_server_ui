import React from "react";


const Thermostats = React.lazy(() => import("./Pages/Thermostat"));
const DHT = React.lazy(() => import("./Pages/DHT"));
const Klok = React.lazy(() => import("./Pages/Klok"));
//const Fan = React.lazy(() => import("./Pages/Fan"));
//const PowerButton = React.lazy(() => import("./Pages/PowerButton"));
const About = React.lazy(() => import("./Pages/About"));
const Settings = React.lazy(() => import("./Pages/Settings"));
const Account = React.lazy(() => import("./Pages/Account"));
const Debug = React.lazy(() => import("./Pages/Debug"));
const LogViewer = React.lazy(() => import("./Pages/LogViewer"));

const routes = [
  { path: "/", exact: true, name: "Thermostat", component: Thermostats },
  { path: "/thermostat", exact: true, name: "Thermostat", component: Thermostats },
  { path: "/DHT", exact: true, name: "DHT", component: DHT },
  { path: "/klok", exact: true, name: "Klok", component: Klok },
  //{ path: "/fan", exact: true, name: "Fan", component: Fan },
  //{ path: "/powerbutton", exact: true, name: "PowerButton", component: PowerButton },
  { path: "/about", exact: true, name: "About", component: About },
  { path: "/settings", exact: true, name: "Settings", component: Settings },
  { path: "/account", exact: true, name: "Account", component: Account },
  { path: "/debug", exact: true, name: "Debug", component: Debug },
  { path: "/logviewer", exact: true, name: "Log Viewer", component: LogViewer }
];

export default routes;
