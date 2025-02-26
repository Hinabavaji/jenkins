
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Dashboard from "@/component/dashboard/dashboard";
import Head from "next/head";

const NewDashboard = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
        }
    }, [router]);
    return (
        <>
            <Head>
                <title>EOG Resources Inc</title>
                <meta name="description" content="EOG Resources Inc" />
                <link rel="icon" href="/eog.ico" />
            </Head>
            <Dashboard />
        </>);
};

export default NewDashboard;