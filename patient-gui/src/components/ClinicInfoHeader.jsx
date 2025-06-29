import { Rating, Typography } from "@mui/material"

function ClinicInfoHeader({ clinic }) {
  return (
    <>
      <Typography gutterBottom variant="h5" component="div" sx={{pr: 1}}>
        {clinic.name}
      </Typography>

      <Rating value={clinic.rating} precision={0.5} readOnly size="small" sx={{ mb: 1, display: 'flex' }} />

      <Typography element="p" variant="body2" color="text.secondary">
        {clinic.address}
      </Typography>
    </>
  )
}

export default ClinicInfoHeader
