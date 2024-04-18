import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel,
    Box, Toolbar, Typography, Tooltip, IconButton, Paper, TableContainer,
    Table, TableBody, TablePagination, CircularProgress, Alert, List,
    ListItem, ListItemText, Snackbar } from '@mui/material';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import DeleteIcon from '@mui/icons-material/Delete';
//import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import FlagIcon from '@mui/icons-material/Flag';
import CloseIcon from '@mui/icons-material/Close';

import { deleteApplications } from '../../actions/db_actions';
import { useSelector, useDispatch } from 'react-redux';
import *  as styles from './styles.js';

import FormModal from '../FormModal/FormModal.js';
import StatusForm from '../StatusForm/StatusForm.js';

import JoyRide from 'react-joyride'; // For tours

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
  
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = Array.from(array).map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Set up table headers
const headCells = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Title',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'company',
    numeric: false,
    disablePadding: false,
    label: 'Company',
  },
  {
    id: 'post_url',
    numeric: false,
    disablePadding: false,
    label: 'Post URL',
  },
  {
    id: 'location',
    numeric: false,
    disablePadding: false,
    label: 'Location',
  },
  {
    id: 'income',
    numeric: true,
    disablePadding: false,
    label: 'Income',
  },
  {
    id: 'benefits',
    numeric: false,
    disablePadding: false,
    label: 'Benefits',
  },
  {
    id: 'requirements',
    numeric: false,
    disablePadding: false,
    label: 'Requirements',
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Created Date',
  },
  {
    id: 'updateStatus',
    numeric: false,
    disablePadding: false,
    label: '',
  },
];

const steps = [
  {
    target: ".editIcon",
    content: "Edit your applications here",
    disableBeacon: true,
  },
  {
    target: ".updateStatusIcon",
    content: "When application status changed, you can change it here",
      
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  
  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox' align='center'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all applications',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='center'
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: 'bold' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { numSelected, selectedIds } = props;

  function deleteApps() {
    dispatch(deleteApplications(numSelected, selectedIds));
    navigate('/', {
      state: {
        appDeleted: true,
      }
    });
  }
  
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
          bgcolor: (theme) =>
          alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
        </Typography>
      )}
  
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={deleteApps}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        // TODO: Add filter function here
        <>
          {/*
            <Tooltip title="Filter list">
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          */}
        </>
      )}
    </Toolbar>
  );
}
  
EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectedIds: PropTypes.array,
};

