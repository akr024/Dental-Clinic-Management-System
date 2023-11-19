import { Button, Card, CardActionArea, CardActions, CardContent, Rating, Typography } from "@mui/material"

function SearchResultCard({ data }) {
  const firstAvailableTime = data.appointments
    .filter(e => e.available)
    .map(e => new Date(e.time))
    .reduce((a, b) => a < b ? a : b)

  return (
    <Card variant="outlined" sx={{ width: 'inherit', m: 1 }}>
      <CardActionArea>
        <CardContent sx={{ pb: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {data.clinicName}
          </Typography>

          <Rating value={data.rating} precision={0.5} readOnly size="small" sx={{ mb: 1, display: 'flex' }} />

          <Typography element="p" variant="body3" color="text.secondary">
            {data.address}
          </Typography>

          <Typography variant="body1" color="success.light">
            {`Available from ${firstAvailableTime.toLocaleString('default', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' })}`}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          View Appointments
        </Button>
      </CardActions>
    </Card>
  )
}

export default SearchResultCard
