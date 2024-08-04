import { GiHighGrass } from "react-icons/gi";
import { FaBoxArchive } from "react-icons/fa6";
import { CiDeliveryTruck, CiHeart } from "react-icons/ci";
import { Container, Row, Card, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../components/useFetch";
import ProductCard, { Product } from "../components/ProductCard";

export default function Home() {
  const [productPreview, setProductReview] = useState<Product[]>();

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

  if (result.data !== null) {
    return (
      <>
        <header className="masthead">
          <div className="container px-4 px-lg-5 h-100">
            <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
              <div className="col-lg-8 align-self-end">
                <h1 className="text-white font-weight-bold">
                  無毒耕種，純淨收穫
                </h1>
                <hr className="divider" />
              </div>
              <div className="col-lg-8 align-self-baseline">
                <p className="text-white-75 mb-5">
                  洪福園不使用任何農藥、除草劑；用心耕作、安心食用
                </p>
                <a className="btn btn-primary btn-xl" href="#product_introduce">
                  產品特徵
                </a>
              </div>
            </div>
          </div>
        </header>

        <section
          className="page-section"
          id="product_introduce"
          style={{ scrollMarginTop: -16 }}
        >
          <div className="container px-4 px-lg-5">
            <h2 className="text-center mt-0">產品特徵</h2>
            <hr className="divider" />
            <div className="row gx-4 gx-lg-5">
              <div className="col-lg-3 col-md-6 text-center">
                <div className="mt-5">
                  <div className="mb-2">
                    <GiHighGrass size={32} color="red" />
                  </div>
                  <h3 className="h4 mb-2">無毒耕種</h3>
                  <p className="text-muted mb-0">
                    所有農作物均不使用農藥，除草劑
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 text-center">
                <div className="mt-5">
                  <div className="mb-2">
                    <FaBoxArchive size={32} color="red" />
                  </div>
                  <h3 className="h4 mb-2">新鮮保存</h3>
                  <p className="text-muted mb-0">新鮮的蔬果，讓您吃得安心</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 text-center">
                <div className="mt-5">
                  <div className="mb-2">
                    <CiDeliveryTruck size={32} color="red" />
                  </div>
                  <h3 className="h4 mb-2">新鮮直送</h3>
                  <p className="text-muted mb-0">達到一定額度時，可免費配送</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 text-center">
                <div className="mt-5">
                  <div className="mb-2">
                    <CiHeart size={32} color="red" />
                  </div>
                  <h3 className="h4 mb-2">愛心灌溉</h3>
                  <p className="text-muted mb-0">
                    愛心照顧每一株植物，用心做好每一件農務
                  </p>
                </div>
              </div>
            </div>
            <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
              <div className="col-lg-8 align-self-end">
                <a className="btn btn-primary btn-xl mt-5" href="#product">
                  產品瀏覽
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          className="page-section bg-dark"
          id="product"
          style={{ scrollMarginTop: -16 }}
        >
          <div className="container px-4 px-lg-5">
            <div className="row gx-4 gx-lg-5 justify-content-center">
              <div className="col-lg-12 text-center">
                <h2 className="text-white mt-0">查看我們的無毒產品</h2>
                <hr className="divider divider-light" />
                <Container fluid="md">
                  <Row>
                    {result.data.map(
                      (item: Product, index) =>
                        index < 4 && (
                          <Col xs={3}>
                            <Card
                              style={{
                                boxShadow: "10px 10px 10px rgba(0,0,0,0.5)",
                              }}
                            >
                              <Card.Img
                                variant="top"
                                src={`data:image/jpeg;base64,${item.image}`}
                              />
                              <Card.Body style={{ textAlign: "center" }}>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>{item.price}$ / 斤</Card.Text>
                                <Card.Text>
                                  剩餘數量: {item.quantity} 斤
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                        )
                    )}
                  </Row>
                </Container>
                <Link to="/product">
                  <a className="btn btn-light btn-xl mt-5" href="">
                    點擊瀏覽更多
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div id="portfolio">
          <div className="container-fluid p-0">
            <div className="row g-0">
              <div className="col-lg-4 col-sm-6">
                <a
                  className="portfolio-box"
                  href="src/assets/img/introduce/crops-1.jpg"
                  title=""
                >
                  <img
                    className="img-fluid"
                    src="src/assets/img/introduce/crops-1.jpg"
                    alt="..."
                  />
                  <div className="portfolio-box-caption">
                    <div className="project-category text-white-50">
                      Category
                    </div>
                    <div className="project-name">農場環境</div>
                  </div>
                </a>
              </div>
              <div className="col-lg-4 col-sm-6">
                <a
                  className="portfolio-box"
                  href="assets/img/introduce/crops-2.jpg"
                  title="Project Name"
                >
                  <img
                    className="img-fluid"
                    src="src/assets/img/introduce/crops-2.jpg"
                    alt="..."
                  />
                  <div className="portfolio-box-caption">
                    <div className="project-category text-white-50">
                      Category
                    </div>
                    <div className="project-name">農場環境</div>
                  </div>
                </a>
              </div>
              <div className="col-lg-4 col-sm-6">
                <a
                  className="portfolio-box"
                  href="assets/img/introduce/crops-3.jpg"
                  title="Project Name"
                >
                  <img
                    className="img-fluid"
                    src="https://via.placeholder.com/1920x1080"
                    alt="..."
                  />
                  <div className="portfolio-box-caption">
                    <div className="project-category text-white-50">
                      Category
                    </div>
                    <div className="project-name">Project Name</div>
                  </div>
                </a>
              </div>
              <div className="col-lg-4 col-sm-6">
                <a
                  className="portfolio-box"
                  href="assets/img/introduce/crops-4.jpg"
                  title="Project Name"
                >
                  <img
                    className="img-fluid"
                    src="https://via.placeholder.com/1920x1080"
                    alt="..."
                  />
                  <div className="portfolio-box-caption">
                    <div className="project-category text-white-50">
                      Category
                    </div>
                    <div className="project-name">Project Name</div>
                  </div>
                </a>
              </div>
              <div className="col-lg-4 col-sm-6">
                <a
                  className="portfolio-box"
                  href="assets/img/introduce/crops-5.jpg"
                  title="Project Name"
                >
                  <img
                    className="img-fluid"
                    src="https://via.placeholder.com/1920x1080"
                    alt="..."
                  />
                  <div className="portfolio-box-caption">
                    <div className="project-category text-white-50">
                      Category
                    </div>
                    <div className="project-name">Project Name</div>
                  </div>
                </a>
              </div>
              <div className="col-lg-4 col-sm-6">
                <a
                  className="portfolio-box"
                  href="src=https://via.placeholder.com/1920x1080"
                  title="Project Name"
                >
                  <img
                    className="img-fluid"
                    src="https://via.placeholder.com/1920x1080"
                    alt="..."
                  />
                  <div className="portfolio-box-caption p-3">
                    <div className="project-category text-white-50">
                      Category
                    </div>
                    <div className="project-name">Project Name</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
