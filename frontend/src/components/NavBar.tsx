import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <>
      <Navbar
        expand="lg"
        bg="light"
        variant="light"
        fixed="top"
        collapseOnSelect
      >
        <div className="container px-4 px-lg-5">
          <Navbar.Brand href="#page-top" className="brand-bold">
            洪福園
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarResponsive" />
          <Navbar.Collapse id="navbarResponsive">
            <Nav className="ms-auto my-2 my-lg-0">
              <Nav.Link>
                <Link to="/">首頁</Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="product">產品</Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="contact">聯繫</Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="login">登入</Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  );
}
