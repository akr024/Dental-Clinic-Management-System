import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Button, CircularProgress, IconButton, Paper, Slide, Tab, Tabs, Typography, useMediaQuery, useTheme,List } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';
import { add, endOfDay, startOfDay, sub } from 'date-fns';
import { useEffect, useRef, useState } from "react";
import { Api, isAuthenticated } from '../Api';
import ClinicInfoHeader from "./ClinicInfoHeader";
import ConfirmAppointmentDialog from './ConfirmAppointmentDialog';
import { AppointmentConfirmationModal, BookingStates } from './AppointmentConfirmationModal';
import axios from 'axios';
import ReviewModal from './ReviewModal';
import ReviewComponent from './ReviewComponent'


function ClinicDetailsComponent({ selectedClinic, setSignInModalOpen }) {
  const [open, setOpen] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [date, setDate] = useState(new Date())
  const [appointments, setAppointments] = useState([])
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [confirmAppointmentDialogOpen, setConfirmAppointmentDialogOpen] = useState(false)
  const [appointmentConfirmationDialogOpen, setAppointmentConfirmationDialogOpen] = useState(false)
  const [appointmentState, setAppointmentState] = useState(BookingStates.PENDING)
  const [reviewDialogOpen,setReviewDialogOpen] = useState(false) 
  const [reviews,setReviews] = useState([])
  // hold reference for the out transition
  const lastSelectedClinic = useRef(null)
  const containerRef = useRef()
  const abortControllerRef = useRef()

  const theme = useTheme();
  const mediaQueryMD = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    setOpen(selectedClinic != null)
    setTabValue(0)

    if (selectedClinic && selectedClinic?._id !== lastSelectedClinic?._id) {
      lastSelectedClinic.current = selectedClinic;
      setDate(new Date(selectedClinic.earliestAppointment));

      Api.get(`clinics/${selectedClinic?._id}/reviews`)
      .then(response => {
        setReviews(response.data)
      })
      .catch(err => {
        console.log(err)
      }
      )
  }
    },
    [selectedClinic]);
  
  useEffect(() => {
    if (selectedClinic) {
      if(abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      setIsLoadingAppointments(true)

      Api.get(`clinics/${selectedClinic._id}/appointments`, { 
        signal: abortControllerRef.current.signal,
        params: { minDate: startOfDay(date), maxDate: endOfDay(date) } 
      })
        .then(response => {
          setAppointments(response.data.appointments)
          setIsLoadingAppointments(false)
        })
        .catch(err => {
          // TODO: maybe display an error message
          console.log(err)
          setAppointments([])
          if(!axios.isCancel(err)) {
            setIsLoadingAppointments(false)
          }
        })
    }
  }, [date])

  const onBookAppointment = selectedAppointment => {
    if (isAuthenticated()) {
      setSelectedAppointment(selectedAppointment)
      setConfirmAppointmentDialogOpen(true)
    } else {
      setSignInModalOpen(true)
    }
  }

  const onConfirmAppointment = confirmed => {
    setConfirmAppointmentDialogOpen(false)

    if (confirmed) {
      setAppointmentConfirmationDialogOpen(true)
      setAppointmentState(BookingStates.PENDING)

      Api.post(`/appointments/${selectedAppointment._id}/book`)
        .then(() => {
          setAppointmentState(BookingStates.CONFIRMED)

          const appointmentIndex = appointments.findIndex(e => e._id === selectedAppointment._id)
          if(appointmentIndex !== -1) {
            setAppointments(prev => prev.filter(e => e._id !== selectedAppointment._id))
          }
        })
        .catch(() => setAppointmentState(BookingStates.FAILED))
    }
  }

  const close = () => setOpen(false)

  return (
    <Box
      ref={containerRef}
      sx={{
        position: { xs: 'fixed', md: 'absolute' },
        bottom: 0,
        right: 0,
        height: { xs: '60%', md: '100%' },
        display: { xs: 'flex', md: 'flex' },
        width: { xs: '100%', md: '375px' },
        alignItems: 'flex-end',
        pointerEvents: 'none',
        zIndex: 1001
      }}
    >

      <Slide in={open} direction={mediaQueryMD ? 'left' : 'up'} container={containerRef.current}>

        <Paper
          square={false}
          elevation={16}
          sx={{
            overflow: 'auto',
            m: { xs: 0, md: 3 },
            p: 3,
            position: 'relative',
            width: { xs: '100%' },
            height: { xs: '100%', md: '80%' },
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'all'
          }}>

          <IconButton onClick={close} sx={{ position: 'absolute', right: '10px', top: '10px' }}>
            <CloseIcon />
          </IconButton>

          {lastSelectedClinic.current ? <ClinicInfoHeader clinic={lastSelectedClinic.current} /> : <></>}

          <Tabs centered variant="fullWidth" value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Appointments" />
            <Tab label="Reviews" />
          </Tabs>

          <Box sx={{ display: tabValue === 0 ? 'flex' : 'none', flexDirection: 'column', flexGrow: 1, mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton onClick={() => setDate(prev => sub(prev, { days: 1 }))}>
                  <NavigateBeforeIcon />
                </IconButton>
                <DatePicker sx={{ mb: 1 }} value={date} onChange={date => setDate(date)} minDate={new Date()} />
                <IconButton onClick={() => setDate(prev => add(prev, { days: 1 }))}>
                  <NavigateNextIcon />
                </IconButton>
              </Box>

              {
                isLoadingAppointments && <CircularProgress disableShrink sx={{ m: 'auto' }} />
              }

              {
                !isLoadingAppointments && (appointments.length > 0 ?
                  appointments
                    .map(e => (
                      <Button
                        variant="outlined"
                        size="small"
                        key={e._id}
                        sx={{ m: 1 }}
                        onClick={() => onBookAppointment(e)}
                      >
                        {new Date(e.dateTime).toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })}
                      </Button>
                    ))
                  :
                  <Typography sx={{ textAlign: 'center' }}>
                    No available appointments for {date.toLocaleString('en-GB', { day: 'numeric', month: 'short' })}
                  </Typography>
                )
              }

            </Box>
            <Button variant="contained" sx={{ mt: 1 }}>See more</Button>
          </Box>

          <Box sx={{ display: tabValue === 1 ? 'block' : 'none', mt: 2 }}>
          {reviews && reviews?.reviews?.length > 0 ? <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {reviews.reviews.map((review, index) => {
                return <ReviewComponent key={index} reviewComponent review={review} />})}
            </List> :  <Typography>No review yet</Typography>}
            <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={()=>setReviewDialogOpen(true)}>Leave A Review</Button>
          </Box>
        </Paper>
      </Slide>

      <ConfirmAppointmentDialog open={confirmAppointmentDialogOpen} onClose={onConfirmAppointment} appointment={selectedAppointment} />
      <AppointmentConfirmationModal
        open={appointmentConfirmationDialogOpen}
        onClose={() => setAppointmentConfirmationDialogOpen(false)}
        clinic={selectedClinic}
        appointment={selectedAppointment}
        appointmentState={appointmentState}
      />
      <ReviewModal
        open={reviewDialogOpen}
        onClose={()=>setReviewDialogOpen(false)} selectedClinicId={selectedClinic?._id}>
      </ReviewModal>
    </Box>
  )
}

export default ClinicDetailsComponent