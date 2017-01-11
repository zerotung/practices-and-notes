import React from 'react'
import NavLink from './NavLink'

export default React.createClass({
    render() {

        // activeStyle={{ color: 'red' }}

        return (
            <div>
                <h1>React Router Tutorial</h1>
                <ul role="nav">
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/repos">Repos</NavLink></li>
                </ul>

                {this.props.children}
            </div>
        )
    }
})