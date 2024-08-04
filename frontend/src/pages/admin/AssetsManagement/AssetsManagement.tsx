import React, { memo, useState } from "react";
import LayOutNavBar from "../../../components/LayOutNavBar";
import Assets from "./Assets";
import Profit from "./Profit";
import Loss from "./Loss";

export default function AssetsManagement() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navbarItems = ["資產", "收益", "費損"];

  const MemoizedAssets = memo(Assets);
  const MemoizedProfit = memo(Profit);
  const MemoizedLoss = memo(Loss);

  return (
    <div>
      <LayOutNavBar
        items={navbarItems}
        currentIndex={currentIndex}
        onSelect={setCurrentIndex}
      />
      {currentIndex == 0 && <MemoizedAssets />}
      {currentIndex == 1 && <MemoizedProfit />}
      {currentIndex == 2 && <MemoizedLoss />}
    </div>
  );
}
