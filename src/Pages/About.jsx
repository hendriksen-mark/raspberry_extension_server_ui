import { FaGithub} from "react-icons/fa";
import { Tooltip } from "@mui/material";

import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import CardGrid from "../components/CardGrid/CardGrid";

function About() {

// #region HTML
  return (
    <div className="inner">
      <CardGrid options="main">
        <GlassContainer>
          <PageContent>
            <div className="headline">About</div>
            <div className="supportsection">
              <p>Support:</p>
              <Tooltip
                title={<p style={{ fontSize: "18px" }}>{"Github"}</p>}
                arrow
              >
                <a href="https://github.com/hendriksen-mark/raspberry_extension_server">
                  <FaGithub />
                </a>
              </Tooltip>
            </div>
          </PageContent>
        </GlassContainer>

        <div className="creditGrid">
          <div className="contactCard">
            <div className="name">Mark</div>
            <div className="position">Maintainer & Support</div>
            <div className="about">
              Maintaining the Github repository, Add api features, Fix bugs, Github support.
            </div>
            <div className="iconbox">
              <a href="https://github.com/hendriksen-mark">
                <FaGithub />
              </a>
            </div>
          </div>
        </div>
      </CardGrid>
    </div>
  );
}

export default About;
