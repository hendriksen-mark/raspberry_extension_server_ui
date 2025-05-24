import React, { useState, useEffect, useRef } from "react";
import CardGrid from "../components/CardGrid/CardGrid";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import GenericButton from "../components/GenericButton/GenericButton";

const LogViewer = ({ HOST_IP }) => {
  const [log, setLog] = useState("");
  const [following, setFollowing] = useState(false);
  const wsRef = useRef(null);
  const logEndRef = useRef(null);

  useEffect(() => {
    if (following) {
      const ws = new window.WebSocket(`ws://${(HOST_IP).replace(/^https?:\/\//, "")}:9000/ws`);
      wsRef.current = ws;
      ws.onmessage = (event) => setLog((prev) => prev + event.data);
      ws.onerror = () => setLog((prev) => prev + "\n[WebSocket error]");
      ws.onclose = () => setLog((prev) => prev + "\n[WebSocket closed]");
      return () => ws.close();
    }
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [following, HOST_IP]);
  if (following && HOST_IP) {

  // Auto-scroll to bottom when log updates
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [log]);

  return (
    <div className="inner">
      <CardGrid options="main">
        <GlassContainer>
          <PageContent>
            <div className="headline">Backend Log Viewer (Live)</div>
            <GenericButton
              value={following ? "Stop Following" : "Follow Log"}
              color={following ? "red" : "blue"}
              onClick={() => setFollowing((f) => !f)}
            />
            <pre
              style={{
                background: "#222",
                color: "#eee",
                padding: 10,
                marginTop: 10,
                maxHeight: 600,
                overflow: "auto",
                maxWidth: 900,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {log}
              <span ref={logEndRef} />
            </pre>
          </PageContent>
        </GlassContainer>
      </CardGrid>
    </div>
  );
};

export default LogViewer;