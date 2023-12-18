import { Button, Card, CardActionArea, CardActions, CardContent, Rating, Typography } from "@mui/material"
import ClinicInfoHeader from "./ClinicInfoHeader"

function SearchResultCard({ clinic, onClick }) {
  return (
    <Card variant="outlined" sx={{ width: 'inherit', m: 1 }}>
      <CardActionArea onClick={(onClick)}>
        <CardContent sx={{ pb: 1 }}>
          <ClinicInfoHeader clinic={clinic} />
          {
            clinic.earliestAppointment &&
            <Typography variant="body1" color="success.light">
              {`Available from ${new Date(clinic.earliestAppointment).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' })}`}
            </Typography>
          }

          {
            !clinic.earliestAppointment &&
            <Typography variant="body1" color="error">
              No available times
            </Typography>
          }
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
