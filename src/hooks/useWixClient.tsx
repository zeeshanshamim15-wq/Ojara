"use client";

import { useContext } from "react";
import { WixClientContext } from "@/context/wixContext";

export const useWixClient = () => useContext(WixClientContext);
