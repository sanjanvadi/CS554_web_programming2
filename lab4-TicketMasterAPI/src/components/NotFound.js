import React from "react";
import { useHistory } from "react-router-dom";

const NotFound = (props)=>{
    const history = useHistory();
    return(
        <div>
            <p className="venueTitle">Error : 404</p>
            <p className="caption">Not Found</p>
            <button className="showLink" onClick={history.goBack}>Back</button>
        </div>
    )
}

export default NotFound;