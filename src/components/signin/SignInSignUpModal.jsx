import { useRef, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Alert, IconButton } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Api } from '../../Api.js'

const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: '100%',
  maxWidth: { md: 400 },
  height: { xs: '100%', md: 'inherit' },
  width: { xs: '100%', md: 'inherit' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto'
}

const initialSignInState = {
  personnummer: '',
  password: ''
}

const initialSignUpState = {
  personnummer: '',
  firstName: '',
  lastName: '',
  password: '',
  email: ''
}

function SignInSignUpModal({ open, onClose }) {
  const formRef = useRef();
  const [showSignUpForm, setShowSignUpForm] = useState(false)

  const [showAlert, setShowAlert] = useState(false)
  const [alertSeverity, setAlertSeverity] = useState('error')
  const [alertMessage, setAlertMessage] = useState('')

  const [signInState, setSignInState] = useState(initialSignInState)
  const [signUpState, setSignUpState] = useState(initialSignUpState)

  const closeModal = () => {
    setSignInState(initialSignInState)
    setSignUpState(initialSignUpState)
    setShowAlert(false)
    onClose()
  }

  const handleSignInChange = e => setSignInState(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleSignUpChange = e => setSignUpState(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = event => {
    event.preventDefault()

    if (!formRef.current.reportValidity()) {
      return
    }

    if (showSignUpForm) {
      Api.post('/patients', signUpState)
        .then(() => {
          setSignUpState(initialSignUpState)
          setShowSignUpForm(false)
          setShowAlert(true)
          setAlertSeverity('info')
          setAlertMessage('Account created sucessfully!')
        }).catch(err => {
          setShowAlert(true)
          setAlertSeverity('error')
          setAlertMessage(`Could not create account: ${err.response.data.msg}`)
        })
    } else {
      // TODO: API call for sign in
      closeModal()
    }
  }

  const signInForm = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        name="personnummer"
        label="Personnummer"
        value={signInState.personnummer}
        onChange={handleSignInChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        value={signInState.password}
        onChange={handleSignInChange}
      />
    </>
  )

  const signUpForm = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        name="personnummer"
        label="Personnummer"
        onChange={handleSignUpChange}
        value={signUpState.personnummer}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="firstName"
        label="First name"
        onChange={handleSignUpChange}
        value={signUpState.firstName}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="lastName"
        label="Last name"
        onChange={handleSignUpChange}
        value={signUpState.lastName}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        onChange={handleSignUpChange}
        value={signUpState.password}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="email"
        label="E-mail"
        onChange={handleSignUpChange}
        value={signUpState.email}
      />
    </>
  )

  return (
    <Modal open={open} onClose={closeModal} sx={{ maxHeight: '100%' }}>
      <Box sx={style} >
        <IconButton onClick={closeModal} sx={{ position: 'absolute', right: '10px', top: '10px' }}>
          <CloseIcon />
        </IconButton>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{showSignUpForm ? "Sign up" : "Sign in"}</Typography>
        <Box ref={formRef} component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          {showSignUpForm ? signUpForm : signInForm}
          {showAlert && <Alert severity={alertSeverity} sx={{ mt: 1 }}>{alertMessage}</Alert>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign {showSignUpForm ? 'Up' : 'In'}</Button>
          <Link href="#" variant="body2" onClick={() => setShowSignUpForm(prev => !prev)}>
            {showSignUpForm ? "Already have an account? Sign in" : "Don't have an account? Sign Up"}
          </Link>
        </Box>
      </Box>
    </Modal>
  )
}

export default SignInSignUpModal
