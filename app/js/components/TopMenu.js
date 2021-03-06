import React from "react";
import { Segment, Menu, Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

export default function TopMenu({ rightMenu, leftMenu, onOptionClick }) {
    return (
        <Segment basic inverted>
            <Menu inverted borderless fixed="top">
                <Menu.Item as={NavLink} to="/" exact>
                    <Icon name="search" />
                    Search
                </Menu.Item>
                <Menu.Item as={NavLink} to="/insert">
                    <Icon name="plus" />
                    Add Contacts
                </Menu.Item>
            </Menu>
        </Segment>
    );
}
