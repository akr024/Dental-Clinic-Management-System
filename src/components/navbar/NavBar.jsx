import { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'

import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Personal Page', path: '/personal-page' },
  { name: 'About', path: '#' }
]

function NavBar({ toggleColorMode, onSigninClick, onSignoutClick, authenticated }) {
  const theme = useTheme()
  const navigate = useNavigate();

  const [anchorElementAccount, setAnchorElementAccount] = useState(null)
  const [anchorElementNav, setAnchorElementNav] = useState(null)

  const handleAccountMenu = event => setAnchorElementAccount(event.currentTarget)
  const handleCloseAccountMenu = () => setAnchorElementAccount(null)

  const handleNavMenu = event => setAnchorElementNav(event.currentTarget)
  const handleCloseNavMenu = page => {
    setAnchorElementNav(null)
    if (page) {
      navigate(page.path)
    }
  }

  const onAccountMenuPersonalPageClick = () => {
    handleCloseAccountMenu()
    navigate('/personal-page')
  }

  const handleLogOut = () => {
    handleCloseAccountMenu()
    onSignoutClick()
    navigate('/')
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, display: { md: 'none' } }} onClick={handleNavMenu}>
            <MenuIcon />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorElementNav}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={Boolean(anchorElementNav)}
            onClose={() => handleCloseNavMenu(null)}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            {pages.map(page => (
              <MenuItem key={page.name} onClick={() => handleCloseNavMenu(page)}>
                <Typography textAlign="center">{page.name}</Typography>
              </MenuItem>
            ))}
          </Menu>

          <Typography variant="h6"
            component="a"
            href="#"
            sx={{ mr: 2, textDecoration: 'none', color: 'inherit', display: { xs: 'flex', md: 'flex' }, flexGrow: { xs: 1, md: 0 } }}
            onClick={() => navigate('/')}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button key={page.name} onClick={() => navigate(page.path)} sx={{ my: 2, color: 'white', display: 'block' }} >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box>
            <IconButton sx={{ m: 1 }} onClick={toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          {!authenticated ? (<Button color="inherit" onClick={onSigninClick}>Login</Button>) : (
            <div>
              <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleAccountMenu} color="inherit" >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElementAccount}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElementAccount)}
                onClose={handleCloseAccountMenu}
              >
                <MenuItem onClick={onAccountMenuPersonalPageClick}>Personal page</MenuItem>
                <MenuItem onClick={handleLogOut}>Log out</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
export default NavBar;