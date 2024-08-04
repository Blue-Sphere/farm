import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import { memo } from "react";

interface CountControlProps {
  quantity: number;
  increment: () => void;
  decrement: () => void;
}

export default memo(function CountControl({
  quantity,
  increment,
  decrement,
}: CountControlProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{ marginRight: "5px", cursor: "pointer" }}
        onClick={decrement}
      >
        <RemoveCircleTwoToneIcon color="inherit" />
      </div>
      <input
        type="number"
        min="0"
        max="100"
        value={quantity}
        readOnly
        style={{ marginRight: "5px" }}
      />
      <div onClick={increment} style={{ cursor: "pointer" }}>
        <AddCircleTwoToneIcon color="inherit" />
      </div>
    </div>
  );
});
