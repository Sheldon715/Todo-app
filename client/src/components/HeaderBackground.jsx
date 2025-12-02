import React from "react";

function HeaderBackground({theme}) {
  return <div className={theme==="light" ? "light-background" : "dark-background"}></div>;
}

export default HeaderBackground;
