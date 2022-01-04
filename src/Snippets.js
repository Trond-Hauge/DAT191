'use strict';

// Code snippet for header
export function HeaderComponent(){
    return (
        <div className="header">
            <nav>
                <ul className="main-nav">
                    <li>
                        <a>Home</a>
                    </li>
                    <li>
                        <a>Away</a>
                    </li>
                    <li className="navbar-right">
                        <a>Log in</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export function FooterComponent() {
    return (
        <div></div>
    )
}
