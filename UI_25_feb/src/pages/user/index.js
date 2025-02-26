import React from "react";
import Head from "next/head";
import UserTable from "@/component/user/userTable";

const User = () => {
    return (
        <>
            <Head>
                <title>EOG Resources Inc</title>
                <meta name="description" content="EOG Resources Inc" />
                <link rel="icon" href="/eog.ico" />
            </Head>
            <UserTable />
        </>

    )
}

export default User;