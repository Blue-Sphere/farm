import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/Home";

import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayOut";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Shop from "./pages/user/Shop";
import Cart from "./pages/user/Cart";
import Order from "./pages/user/Order";
import Setting from "./pages/user/Setting";
import { useEffect, useState } from "react";
import Alert from "./components/Alert";
import Assets from "./pages/admin/AssetsManagement/Assets";
import AssetsManagement from "./pages/admin/AssetsManagement/AssetsManagement";
import SuppliesManagement from "./pages/admin/SuppliesManagement/SuppliesManagement";
import ProductManagement from "./pages/admin/ProductManagement/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement/OrderManagement";
import UserManagement from "./pages/admin/UserManagement/UserManagement";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const [loading, setLoading] = useState(true);

    const checkAuthentication = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:8080/user/validate_token",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error validating token:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      checkAuthentication();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/" replace />;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="product" element={<Products />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route
            path="shop"
            element={
              <PrivateRoute>
                <Shop />
              </PrivateRoute>
            }
          />
          <Route
            path="cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="order"
            element={
              <PrivateRoute>
                <Order />
              </PrivateRoute>
            }
          />
          <Route
            path="setting"
            element={
              <PrivateRoute>
                <Setting />
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route
            path="assets_management"
            element={
              <PrivateRoute>
                <AssetsManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="supplies_management"
            element={
              <PrivateRoute>
                <SuppliesManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="product_management"
            element={
              <PrivateRoute>
                <ProductManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="order_management"
            element={
              <PrivateRoute>
                <OrderManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="user_management"
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            }
          />
        </Route>
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
