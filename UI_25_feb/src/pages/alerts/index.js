import Alerts from "@/component/alerts/alert";
import Head from "next/head";
const NewAlerts = () =>{
    return(
        <>
          <Head>
                <title>EOG Resources Inc</title>
                <meta name="description" content="EOG Resources Inc" />
                <link rel="icon" href="/eog.ico" />
            </Head>
            <Alerts/>
        </>
       
    )
}
export default NewAlerts;