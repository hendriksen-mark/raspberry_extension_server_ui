import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Layout from "./Mainframe/Layout";

const App = () => {

  const HOST_IP = ""; // Pass the IP (http://x.x.x.x) of the diyHue Bridge, if running through npm start

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Layout HOST_IP={HOST_IP} />
    </LocalizationProvider>
  );
};

export default App;
