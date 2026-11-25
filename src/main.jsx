
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.rtl.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import '@fontsource/cairo/400.css'
import '@fontsource/cairo/600.css'
import '@fontsource/cairo/700.css'

import './index.css'
import App from './App.jsx'
import  UserProvider  from './Context/userProvider.jsx'
import  TermProvider  from './Context/termProvider.jsx'

createRoot(document.getElementById('root')).render(
    <HashRouter>
        <UserProvider>
            <TermProvider>
                <App />
            </TermProvider>
        </UserProvider>
    </HashRouter>
)



