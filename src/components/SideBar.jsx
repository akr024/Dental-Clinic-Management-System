import './SideBar.css'

import Button from '@mui/material/Button'

function SideBar(props) {
    return (
        <div>
            <div id="searchContainer">
                <p>Placeholder. Imagine search fields for date and time, with results showing bellow the search button. For now just click search to test</p>
                <Button variant="contained" size="medium" onClick={props.onSearchClick}>Search</Button>
            </div>
        </div>
    )
}

export default SideBar
