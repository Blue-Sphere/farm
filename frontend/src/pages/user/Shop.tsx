import { useState } from "react";
import ProductCard from "../../components/ProductCard";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid as Grid } from "react-window";
import useFetch from "../../components/useFetch";

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export default function Shop() {
  const [columnCount, setColumnCount] = useState(4);

  const token = sessionStorage.getItem("token");

  if (token === null) {
    return <p>token不存在</p>;
  }

  const result = useFetch<Product[]>(
    "http://localhost:8080/product/inventory",
    "POST",
    token
  );

  if (result.isLoading) {
    return <p>Loading...</p>;
  }

  if (result.error) {
    return <p>Error:{result.error}</p>;
  }

  if (result.data === null) {
    return <p>查無商品</p>;
  } else {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100vh",
          marginBottom: "40px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: "auto",
            alignItems: "center",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <AutoSizer
            onResize={({ width }) => {
              // 在这里根据宽度调整列数
              if (width < 600) {
                setColumnCount(2); // 当宽度小于600时，只显示两列
              } else {
                setColumnCount(4); // 当宽度大于等于600时，显示四列
              }
            }}
          >
            {({ width, height }) => (
              <Grid
                columnCount={result.data.length < 5 ? columnCount : columnCount}
                columnWidth={width / columnCount}
                height={height}
                rowCount={
                  result.data.length < 5 ? 1 : Math.ceil(result.data.length / 4)
                }
                rowHeight={columnCount == 4 ? 480 : 380}
                width={width + 100}
              >
                {({ columnIndex, rowIndex, style }) => {
                  const key = `${rowIndex} - ${columnIndex}`;
                  const productIndex = rowIndex * columnCount + columnIndex;
                  if (productIndex >= result.data.length) {
                    return null;
                  }
                  const product = result.data[productIndex];

                  return (
                    <div key={key} style={style}>
                      <ProductCard product={product} />
                    </div>
                  );
                }}
              </Grid>
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }
}
