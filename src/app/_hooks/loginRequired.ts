"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const useAuth = () => {
    const router = useRouter();
    const pathname = usePathname();
    const excludedRoutes = ["/log-in", "/sign-up"];

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token && !excludedRoutes.includes(pathname)) {
            router.replace("/log-in");
        }
    }, [router, pathname]);
};

export default useAuth;
