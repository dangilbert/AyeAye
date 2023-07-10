import React from "react";
import PropTypes from "prop-types";
import ReactTimeAgo from "react-time-ago";
// import { timezoneOffset } from "./time/timeSetup";
import { Text } from "react-native-paper";

export default function TimeAgo(props) {
  // TODO fix the timezone offset
  return (
    <ReactTimeAgo
      {...props}
      component={Time}
      // timeOffset={timezoneOffset}
      timeStyle={"twitter"}
      updateInterval={1000 * 60}
    />
  );
}

function Time({ children }) {
  return <Text variant="labelSmall">{children}</Text>;
}

Time.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  verboseDate: PropTypes.string,
  tooltip: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired,
};
