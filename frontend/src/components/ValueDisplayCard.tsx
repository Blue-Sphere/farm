import { Card, Col, Row } from "react-bootstrap";
import React from "react";

interface ValueDisplayCardProps {
  title: string;
  value: number;
  color:
    | "Primary"
    | "Success"
    | "Info"
    | "Warning"
    | "Danger"
    | "Secondary"
    | "Light"
    | "Dark";
  icon: React.ReactElement;
  gridSize?: number;
}

const colorMap: Record<ValueDisplayCardProps["color"], string> = {
  Primary: "#4e73df",
  Success: "#1cc88a",
  Info: "#36b9cc",
  Warning: "#f6c23e",
  Danger: "#e74a3b",
  Secondary: "#858796",
  Light: "#f8f9fc",
  Dark: "#5a5c69",
};

export default function ValueDisplayCard({
  title,
  value,
  color,
  icon,
  gridSize = 6,
}: ValueDisplayCardProps) {
  const cardColor = colorMap[color as keyof typeof colorMap];

  return (
    <>
      <Col xl={gridSize} md={6} className="mb-4">
        <Card
          className="border-left-primary shadow h-100 py-2"
          style={{ borderLeft: `.25rem solid ${cardColor}` }}
        >
          <Card.Body>
            <Row className="no-gutters align-items-center">
              <Col className="mr-2">
                <div
                  className="text-xs font-weight-bold text-uppercase mb-1"
                  style={{ color: cardColor }}
                >
                  {title}
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
              </Col>
              <Col
                style={{ flex: "0 0 auto", width: "auto", maxWidth: "100%" }}
              >
                {React.cloneElement(icon, {
                  style: { color: cardColor, fontSize: "2rem" },
                })}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
