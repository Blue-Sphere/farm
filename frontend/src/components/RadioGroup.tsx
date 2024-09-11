import FormControl from "@mui/material/FormControl/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel/FormControlLabel";
import FormLabel from "@mui/material/FormLabel/FormLabel";
import Radio from "@mui/material/Radio/Radio";
import { Box, RadioGroup as MuiRadioGroup } from "@mui/material";

interface RadioGroupProps {
  label: string;
  items: Record<string, any>;
  handleRadioButtonOnChange: (value: any) => void;
}

export default function RadioGroup(props: RadioGroupProps) {
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">{props.label}</FormLabel>
      <MuiRadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        onChange={(event) =>
          props.handleRadioButtonOnChange(event.target.value)
        }
      >
        {Object.entries(props.items).map(([key, value]) => (
          <FormControlLabel value={value} control={<Radio />} label={key} />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
}
