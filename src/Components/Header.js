import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
/* import Button from "@mui/material/Button"; */
import LogoSimpleBlock from "./assets/LogoMakr-9qZ27k.png";

// menu

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";

import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";

//
import { Link } from "react-router-dom";

//////////////

/* import ListSubheader from "@mui/material/ListSubheader"; */
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
/* import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send"; */
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
/* import StarBorder from "@mui/icons-material/StarBorder"; */

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function PrimarySearchAppBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  // menu begin
  const [open, setOpen] = React.useState(false);
  const [openTwo, setOpenTwo] = React.useState(false);
  const [openThree, setOpenThree] = React.useState(false);
  const [openFour, setOpenFour] = React.useState(false);

  const anchorRef = React.useRef(null);

  const handleClickOne = () => {
    setOpenTwo(!openTwo);
  };
  const handleClickThree = () => {
    setOpenThree(!openThree);
  };
  const handleClickFour = () => {
    setOpenFour(!openFour);
  };

  const handleToggle = () => {
    setOpen(/* (prevOpen) => !prevOpen */ true);
  };
  // eslint-disable-next-line
  const closeSections = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  //menu end
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? "composition-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <Stack direction="row" spacing={2}>
              <div>
                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  placement="bottom-start"
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom-start"
                            ? "left top"
                            : "left bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList
                            autoFocusItem={open}
                            id="composition-menu"
                            aria-labelledby="composition-button"
                            onKeyDown={handleListKeyDown}
                          >
                            {" "}
                            {/*  <List
                              sx={{
                                width: "100%",
                                maxWidth: 360,
                                bgcolor: "background.paper",
                              }}
                              component="nav"
                              aria-labelledby="nested-list-subheader"
                              subheader={
                                <ListSubheader
                                  component="div"
                                  id="nested-list-subheader"
                                >
                                  Our Services!
                                </ListSubheader>
                              }
                            > */}
                            <Link
                              to="/"
                              className="Nav "
                              style={{
                                textDecoration: "none",
                                color: "white",
                              }}
                            >
                              <MenuItem onClick={handleClose}>
                                Main/Login and buy NFTs
                              </MenuItem>
                            </Link>
                            <ListItemButton onClick={handleClickOne}>
                              <ListItemIcon>
                                <InboxIcon />
                              </ListItemIcon>
                              <ListItemText primary="NFT Marketplace" />
                              {openTwo ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openTwo} timeout="auto" unmountOnExit>
                              <List component="div" disablePadding>
                                {/*  <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemText primary="Starred" />
                                  </ListItemButton>{" "} */}
                                <Link
                                  to="/MintedTokens"
                                  className="Nav"
                                  style={{
                                    textDecoration: "none",
                                    color: "white",
                                  }}
                                >
                                  <MenuItem onClick={handleClose}>
                                    Minted Tokens
                                  </MenuItem>
                                </Link>
                                <Link
                                  to="/MintForm"
                                  className="Nav"
                                  style={{
                                    textDecoration: "none",
                                    color: "white",
                                  }}
                                >
                                  <MenuItem onClick={handleClose}>
                                    Mint NFT
                                  </MenuItem>
                                </Link>
                                <Link
                                  to="/OwnNfts"
                                  className="Nav"
                                  style={{
                                    textDecoration: "none",
                                    color: "white",
                                  }}
                                >
                                  <MenuItem onClick={handleClose}>
                                    Owned Nft list
                                  </MenuItem>
                                </Link>
                                <Link
                                  to="/NftHistory"
                                  className="Nav"
                                  style={{
                                    textDecoration: "none",
                                    color: "white",
                                  }}
                                >
                                  <MenuItem onClick={handleClose}>
                                    NftHistory
                                  </MenuItem>
                                </Link>
                              </List>
                            </Collapse>
                            {/* </List> */}
                            <List>
                              <ListItemButton onClick={handleClickThree}>
                                <ListItemIcon>
                                  <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Buy Cryptocurrencies" />
                                {openThree ? <ExpandLess /> : <ExpandMore />}
                              </ListItemButton>

                              <Collapse
                                in={openThree}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Link
                                  to="/TransakGateway"
                                  className="Nav"
                                  style={{
                                    textDecoration: "none",
                                    color: "white",
                                  }}
                                >
                                  <MenuItem onClick={handleClose}>
                                    Buy Cryptocurrencies with 1 click!
                                  </MenuItem>
                                </Link>
                              </Collapse>
                            </List>
                            <List>
                              <ListItemButton onClick={handleClickFour}>
                                <ListItemIcon>
                                  <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Wallet" />
                                {openFour ? <ExpandLess /> : <ExpandMore />}
                              </ListItemButton>{" "}
                              <Collapse
                                in={openFour}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Link
                                  to="/BiconomyCrossChain"
                                  className="Nav"
                                  style={{
                                    textDecoration: "none",
                                    color: "white",
                                  }}
                                >
                                  <MenuItem onClick={handleClose}>
                                    1 Click Cross Chain transfer
                                  </MenuItem>
                                </Link>
                              </Collapse>
                            </List>
                            <MenuItem onClick={props.logout}>Logout</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
            </Stack>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          ></Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <img
            alt="SimpleBlock's Logo"
            src={LogoSimpleBlock}
            style={{ height: "4vh" }}
          />
          <Box>{props.account}</Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={0} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>

          {
            ////////////////////////////
          }
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
