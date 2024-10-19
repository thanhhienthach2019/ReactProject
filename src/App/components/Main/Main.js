import React, { useState } from 'react';
import {
  Container,
  Header,
  Sidebar,
  Sidenav,
  Content,
  Nav,
  Breadcrumb,
  IconButton,
  HStack,
  Stack,
  Text,
  Dropdown,
  Avatar
} from 'rsuite';
import FakeBrowser from '../FakeBrowser/FakeBrowser';
import { Icon } from '@rsuite/icons';
import { FaReact } from 'react-icons/fa';
import {
  MdDashboard,
  MdGroup,
  MdSettings,
  MdOutlineStackedBarChart,
  MdKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdExitToApp,
  MdOutlineProductionQuantityLimits,
} from 'react-icons/md';
import Product from '../Product/Product';
import { ToastUtils } from '../../utils/ToastUtils';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const [expand, setExpand] = useState(true);
  const [activeComponent, setActiveComponent] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');    
    ToastUtils.success('Đăng xuất thành công!');
    setTimeout(() => {
      // window.location.reload();
      navigate('/login');
    }, 1000);
  };

  const handleMenuClick = (component) => {
    setActiveComponent(component);
  };

  // Chọn component để hiển thị
  const renderContent = () => {
    switch (activeComponent) {
      case 'product':
        return <Product />;
      case 'dashboard':
        return <div>Nội dung Dashboard</div>;
      default:
        return <div>Chào mừng! Vui lòng chọn một mục trong menu.</div>;
    }
  };

  return (
    <FakeBrowser height={800} className="sidebar-page">
      <Container>
        <Sidebar
          style={{ display: 'flex', flexDirection: 'column' }}
          width={expand ? 260 : 56}
          collapsible
        >
          <Sidenav.Header>
            <Brand expand={expand} />
          </Sidenav.Header>
          <Sidenav expanded={expand} defaultOpenKeys={['3']} appearance="subtle">
            <Sidenav.Body>
              <Nav defaultActiveKey="1">
                <Nav.Item eventKey="1" icon={<Icon as={MdDashboard} />} onSelect={() => handleMenuClick('dashboard')}>
                  Dashboard
                </Nav.Item>
                <Nav.Item eventKey="2" icon={<Icon as={MdOutlineProductionQuantityLimits} />} onSelect={() => handleMenuClick('product')}>
                  Product
                </Nav.Item>
                <Nav.Item eventKey="3" icon={<Icon as={MdGroup} />} onSelect={() => handleMenuClick('userGroup')}>
                  User Group
                </Nav.Item>
                <Nav.Menu
                  eventKey="4"
                  trigger="hover"
                  title="Nâng cao"
                  icon={<Icon as={MdOutlineStackedBarChart} />}
                  placement="rightStart"
                >
                  <Nav.Item eventKey="4-1">Geo</Nav.Item>
                  <Nav.Item eventKey="4-2">Devices</Nav.Item>
                  <Nav.Item eventKey="4-3">Brand</Nav.Item>
                  <Nav.Item eventKey="4-4">Loyalty</Nav.Item>
                  <Nav.Item eventKey="4-5">Visit Depth</Nav.Item>
                </Nav.Menu>
                <Nav.Menu
                  eventKey="5"
                  trigger="hover"
                  title="Cài đặt"
                  icon={<Icon as={MdSettings} />}
                  placement="rightStart"
                >
                  <Nav.Item eventKey="5-1">Applications</Nav.Item>
                  <Nav.Item eventKey="5-2">Websites</Nav.Item>
                  <Nav.Item eventKey="5-3">Channels</Nav.Item>
                  <Nav.Item eventKey="5-4">Tags</Nav.Item>
                  <Nav.Item eventKey="5-5">Versions</Nav.Item>
                </Nav.Menu>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
          <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
        </Sidebar>

        <Container>
          <Header className="page-header">
            <HStack justifyContent="space-between">
              <Breadcrumb>
                <Breadcrumb.Item href="#">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Tổng quan</Breadcrumb.Item>
              </Breadcrumb>
              <UserProfile onLogout={handleLogout} />
            </HStack>
          </Header>
          <Content>
            {/* Hiển thị nội dung ở đây */}
            {renderContent()}
          </Content>
        </Container>
      </Container>
    </FakeBrowser>
  );
};

const NavToggle = ({ expand, onChange }) => {
  return (
    <Stack className="nav-toggle" justifyContent={expand ? 'flex-end' : 'center'}>
      <IconButton
        onClick={onChange}
        appearance="subtle"
        size="lg"
        icon={expand ? <MdKeyboardArrowLeft /> : <MdOutlineKeyboardArrowRight />}
      />
    </Stack>
  );
};

const Brand = ({ expand }) => {
  return (
    <HStack className="page-brand" spacing={12}>
      <FaReact size={26} />
      {expand && <Text>Thương hiệu</Text>}
    </HStack>
  );
};

const UserProfile = ({ onLogout }) => {
  return (
    <Dropdown title={<Avatar circle src="https://i.pravatar.cc/300" />} placement="bottomEnd">
      <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
        <p><strong>Tên người dùng</strong></p>
        <small>admin@domain.com</small>
      </Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Item icon={<MdExitToApp />} onSelect={onLogout}>
        Đăng xuất
      </Dropdown.Item>
    </Dropdown>
  );
};

export default Main;
