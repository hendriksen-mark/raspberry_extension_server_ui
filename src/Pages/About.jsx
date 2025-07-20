import React, { useEffect, useState } from "react";

import axios from "axios";
import { FaGithub, FaTwitter, FaGlobeEurope, FaSlack, FaDiscourse } from "react-icons/fa";
import { GoLightBulb } from "react-icons/go";
import { SiReadthedocs } from "react-icons/si";
import { Tooltip } from "@mui/material";

import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import kofi from "../static/images/kofi.svg";
import CardGrid from "../components/CardGrid/CardGrid";

function About() {
  const [contributors, setContributors] = useState([]);

// #region HTML
  return (
    <div className="inner">
      <CardGrid options="main">
        <GlassContainer>
          <PageContent>
            <div className="headline">About</div>
            <div className="supportsection">
              <p>Usefull liks:</p>
              <Tooltip
                title={<p style={{ fontSize: "18px" }}>{"Read the docs"}</p>}
                arrow
              >
                <a href="https://diyhue.readthedocs.io/en/latest/">
                  <SiReadthedocs />
                </a>
              </Tooltip>
              <Tooltip
                title={<p style={{ fontSize: "18px" }}>{"Main page"}</p>}
                arrow
              >
                <a href="https://diyhue.org/">
                  <GoLightBulb />
                </a>
              </Tooltip>
            </div>
            <div className="supportsection">
              <p>Support:</p>
              <Tooltip
                title={<p style={{ fontSize: "18px" }}>{"Github"}</p>}
                arrow
              >
                <a href="https://github.com/diyhue/diyhue">
                  <FaGithub />
                </a>
              </Tooltip>
              <Tooltip
                title={<p style={{ fontSize: "18px" }}>{"Slack"}</p>}
                arrow
              >
                <a href="https://diyhue.slack.com/">
                  <FaSlack />
                </a>
              </Tooltip>
              <Tooltip
                title={<p style={{ fontSize: "18px" }}>{"Discourse"}</p>}
                arrow
              >
                <a href="https://diyhue.discourse.group/">
                  <FaDiscourse />
                </a>
              </Tooltip>
            </div>
            <div className="supportsection">
              <p>License:</p>
              <a href="https://github.com/diyhue/diyHue?tab=License-1-ov-file#License-1-ov-file">
                License on Github
              </a>
            </div>
          </PageContent>
        </GlassContainer>

        <div className="creditGrid">
          <div className="contactCard">
            <div className="name">Mark</div>
            <div className="position">Maintainer & Support</div>
            <div className="about">
              Maintaining the Github repository, Add api features, Fix bugs, Slack
              & Github support.
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
