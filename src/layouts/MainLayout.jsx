import { useDispatch } from "react-redux";
import GNB from "../components/atoms/GNB";
import { Outlet, useNavigate } from "react-router-dom";
import { getUserInfoThunk } from "../store/slices/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect } from "react";

const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("Token");

    if (token) {
      dispatch(getUserInfoThunk())
        .then(unwrapResult)
        .catch(() => {
          localStorage.removeItem("Token");
          navigate("/login");
        });
    }
  }, [dispatch, navigate]);

  return (
    <>
      <GNB />
      <main className="w-full max-w-[1280px] mx-auto px-4 py-8 md:my-24">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
