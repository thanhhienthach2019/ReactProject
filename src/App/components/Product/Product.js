import React from 'react';
import { Grid, Row, Col, Panel, Text } from 'rsuite';

const Product = () => {
  return (
    <>
      <h1>Chào mừng đến với trang bán hàng</h1>
      <Grid fluid>
        <Row>
          {Array.from({ length: 6 }).map((_, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Panel
                header={`Sản phẩm ${index + 1}`}
                bordered
                style={{ marginBottom: 20 }}
              >
                <Text>Thông tin sản phẩm...</Text>
                <Text>Giá: 100,000 VND</Text>
              </Panel>
            </Col>
          ))}
        </Row>
      </Grid>
    </>
  );
};

export default Product;