const Applictaions = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [rows, setRows] = useState([]);
  let isLoggedin = location.state.isLoggedin;
  let appChanged = location.state.appChange;
  // Show an error when user is offline and redirected from FormModal
  let error = location.state.error ? true : false;
  let appAdded = location.state.appAdded;

  const [user, setUser] = useState(isLoggedin);
  const [showError, setShowError] = useState(error);
  const [appAddedError, setAppAddedError] = useState(appAdded);
  const [appChange, setAppChange] = useState(appChanged);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [appData, setAppData] = useState({});
  const [numOfStatus, setNumOfStatus] = useState({ applied: 0, interview: 0, accepted: 0, rejected: 0, saved: 0 });
  const [run, setRun] = useState(false);

  var apps = useSelector((state) => state.applications);
  if (apps.length < 1) {
    apps = JSON.parse(localStorage.getItem('apps'));
  }

  // This is a modal for editing each app
  const handleOpenEditModal = () => { setOpenEditModal(true) };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setAppData({});
  };

  // This is a modal for editing status
  const handleOpenStatusModal = () => { setOpenStatusModal(true) };
  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
  };

  //const handleClickSnackBar = () => { setSnackBarOpen(true); };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);
  };

  const action = (
    <>
      {/* 
        <Button color='secondary' size='small' onClick={handleCloseSnackBar}>
          UNDO
        </Button>
      */}
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </>
  );

  useEffect(() => {
    if (apps.length >= 1) {
      const tourStr = localStorage.getItem('tour');
      if (tourStr) {
        const tourArr = tourStr.split(',');
        if (tourArr[1] == 0) {
          setRun(true);
          localStorage.setItem('tour', [tourArr[0], 1, tourArr[2], tourArr[3]]);
        }
      }
    }

    if (appChange == 'Changed') {
      console.log('appChange changed');
      setAppChange('');
      setSnackBarOpen(true);
    }

    setNumOfStatus({ applied: 0, interview: 0, accepted: 0, rejected: 0, saved: 0 });
    apps.map((app) => {
      var propName = '';
      switch(app.status) {
        case 'applied':
          propName = 'applied';
          break;
        case 'interview':
          propName = 'interview';
          break;
        case 'accepted':
          propName = 'accepted';
          break;
        case 'rejected':
          propName = 'rejected';
          break;
        case 'saved':
          propName = 'saved';
          break;
        default:
          break;
      }

      setNumOfStatus((numOfStatus) => ({ ...numOfStatus, [propName]: numOfStatus[propName] + 1 }));
    });
    
  }, ['apps']);

  // When clicking each sort button?
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // When clicking a checkbox to select all
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  // When clicking each checkbox
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  // When going to the next page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // When clicking the button to change rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Edit each application
  const editApplication = (rowData) => {
    handleOpenEditModal();
    setAppData(rowData);
  }

  // edit job app status
  const editStatus = (rowData) => {
    handleOpenStatusModal();
    setAppData(rowData);
  }

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(() =>
    stableSort(apps, getComparator(order, orderBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage), [order, orderBy, page, rowsPerPage]);

  return (
    <Box sx={{ width: '100%', marginLeft: 0 }}>
      { showError ? <Alert severity='error'>You cannot add applications during offline. Please try later.</Alert> : <></> }
      { appAddedError ? <Alert severity='error'>Application could not be added. Try again later.</Alert> : <></> }
      <JoyRide
        steps={steps}
        continuous
        hideCloseButton
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        disableCloseOnEsc
        styles={{
          tooltipContainer: {
            textAlign: 'left'
          },
          buttonNext: {
            backgroundColor: 'green'
          },
          buttonBack: {
            marginRight: 10
          }
        }}
        locale={{
          last: 'End tour',
          skip: 'Close tour'
        }}
      />

      <List sx={{ display: 'flex', flexDirection: 'row', padding: 0, width: '40%', marginLeft: '62%' }}>
        <ListItem><ListItemText primary={numOfStatus.applied} secondary='Applied' /></ListItem>
        <ListItem><ListItemText primary={numOfStatus.interview} secondary='Interview' /></ListItem>
        <ListItem><ListItemText primary={numOfStatus.accepted} secondary='Accepted' /></ListItem>
        <ListItem><ListItemText primary={numOfStatus.rejected} secondary='Rejected' /></ListItem>
        <ListItem><ListItemText primary={numOfStatus.saved} secondary='Saved' /></ListItem>
      </List>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selectedIds={selected} />
        <FormModal open={openEditModal} close={handleCloseEditModal} data={appData} />
        <StatusForm open={openStatusModal} close={handleCloseStatusModal} user={user} data={appData} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={apps ? apps.length : 0}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.ref_id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  !apps.length ? <CircularProgress /> :
                    <TableRow
                      hover
                      //onClick={(event) => handleClick(event, row.id)}
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.ref_id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding='checkbox' key={row.ref_id + 'checkbox'}>
                        <Checkbox
                          //onClick={(event) => handleClick(event, row._id)}
                          onClick={(event) => handleClick(event, row.ref_id)}
                          color='primary'
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>

                      <Tooltip title={row.title} followCursor placement='top-start'>
                        <TableCell
                          component='th'
                          id={labelId}
                          scope='row'
                          padding='none'
                          key={row.ref_id + 'title'}
                          sx={styles.createCellStyle}
                          align='center'
                        >
                          {row.title}
                        </TableCell>
                      </Tooltip>

                      <Tooltip title={row.status} followCursor placement='top-start'>
                        <TableCell align='center' key={row.ref_id + 'status'} style={{ textTransform: 'capitalize' }}>{row.status}</TableCell>
                      </Tooltip>
                    
                      <Tooltip title={row.company} followCursor placement='top-start'>
                        <TableCell align='center' key={row.ref_id + 'company'} sx={styles.createCellStyle}>{row.company}</TableCell>
                      </Tooltip>

                      <Tooltip title={row.post_url} followCursor placement='top-start'>
                        <TableCell align='center' key={row.ref_id + 'post_url'} sx={styles.createCellStyle}>{row.post_url}</TableCell>
                      </Tooltip>
                    
                      <Tooltip title={row.location} followCursor placement='top-start'>
                        <TableCell align='center' key={row.ref_id + 'location'} sx={styles.createCellStyle}>{row.location}</TableCell>
                      </Tooltip>
                    
                      <TableCell align='center' key={row.ref_id + 'income'} sx={styles.createCellStyle}>{row.income}</TableCell>

                      <Tooltip title={row.benefits ? row.benefits.join(', ') : ''} followCursor placement='top-start'>
                        <TableCell align='center' key={row.ref_id + 'benefits'} sx={styles.createCellStyle}>{row.benefits ? row.benefits.join(', ') : ''}</TableCell>
                      </Tooltip>

                      <Tooltip title={row.requirements ? row.requirements.join(', ') : ''} followCursor placement='top-start'>
                        <TableCell align='center' key={row.ref_id + 'requirements'} sx={styles.createCellStyle}>{row.requirements ? row.requirements.join(', ') : ''}</TableCell>
                      </Tooltip>

                      <TableCell align='center' key={row.ref_id + 'date'}>{row.date}</TableCell>

                      <TableCell align='center' key={row.ref_id + 'updateStatus'}>
                        <Tooltip title='Edit' followCursor placement='top-start'>
                          <IconButton color='primary' onClick={() => editApplication(row)} className='editIcon'>
                            <EditIcon variable='outlined' />
                          </IconButton>
                        </Tooltip>
                      
                        <Tooltip title='Change Status' followCursor placement='top-start'>
                          <IconButton color='primary' onClick={() => editStatus(row)} className='updateStatusIcon'>
                            <FlagIcon variable='outlined' />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={apps ? apps.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        message='Application Has Been Added'
        action={action}
      />
    </Box>
  );
}

export default Applictaions;