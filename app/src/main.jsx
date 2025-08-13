import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TestPage from "./components/TestPage/TestPage.jsx";
import MealsList from "./frontend/components/MealsList.jsx";
import FrontPage from "./frontend/components/FrontPage.jsx";
import Reservation from "./frontend/components/Reservation.jsx";
import ReviewForm from "./frontend/components/ReviewForms.jsx";
import Layout from "./LayOut";
import "./main.css";

const router = createBrowserRouter([
  {
    path: "/all-meals",
    element: (
      <Layout>
        <FrontPage />
      </Layout>
    ),
  },
  {
    path: "/reservation/:id",
    element: (
      <Layout>
        <Reservation />
      </Layout>
    ),
  },

  {
    path: "/all-meals",
    element: (
      <Layout>
        <MealsList />
      </Layout>
    ),
  },
  {
    path: "/review/:id",
    element: (
      <Layout>
        <ReviewForm />
      </Layout>
    ),
  },

  {
    path: "/nested",
    element: (
      <Layout>
        <TestPage />
      </Layout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
