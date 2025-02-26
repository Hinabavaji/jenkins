import { Navbar, Nav, Button,Dropdown  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { LOGOUT_URL } from '@/utilities/api';
import { useRouter } from 'next/router';


const NavbarComponent = () => {
  const [token, SetToken] = useState('');
  const [user, setUser] = useState('');
  const router = useRouter();
  const [selectedMenuItem, setSelectedMenuItem] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      SetToken(storedToken);
    }

    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUser(storedUser);
    }
    setSelectedMenuItem(router.pathname);
  }, [router.pathname]);

  const handleMenuClick = (route) => {
    setSelectedMenuItem(route);  
    router.push(route);          
  };

  const logout = async () => {
    if (!token) return;

    try {
      const response = await fetch(LOGOUT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        SetToken('');
        router.push('/login');
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
    <Navbar expand="lg" className="py-1">
      <Navbar.Brand>
        <img src="/eog.jpg" style={{ height: '50px', width: '250px', marginLeft: '25px' }} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
        <Nav className="d-flex justify-content-center" >
          <Nav.Link
            as="button"
            onClick={() => handleMenuClick('/dashboard')}
            className={`${selectedMenuItem === '/dashboard' ? 'active' : 'inactive'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: selectedMenuItem === '/dashboard' ? '#FF1100' : '#F6F6F6',
              color: selectedMenuItem === '/dashboard' ? 'white' : 'inherit',
              border: 'none',
              padding: '10px 15px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              borderRadius: selectedMenuItem === '/dashboard' ? '80px' : ' 80px 0  0 80px ',
            }}
          >
            Dashboard
          </Nav.Link>

          <Nav.Link
            as="button"
            onClick={() => handleMenuClick('/deviceConfig')}
            className={`${selectedMenuItem === '/deviceConfig' ? 'active' : 'inactive'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: selectedMenuItem === '/deviceConfig' ? '#FF1100' : '#F6F6F6',
              color: selectedMenuItem === '/deviceConfig' ? 'white' : 'inherit',
              border: 'none',
              padding: '10px 15px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              borderRadius: selectedMenuItem === '/deviceConfig' ? '80px' : '0'
            }}
          >
            Device Configuration
          </Nav.Link>

          <Nav.Link
            as="button" 
            onClick={() => handleMenuClick('/monitoring')}
            className={`${selectedMenuItem === '/monitoring' ? 'active' : 'inactive'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: selectedMenuItem === '/monitoring' ? '#FF1100' : '#F6F6F6',
              color: selectedMenuItem === '/monitoring' ? 'white' : 'inherit',
              border: 'none',
              padding: '10px 15px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              borderRadius: selectedMenuItem === '/monitoring' ? '80px' : '0'
            }}
          >
            Monitoring
          </Nav.Link>

          <Nav.Link
            as="button"
            onClick={() => handleMenuClick('/threshold')}
            className={`${selectedMenuItem === '/threshold' ? 'active' : 'inactive'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: selectedMenuItem === '/threshold' ? '#FF1100' : '#F6F6F6',
              color: selectedMenuItem === '/threshold' ? 'white' : 'inherit',
              border: 'none',
              padding: '10px 15px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              borderRadius: selectedMenuItem === '/threshold' ? '80px' : '0'
            }}
          >
            Threshold
          </Nav.Link>

          <Nav.Link
            as="button" 
            onClick={() => handleMenuClick('/user')}
            className={`${selectedMenuItem === '/user' ? 'active' : 'inactive'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: selectedMenuItem === '/user' ? '#FF1100' : '#F6F6F6',
              color: selectedMenuItem === '/user' ? 'white' : 'inherit',
              border: 'none',
              padding: '10px 15px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              borderRadius: selectedMenuItem === '/user' ? '80px' : '0 ',
             
            }}
          >
            User
          </Nav.Link>

          <Nav.Link
            as="button" 
            onClick={() => handleMenuClick('/alerts')}
            className={`${selectedMenuItem === '/alerts' ? 'active' : 'inactive'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: selectedMenuItem === '/alerts' ? '#FF1100' : '#F6F6F6',
              color: selectedMenuItem === '/alerts' ? 'white' : 'inherit',
              border: 'none',
              padding: '10px 15px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              borderRadius: selectedMenuItem === '/alerts' ? '80px' : '0 80px 80px 0',
             
            }}
          >
            Alerts
          </Nav.Link>
          
        </Nav>
      </Navbar.Collapse>

      <Nav className="ms-auto">
        <Nav.Item className="d-flex align-items-center">
          <FontAwesomeIcon icon={faBell} className="text-black me-4" style={{ fontSize: '100%' }} />
          {/* <span className="text-black me-4">{user}</span>
          <Button variant="outline-black" className="me-2" onClick={logout}>
            Logout
          </Button> */}
        </Nav.Item>
      </Nav>

      <Nav className="ms-auto">
          <Nav.Item className="d-flex align-items-center">
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="dropdown-admin" className="text-black">
                <FontAwesomeIcon icon={faUserCircle} className="me-2" style={{ fontSize: '40px' }} />
              </Dropdown.Toggle>

              <Dropdown.Menu >
              <Dropdown.Item >{user}</Dropdown.Item>
                <Dropdown.Item  onClick={logout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav.Item>
        </Nav>
    </Navbar>
  </>
  );
};

export default NavbarComponent;




