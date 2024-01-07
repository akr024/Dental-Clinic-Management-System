import * as React from 'react';
import {
  Rating, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography
} from "@mui/material"
import Tooltip from '@mui/material/Tooltip';

import { format, formatDistance } from 'date-fns'


export default function reviewComponent({ review }) {
  const reviewDate = new Date(review.dateTime)
  const formattedDate = format(reviewDate, 'dd/MM/yyyy HH:mm')
  const formattedDateDistance = formatDistance(reviewDate, new Date(), { addSuffix: true })

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="avatar" src="../../avatar.png" />
        </ListItemAvatar>
        <ListItemText primaryTypographyProps={{ style: { width: "100px", overflow: "hidden" } }}
          primary={review.reviewMsg}
          secondary={
            <React.Fragment>
              <Tooltip title={formattedDate} placement="top">
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.secondary">
                  {formattedDateDistance}
                </Typography>
              </Tooltip>
              <Rating value={review.rating} precision={0.5} readOnly size="small" sx={{ mb: 1, display: 'flex' }} />
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}