import React, { useEffect, useState } from 'react';
import { Grid, Row, Col, Panel, Text, Loader, Message } from 'rsuite';
import axiosInstance from '../../utils/axiosInstance';
// import axios from 'axios';

const Product = () => {
    const [products, setProducts] = useState([]); // State để lưu sản phẩm
    const [loading, setLoading] = useState(true); // State để kiểm tra trạng thái loading
    const [error, setError] = useState(null); // State để lưu thông báo lỗi

    useEffect(() => {
        // Hàm lấy sản phẩm từ API
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get('https://localhost:7241/api/Product',{ withCredentials: true }); // Gọi API
                setProducts(response.data); // Lưu sản phẩm vào state
            } catch (err) {
                setError('Không thể tải sản phẩm'); // Xử lý lỗi
            } finally {
                setLoading(false); // Kết thúc trạng thái loading
            }
        };

        fetchProducts(); // Gọi hàm fetchProducts
    }, []);

    // Hiển thị loader nếu đang tải
    if (loading) {
        return <Loader center size="md" content="Đang tải..." />;
    }

    // Hiển thị thông báo lỗi nếu có
    if (error) {
        return <Message showIcon type="error">{error}</Message>;
    }

    return (
        <Grid>
            <Row>
                {products.map((product) => (
                    <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                        <Panel header={product.name} bordered>
                            {product.imageUrl && (
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    style={{ width: '100%', height: 'auto' }} 
                                />
                            )}
                            <Text>Giá: {product.price.toFixed(2)} VNĐ</Text><br />
                            <Text>Mô tả: {product.description}</Text><br />
                            <Text>Số lượng trong kho: {product.stockQuantity}</Text><br />
                            <Text>Đã bán: {product.sales}</Text><br />
                            <Text>Ngày tạo: {new Date(product.createdAt).toLocaleDateString()}</Text><br />
                        </Panel>
                    </Col>
                ))}
            </Row>
        </Grid>
    );
};

export default Product;
