import { Box, Typography } from '@mui/material'

import Button from '@mui/material/Button'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useState } from 'react'
import SearchResultCard from './SearchResultCard'

const style = {
  overflowY: 'auto',
  overflowX: 'hidden',
  maxWidth: { xs: '100%', md: '350px' },
  minWidth: { xs: '100%', md: '350px' },
  flex: { xs: '1 1 100%', md: 'inherit' },
}

const displayFormat = ['month', 'day', 'hours', 'minutes']

const slotPropsErrorState = {
  textField: {
    error: true,
    helperText: 'Field required'
  }
}

function SearchComponent({ onSearchClick, searchResultMockData }) {
  const [fromDateTime, setFromDateTime] = useState(null)
  const [toDateTime, setToDateTime] = useState(null)

  // Kinda hacky, some of these props, but there's no easy way to validate.
  // Gets the job done. Could add more error messages but it will do for now
  const [fromErrorProps, setFromErrorProps] = useState(null)
  const [toErrorProps, setToErrorProps] = useState(null)
  const [fromError, setFromError] = useState(null)
  const [toError, setToError] = useState(null)

  const now = new Date()

  const onSubmit = e => {
    e.preventDefault()

    setFromErrorProps(fromDateTime == null ? slotPropsErrorState : null)
    setToErrorProps(toDateTime == null ? slotPropsErrorState : null)

    if (!fromError && !toError && fromDateTime && toDateTime) {
      onSearchClick()
    }
  }

  return (
    <Box sx={style}>
      <Box component="form" onSubmit={onSubmit} sx={{ p: 1, m: 1, textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 1, mt: 0 }}>Find Appointments</Typography>
        <DateTimePicker
          label="from"
          views={displayFormat}
          maxDateTime={toDateTime != null ? toDateTime : undefined}
          minDateTime={now}
          value={fromDateTime}
          onChange={newValue => { setFromDateTime(newValue); setFromErrorProps(null) }}
          onError={e => setFromError(e)}
          slotProps={fromErrorProps}
        />
        <Typography sx={{ fontWeight: 'bold' }}> - </Typography>
        <DateTimePicker
          label="to"
          views={displayFormat}
          minDateTime={fromDateTime != null ? fromDateTime : now}
          value={toDateTime}
          onChange={newValue => { setToDateTime(newValue); setToErrorProps(null) }}
          onError={e => setToError(e)}
          slotProps={toErrorProps}
        />
        <Button type="submit" variant="contained" size="medium" sx={{ mt: 1 }}>Search</Button>
      </Box>
      <Box>
        {searchResultMockData.map(e => (<SearchResultCard key={e.id} data={e} />))}
      </Box>
    </Box>
  )
}

export default SearchComponent
