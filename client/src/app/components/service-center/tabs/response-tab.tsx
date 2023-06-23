import React, { useState, useContext } from "react";
import { Button, Rating, Avatar, Typography } from "@mui/material";
import { UserContext } from "../../user/context/user-context";
import { ResponseListContext } from "../context/response-list-context";
import { getImageSrc } from "../../../helpers/image-helper";
import ResponseModal from "../../modals/response-modal";
import dayjs from "dayjs";

const ResponseTab = () => {
  const [ isResponseOpened, setIsResponseOpened ] = useState(false);

  const user = useContext(UserContext);
  const responseList = useContext(ResponseListContext);

  const handleCreateResponseClick = () => {
    setIsResponseOpened(!isResponseOpened);
  };

  return (
    <div className="tab-content">
      { user?.data?.role === "client" && <Button variant="contained" onClick={handleCreateResponseClick}>Залишити відгук</Button> }
      <div className="response-list">
        { responseList?.data?.responseList?.map(response => 
          <div className="response" key={response.id}>
            <Typography variant="body2" className="date">{ dayjs(response.date).format("DD.MM.YYYY") }</Typography>
            <div className="response-client">
              <Avatar src={getImageSrc(response.photo)} />
              <Typography variant="body1" fontWeight="bold">{ response.lastName } { response.firstName } { response.middleName }</Typography>
            </div>
            <Rating name="size-small" value={response.rating} readOnly className="rating" />
            <Typography variant="body1">{ response.text }</Typography>
          </div>
        ) }
      </div>
      { isResponseOpened && <ResponseModal isOpened={isResponseOpened} setIsOpened={setIsResponseOpened} /> }
    </div>
  ); 
};

export default ResponseTab;