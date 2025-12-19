import React, { Children } from 'react';
import Sidebar from './Sidebar';
import './Layout.css';
const Layout=({Children})=>{
    return (
        <div className='layout-container'>
            <Sidebar/>
            <main classNAme='main-content'>
                {Children}
            </main>
        </div>

    );
};
export default Layout;