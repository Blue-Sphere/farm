import { GridRowModel } from "@mui/x-data-grid";
import { useCallback } from "react";

export const useRowUpdater = (basePath: string) => {
  const updateRow = useCallback(
    async (newRow: GridRowModel) => {
      try {
        const response = await fetch(basePath, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRow),
        });

        console.log(response);

        if (!response.ok) {
          throw new Error("更新失敗");
        }

        return newRow; // 返回更新後的資料
      } catch (error) {
        console.error("更新失敗：", error);
        return null; // 返回 null 表示失敗
      }
    },
    [basePath]
  );

  return { updateRow };
};
