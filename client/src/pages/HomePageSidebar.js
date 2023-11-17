import React from "react";
import { API_URL } from "../apiConfig";

const HomePageSidebar = ({ posts }) => {
  return (
    <div className="sidebar"> 
        <h3 className="text-center">Popular Articles</h3>
        <div className="sidebarWrapper">
            <div className="sidebarImgWrapper">
            <img
                src={`${API_URL}/${posts[0]?.postImg}`}
                alt="Featured Post"
                className="sidebarImg"
            />
            </div>
            <p className="fw-bold">{posts[0]?.postTitle}</p>
            <p>{posts[0]?.postSummary}</p>
            {/* <p>{format(new Date(posts[0]?.createdAt), "M/dd/yy h:mm a")}</p> */}
        </div>
    </div>
  );
};

export default HomePageSidebar;
