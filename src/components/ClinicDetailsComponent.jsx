import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Button, IconButton, Paper, Slide, Tab, Tabs, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';
import { add, sub } from 'date-fns';
import { useEffect, useRef, useState } from "react";
import ClinicInfoHeader from "./ClinicInfoHeader";

function ClinicDetailsComponent({ selectedClinic, onBookAppointment }) {
	const [open, setOpen] = useState(true)
	const [tabValue, setTabValue] = useState(0)
	const [date, setDate] = useState(new Date())
	const [appointmentsMap, setAppointmentsMap] = useState(new Map())

	// hold reference for the out transition
	const lastSelectedClinic = useRef(null)
	const containerRef = useRef()

	useEffect(() => {
		setOpen(selectedClinic != null)
		setTabValue(0)

		if (selectedClinic) {
			lastSelectedClinic.current = selectedClinic

			const availableAppointments = selectedClinic.appointments
				.filter(e => e.available)

			const firstAvailableTime = availableAppointments
				.map(e => new Date(e.time))
				.reduce((a, b) => a < b ? a : b)

			setDate(firstAvailableTime)

			const map = new Map()
			availableAppointments.forEach(appointment => {
				const date = new Date(appointment.time).toLocaleDateString()
				if (!map.has(date)) {
					map.set(date, [appointment])
				} else {
					map.get(date).push(appointment)
				}
			})

			setAppointmentsMap(map)
		}
	}, [selectedClinic])

	const close = () => setOpen(false)

	const isDateAvailable = date => appointmentsMap.has(date.toLocaleDateString())

	return (
		<Box ref={containerRef} sx={{ position: 'absolute', bottom: 0, right: 0, height: '100%', display: 'flex', alignItems: 'flex-end', pointerEvents: 'none' }}>
			<Slide in={open} direction="left" container={containerRef.current}>
				<Paper
					square={false}
					elevation={16}
					sx={{
						overflow: 'auto',
						m: 3,
						p: 3,
						position: 'relative',
						width: '325px',
						height: '80%',
						display: 'flex',
						flexDirection: 'column',
						pointerEvents: 'all'
					}}>

					<IconButton onClick={close} sx={{ position: 'absolute', right: '10px', top: '10px' }}>
						<CloseIcon />
					</IconButton>

					{lastSelectedClinic.current ? <ClinicInfoHeader data={lastSelectedClinic.current} /> : <></>}

					<Tabs centered variant="fullWidth" value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ pb: 2 }}>
						<Tab label="Appointments" />
						<Tab label="Reviews" />
					</Tabs>

					<Box sx={{ display: tabValue === 0 ? 'flex' : 'none', flexDirection: 'column', flexGrow: 1 }}>
						<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1 }}>
							<Box sx={{ display: 'flex' }}>
								<IconButton onClick={() => setDate(prev => sub(prev, { days: 1 }))}>
									<NavigateBeforeIcon />
								</IconButton>
								<DatePicker sx={{ mb: 1 }} value={date} onChange={date => setDate(date)} minDate={new Date()} shouldDisableDate={date => !isDateAvailable(date)} />
								<IconButton onClick={() => setDate(prev => add(prev, { days: 1 }))}>
									<NavigateNextIcon />
								</IconButton>
							</Box>

							{
								appointmentsMap.has(date.toLocaleDateString()) ?
									appointmentsMap.get(date.toLocaleDateString())
										.map(e => (
											<Button
												variant="outlined"
												size="small"
												key={e.id}
												sx={{ m: 1 }}
												onClick={() => onBookAppointment(e)}
											>
												{new Date(e.time).toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })}
											</Button>
										))
									:
									<Typography sx={{ textAlign: 'center' }}>
										No available appointments for {date.toLocaleString('en-GB', { day: 'numeric', month: 'short' })}
									</Typography>
							}

						</Box>
						<Button variant="contained" sx={{ mt: 1 }}>See more</Button>
					</Box>

					<Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
						<Typography sx={{ textAlign: 'center' }}>
							No reviews yet...
						</Typography>
					</Box>
				</Paper>
			</Slide>
		</Box>
	)
}

export default ClinicDetailsComponent