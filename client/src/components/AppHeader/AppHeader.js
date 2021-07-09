import React from 'react';

import {
  Header,
  HeaderName,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavLink,
  HeaderMenuButton,
  HeaderGlobalAction,
  HeaderGlobalBar,
  
} from 'carbon-components-react';


import { UserMultiple32,Document32, ColorSwitch32,Logout20 } from '@carbon/icons-react';


import { Link } from 'react-router-dom';

const hideSideNav = () => {
    var sidenav = document.getElementsByClassName('global_sidenav');
    sidenav[0].classList.remove('bx--side-nav--expanded');
}


const AppHeader = ({onClickSideNavExpand,isSideNavExpanded, onClickSignOut,userData}) => {
	
	return (
	<Header aria-label="in App Feedback" onClick={ isSideNavExpanded === true ? onClickSideNavExpand : null}>
	  <SkipToContent />
	  <HeaderMenuButton
		aria-label="Open menu"
		isCollapsible
		onClick={onClickSideNavExpand}
		isActive={isSideNavExpanded}
	  />
	  <HeaderName href="#" prefix="IBM">
		[In App Feedback]
	  </HeaderName>
						<HeaderGlobalBar>
						<HeaderGlobalAction
							aria-label="Logout"							
							isActive
							onClick={(event) => {onClickSignOut(event)}}
						>
						<Logout20 />
						</HeaderGlobalAction>
					</HeaderGlobalBar>
	  <SideNav 
		aria-label="Side navigation" 
		expanded={isSideNavExpanded} className="global_sidenav">
		<SideNavItems>
		  <SideNavLink renderIcon={Document32} element={Link} to="/feedbacks" onClick={hideSideNav}>
			Feedbacks
		  </SideNavLink>
			<SideNavLink renderIcon={ColorSwitch32} element={Link} to="/" onClick={hideSideNav}>
			Widgets
		  </SideNavLink>		  
		  <SideNavLink renderIcon={UserMultiple32} element={Link} to="/admins" onClick={hideSideNav}>
			Teams
		  </SideNavLink>
		</SideNavItems>
	  </SideNav>
	</Header>
	)
};
export default AppHeader;