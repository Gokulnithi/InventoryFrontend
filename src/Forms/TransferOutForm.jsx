import React, { useState } from 'react';
import {
  TextField,
  Button,
  Stack,
  Autocomplete,
} from '@mui/material';
import { itemNames } from '../Constans/comps.js';

const TransferOutForm = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [toBase, setToBase] = useState('');
  const [dispatchDate, setDispatchDate] = useState('');

  const handleSubmit = () => {
    console.log({
      item: selectedItem,
      toBase,
      dispatchDate,
    });
  };

  return (
    <Stack spacing={2}>
      {}
      <Autocomplete
        options={itemNames}
        value={selectedItem}
        onChange={(event, newValue) => setSelectedItem(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Item Name" fullWidth />
        )}
        fullWidth
        clearOnEscape
      />

      {}
      <TextField
        label="To Base"
        value={toBase}
        onChange={(e) => setToBase(e.target.value)}
        fullWidth
      />

      {}
      <TextField
        label="Dispatch Date"
        type="date"
        value={dispatchDate}
        onChange={(e) => setDispatchDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      {}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Initiate Transfer Out
      </Button>
    </Stack>
  );
};

export default TransferOutForm;
