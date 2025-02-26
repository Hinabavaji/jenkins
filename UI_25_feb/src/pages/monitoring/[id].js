import { ASSETDETAILS_TABLE } from "@/utilities/api";
import Head from "next/head";
import Layout from "@/utilities/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';


const DetailsPage = () => {
  const router = useRouter();
  let { id } = router.query;
  const [assetDetailsTable, setAssetDetailsTable] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!id) {
      id = localStorage.getItem('id');
    }
    assetDetails();
  }, [id]);

  const assetDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ASSETDETAILS_TABLE}/${id}/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 401) {
        router.push(`/login`);
      }
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setAssetDetailsTable(data);
    } catch (err) {
      console.error("Error fetching data:", err.message);
    }
  };

  const handleClick = () => {
    try {
      router.back();
      localStorage.removeItem('id');
    } catch (err) {
      console.error("Error-->", err.message);
    }
  }

  return (
    <>
      <Head>
        <title>EOG Resources Inc</title>
        <meta name="description" content="EOG Resources Inc" />
        <link rel="icon" href="/eog.ico" />
      </Head>
      <Layout>
        {assetDetailsTable && (
          <Row className="align-items-center mb-3"
            style={{
              padding: "5px"
            }}>
            <Col style={{
              color: "black",
              paddingLeft: "20px",
              textAlign: "left",
              fontSize: "27px",
              fontWeight: "bold"
            }}>
              {assetDetailsTable.name}
            </Col>
            <Col className="d-flex justify-content-end" style={{ paddingRight: '40px', paddingTop: '2px' }}>
              <Button style={{ backgroundColor: "#ff1100", borderColor: "#ff1100" }} onClick={handleClick}>← Back</Button>
            </Col>
          </Row>
        )}
        <Row>
          <Col xs={12} md={8} lg={6} className="mx-auto">
            <div
              className="border p-3 mb-3"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                maxWidth: "100%",
                minHeight: "280px",
                overflow: "hidden",
              }}
            >

            </div>
          </Col>
        </Row>
        
        {/* <Row>
            <AssetInfo id = {id} assetDetailsTable={assetDetailsTable}/>
            <GeoMap id = {id} assetDetailsTable={assetDetailsTable}/>
          </Row>
          <Row className="mt-3">
            <IdEventsTable id={id} />
          </Row>
          <Row className="mt-3">
            <IdGraph id={id} />
          </Row>
          <Row className="mt-3">
            <Col md={6}>
            </Col>
            <Col md={6}>
              <MemoryGraph token={token} id={id} />
            </Col>
          </Row>
          <Row className="mt-3">
            <TraceRoute id={id} />
          </Row> */}
      </Layout >
    </>
  );
};
export default DetailsPage;