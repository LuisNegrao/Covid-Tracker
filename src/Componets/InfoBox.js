import React from "react";
import "./InfoBox.css";
import { CardContent, Typography, Card } from "@material-ui/core";

function InfoBox({ isRed,active,title, cases, total, ...props }) {
  return (
    <div className="infoBox">
      <Card
        onClick={props.onClick}
        className= {`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--isRed"}`}
      >
        <CardContent>
          <Typography className="infoBox__title" color="textSecondary">
            {title}
          </Typography>
          <h2 className="infoBox__cases">{cases}</h2>
          <Typography className="infoBox__total" color="textSecondary">
            {total} Total
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default InfoBox;
