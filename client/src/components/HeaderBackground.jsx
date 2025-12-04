import React from "react";
import PropTypes from "prop-types";

function HeaderBackground({ theme }) {
  return (
    <div
      className={theme === "light" ? "light-background" : "dark-background"}
    ></div>
  );
}

HeaderBackground.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default HeaderBackground;
