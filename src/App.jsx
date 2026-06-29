import Layout from "./Mainframe/Layout";

const App = () => {

  const HOST_IP = ""; // Pass the IP (http://x.x.x.x) of the diyHue Bridge, if running through npm start

  return (
    <Layout HOST_IP={HOST_IP} />
  );
};

export default App;
