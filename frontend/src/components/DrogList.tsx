import { Theme, useTheme } from "@mui/material";
import Box from "@mui/material/Box/Box";
import Chip from "@mui/material/Chip/Chip";
import FormControl from "@mui/material/FormControl/FormControl";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select/Select";
import { useEffect, useState } from "react";

interface DrogListProps {
  label: string;
  items: { name: string }[];
  handleItemsNameOnChange: (name: string[]) => void;
}

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function DrogList(props: DrogListProps) {
  const theme = useTheme();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const {
      target: { value },
    } = event;
    const newValue = typeof value === "string" ? value.split(",") : value;
    setSelectedValues(() => {
      props.handleItemsNameOnChange(newValue);
      return newValue;
    });
  };

  return (
    <>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-multiple-chip-label">{props.label}</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            value={selectedValues}
            label={props.label}
            onChange={handleChange}
            multiple
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {props.items.map((value) => (
              <MenuItem
                key={value.name}
                value={value.name}
                style={getStyles(value.name, selectedValues, theme)}
              >
                {value.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );
}
