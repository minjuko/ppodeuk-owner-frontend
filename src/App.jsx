import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import SalesManagementPage from "./pages/SalesManagementPage";
import MainLayout from "./layouts/MainLayout";
import CarwashManagementPage from "./pages/CarwashManagementPage";
import CarwashItemManagementPage from "./pages/CarwashItemManagementPage";
import CarwashDetailEditingPage from "./pages/CarwashDetailEditingPage";
import CarwashBayReservationHistoryPage from "./pages/CarwashBayReservationHistoryPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./pages/ProtectedRoute";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/sales"
              element={
                <ProtectedRoute>
                  <SalesManagementPage />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/manage"
              element={
                <ProtectedRoute>
                  <CarwashManagementPage />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/manage/item/:carwash_id"
              element={
                <ProtectedRoute>
                  <CarwashItemManagementPage />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/manage/item/:carwash_id/edit"
              element={
                <ProtectedRoute>
                  <CarwashDetailEditingPage />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/manage/item/:carwash_id/:bayId"
              element={
                <ProtectedRoute>
                  <CarwashBayReservationHistoryPage />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <NotFoundPage />
                </ProtectedRoute>
              }
            ></Route>
          </Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <RegisterPage />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
