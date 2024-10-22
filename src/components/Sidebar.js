import React from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';  // Import the Menu icon

const Sidebar = ({ open, onClose, handleExploreSports, handleExploreCountries, setSearchDialogOpen }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div className="flex flex-col p-4 bg-transparent" style={{ width: 250 }}>
        <div className="flex justify-between items-center"> 
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <List>
          <ListItem button onClick={handleExploreSports}>
            <ListItemText primary="Explore Sports" />
          </ListItem>
          <ListItem button onClick={() => setSearchDialogOpen(true)}>
            <ListItemText primary="Search Countries & Sports" />
          </ListItem>
          <ListItem button onClick={handleExploreCountries}>
            <ListItemText primary="Explore Countries" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
