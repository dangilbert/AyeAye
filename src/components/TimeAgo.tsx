import React from "react";
import PropTypes from "prop-types";
import ReactTimeAgo from "react-time-ago";
import { ThemedText } from "./ThemedText";

export default function TimeAgo(props) {
  return <ReactTimeAgo {...props} component={Time} />;
}

function Time({ children }) {
  return <ThemedText variant="label">{children}</ThemedText>;
}

Time.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  verboseDate: PropTypes.string,
  tooltip: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired,
};
