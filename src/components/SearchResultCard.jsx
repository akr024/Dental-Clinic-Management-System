import { Button, Card, CardActionArea, CardActions, CardContent, Rating, Typography } from "@mui/material"
import ClinicInfoHeader from "./ClinicInfoHeader"

function SearchResultCard({ data, onClick }) {
  const firstAvailableTime = data.appointments
    .filter(e => e.available)
    .map(e => new Date(e.time))
    .reduce((a, b) => a < b ? a : b)

  return (
    <Card variant="outlined" sx={{ width: 'inherit', m: 1 }}>
      <CardActionArea onClick={(onClick)}>
        <CardContent sx={{ pb: 1 }}>
          <ClinicInfoHeader data={data} />

          <Typography variant="body1" color="success.light">
            {`Available from ${firstAvailableTime.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' })}`}
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
