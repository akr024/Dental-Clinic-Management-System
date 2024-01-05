import * as React from 'react';
import {
    Rating, ListItem, Divider, ListItemText, ListItemAvatar,Avatar, Typography} from "@mui/material"

export default function reviewComponent ({ review }) {
    return (
      <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="avatar" src="../../avatar.png" />
        </ListItemAvatar>
        <ListItemText primaryTypographyProps={{ style: {width: "100px", overflow: "hidden"}}}
          primary= {review.reviewMsg}
          secondary={
            <React.Fragment>
                  <Typography
                sx={{ display: 'inline' }}
                component="span"
                    variant="body2"
                      color="text.primary">
                      {review.dateTime}</Typography>
                  <Rating value={review.rating} precision={0.5} readOnly size="small" sx={{ mb: 1, display: 'flex' }} />
            </React.Fragment>
          }
        />
      </ListItem>
            <Divider variant="inset" component="li" />  
            </>
  );
}