import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from './navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome,  faChartBar,faCog } from '@fortawesome/free-solid-svg-icons';

const Layout = ({ children }) => {
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('');
    const [submenuOpen, setSubmenuOpen] = useState({});
    const router = useRouter();

    const toggleSideMenu = () => {
        setShowSideMenu(!showSideMenu);
    };

    const handleMenuClick = (route, parentMenu) => {
        router.push(route);
        setSelectedMenuItem(route);
        if (parentMenu) {
            setSubmenuOpen((prev) => ({ ...prev, [parentMenu]: true }));
        }
    };

    const toggleSubMenu = (menu) => {
        setSubmenuOpen((prev) => ({ ...prev, [menu]: !prev[menu] }));
    };

    useEffect(() => {
        setSelectedMenuItem(router.pathname);
    }, [router.pathname]);

    return (
        <>
            <Navbar toggleSideMenu={toggleSideMenu} selectedMenuItem={selectedMenuItem} />
            <div style={{ minHeight: "90vh", display: "flex" }}>
                <div style={{ width: '250px', display: showSideMenu ? 'block' : 'none', backgroundColor: '#EDEDED' }}>
                    <div className="col-md-3 col-lg-2" style={{ width: '250px' }}>
                        <div>
                            <ul className="nav flex-column">
                                {/* <li className="nav-item" style={{ marginTop: '5px' }}>
                                    <button className={`nav-link ${selectedMenuItem === '/dashboard' ? 'active' : 'inactive'}`} onClick={() => handleMenuClick('/dashboard')} style={{ width: '100%', textAlign: 'left' }}>
                                        <FontAwesomeIcon icon={faHome} style={{ marginRight: '15px' }} />
                                        Dashboard
                                    </button>
                                </li> */}
                                <li className="nav-item" style={{ marginTop: '5px' }}>
                                    <button className={`nav-link ${selectedMenuItem === '/networkdashboard' ? 'active' : 'inactive'}`} onClick={() => handleMenuClick('/networkdashboard')} style={{ width: '100%', textAlign: 'left' }}>
                                        <FontAwesomeIcon icon={faHome} style={{ marginRight: '15px' }} />
                                        <b>Dashboard</b>
                                    </button>
                                    <button className={`nav-link ${selectedMenuItem === '/dashboard' ? 'active' : 'inactive'}`} onClick={() => handleMenuClick('/dashboard')} style={{ width: '100%', textAlign: 'left' }}>
                                        <FontAwesomeIcon icon={faHome} style={{ marginRight: '15px' }} />
                                        <b>Dashboard</b>
                                    </button>
                                </li>
                                <li className="nav-item" style={{ marginTop: '5px' }}>
                                    <button className={`nav-link ${selectedMenuItem === '/deviceConfig' ? 'active' : 'inactive'}`} onClick={() => handleMenuClick('/deviceConfig')} style={{ width: '100%', textAlign: 'left' }}>
                                        <FontAwesomeIcon icon={faCog} style={{ marginRight: '15px'}} />
                                        <b>Device Config</b>
                                    </button>
                                </li>

                                <li className="nav-item" style={{ marginTop: '5px' }}>
                                    <button className={`nav-link ${selectedMenuItem === '/threshold' ? 'active' : 'inactive'}`} onClick={() => handleMenuClick('/threshold')} style={{ width: '100%', textAlign: 'left' }}>
                                        <FontAwesomeIcon icon={faChartBar} style={{ marginRight: '15px' }} />
                                        <b>Threshold</b>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div style={{ width: showSideMenu ? `calc(100vw - 250px)` : '100vw' }}> {children}</div>
            </div>
        </>
    );
};

export default Layout;
