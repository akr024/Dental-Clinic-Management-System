import { Rating, Typography } from "@mui/material"

function ClinicInfoHeader({ data }) {
  return (
    <>
      <Typography gutterBottom variant="h5" component="div">
        {data.clinicName}
      </Typography>

      <Rating value={data.rating} precision={0.5} readOnly size="small" sx={{ mb: 1, display: 'flex' }} />

      <Typography element="p" variant="body2" color="text.secondary">
        {data.address}
      </Typography>
    </>
  )
}

export default ClinicInfoHeader
