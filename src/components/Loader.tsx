import React from "react";
import '../styles/Loader.css';

const Loader = (): React.ReactElement => {
    return (
        <div className="loaderBody">
            <span className="loader"></span>
        </div>
    );
};

export default Loader;
