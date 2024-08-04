import React, { memo, useState } from "react";
import LayOutNavBar from "../../../components/LayOutNavBar";
import Customer from "./Customer";
import Admin from "./Admin";
import Loss from "./Loss";

export default function AssetsManagement() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navbarItems = ["會員管理", "管理者編輯"];

  const MemoizedCustomer = memo(Customer);
  const MemoizedAdmin = memo(Admin);

  return (
    <div>
      <LayOutNavBar
        items={navbarItems}
        currentIndex={currentIndex}
        onSelect={setCurrentIndex}
      />
      {currentIndex == 0 && <MemoizedCustomer />}
      {currentIndex == 1 && <MemoizedAdmin />}
    </div>
  );
}
