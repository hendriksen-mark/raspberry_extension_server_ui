import { Outlet, Route, Routes, HashRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import routes from "../routes";

import "./contentSection.scss";

const ContentSection = ({ HOST_IP, API_KEY, CONFIG }) => {

  return (
    <div className="content">
      <Toaster position="top-right" />
        <HashRouter>
          <Routes>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    element={
                      <route.component API_KEY={API_KEY} HOST_IP={HOST_IP} CONFIG={CONFIG} />
                    }
                  />
                )
              );
            })}
            <Route path="/" element={<Outlet />} />
          </Routes>
        </HashRouter>
    </div>
  );
};

export default ContentSection;
