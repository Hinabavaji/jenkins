import React from "react";
import Head from "next/head";
import MonitoringPage from "@/component/monitoring/Monitoring";

const Monitoring = () => {
    return (
        <>
            <Head>
                <title>EOG Resources Inc</title>
                <meta name="description" content="EOG Resources Inc" />
                <link rel="icon" href="/eog.ico" />
            </Head>
            <MonitoringPage />
        </>

    )
}

export default Monitoring;