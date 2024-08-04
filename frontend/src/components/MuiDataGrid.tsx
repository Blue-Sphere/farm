import Box from "@mui/material/Box/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface MuiDataGridProps {
  columns: {
    field: string;
    headerName: string;
    width: number;
    editable: boolean;
  }[];
  datas: Record<string, any>[];
}

export default function MuiDataGrid(props: MuiDataGridProps) {
  const columns: GridColDef<Record<string, any>>[] = props.columns;

  return (
    <div>
      <Box
        sx={{
          height: 400,
          width: "100%",
          paddingLeft: 2.5,
          paddingRight: 2.5,
        }}
      >
        <DataGrid
          rows={props.datas}
          columns={columns.map((column) => ({ flex: 1, ...column }))}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#272727",
              color: "#FCFCFC",
              width: "100%",
            },
            "& .MuiDataGrid-iconSeparator": {
              color: "#FCFCFC",
            },
            "& .MuiButtonBase-root": {
              color: "#FCFCFC",
            },
            "& .MuiPaginationItem-previousNext": {
              color: "black",
            },
            "&.Mui-checked": {
              color: "black",
            },
            backgroundColor: "#F0F0F0",
          }}
        />
      </Box>
    </div>
  );
}
