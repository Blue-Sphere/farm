import Box from "@mui/material/Box/Box";
import FormControl from "@mui/material/FormControl/FormControl";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select/Select";
import { useState } from "react";

interface DrogListProps {
  label: string;
  items: { name: string }[];
  handleItemsNameOnChange: (name: string) => void;
}

export default function DrogList(props: DrogListProps) {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;

    setSelectedValue(() => {
      props.handleItemsNameOnChange(newValue);
      return newValue;
    });
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
            {props.items.map((item) => {
              return <MenuItem value={item.name}>{item.name}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </Box>
    </>
  );
}
