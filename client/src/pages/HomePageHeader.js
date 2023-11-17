import React from "react";
import { format } from "date-fns";
import { API_URL } from "../apiConfig";

const HomePageHeader = ({ posts }) => {
  return (
    <header> 
      <h2 className="pb-3">Featured Content</h2>
      <div className="headerContainer">
        <div className="headerImgWrapper">
          <img
            src={`${API_URL}/${posts[0]?.postImg}`}
            alt="Featured Post"
            className="headerImg"
          />
        </div>
        <div className="headerText">
          <p className="fw-bold">{posts[0]?.postTitle}</p>
          <p>{posts[0]?.postSummary}</p>
          {/* <p>{format(new Date(posts[0]?.createdAt), "M/dd/yy h:mm a")}</p> */}
        </div>
      </div>
    </header>
  );
};

export default HomePageHeader;
