import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useFormContext } from 'react-hook-form';
interface ComboBoxProps{
  options:{label:string, value:string;}[];
  setValue:any;
  defaultLabel:string
}

const  ComboBox=({
  options,
  setValue,
  defaultLabel
}:ComboBoxProps) =>{

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={options}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label={defaultLabel} />}
      onChange={(event:any,value:any) => {
        setValue(value)
      }}
    />
  );
}
export default ComboBox
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
