import ProductCard from "../components/ProductCard";

import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useState } from "react";
import useFetch from "../components/useFetch";
import { Product } from "../components/ProductCard";
import { Col, Row } from "react-bootstrap";

export default function Products() {
  const [columnCount, setColumnCount] = useState(4);

  const result = useFetch<Product[]>(
    "http://localhost:8080/product/inventory",
    "GET"
  );

  if (result.isLoading) {
    return <p>Loading...</p>;
  }

  if (result.error) {
    return <p>Error: {result.error}</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
        marginBottom: "40px",
      }}
    >
      <div
        style={{
          flex: "auto",
          alignItems: "center",
          height: "100vh",
          overflow: "hidden",
          marginTop: "90px",
          paddingBlockEnd: "15px",
        }}
        className="bg-dark"
      >
        <AutoSizer
          onResize={({ width }) => {
            if (width < 600) {
              setColumnCount(2);
            } else {
              setColumnCount(4);
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
                  <Row xs={8} key={key} style={style}>
                    <ProductCard product={product} />
                  </Row>
                );
              }}
            </Grid>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
