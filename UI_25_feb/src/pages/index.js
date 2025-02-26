
import Head from 'next/head';
import Login from './login';


export default function Home() {
  return (
    <div>
      <Head>
        <title>EOG Resources Inc</title>
        <meta name="description" content="EOG Resources Inc" />
        <link rel="icon" href="/eog.ico" />
      </Head>

      <main>
        <Login/>
      </main>
    </div>
  );
}
