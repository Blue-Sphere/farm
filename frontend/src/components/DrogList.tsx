import Box from "@mui/material/Box/Box";
import FormControl from "@mui/material/FormControl/FormControl";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select/Select";
import { useState } from "react";

interface DrogListProps {
  label: string;
  items: Record<string, any>;
}

export default function DrogList(props: DrogListProps) {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value as string);
  };

  return (
    <>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedValue}
            label={props.label}
            onChange={handleChange}
          >
            {Object.entries(props.items).map(([key, value]) => {
              return <MenuItem value={value}>{key}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </Box>
    </>
  );
}
