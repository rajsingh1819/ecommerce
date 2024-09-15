import React from "react";
import "./styles/subtitle.css";

function Subtitle(props) {
  const subtitle = props.subtitle;
  return <h3 className="section_subtitle">{subtitle}</h3>;
}

export default Subtitle;
