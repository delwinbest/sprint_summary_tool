import { useSelector } from "react-redux";

// import Buttons from "views/Components/Buttons.js";
// import Calendar from "views/Calendar/Calendar.js";
// import Charts from "views/Charts/Charts.js";
import Dashboard from "views/Dashboard/Dashboard.js";
import Teams from "views/Teams/Teams.js";
import Users from "views/Users/Users.js";

import UserProfile from "views/Pages/UserProfile";
import UserSettings from "views/UserSettings/UserSettings";
// import ErrorPage from "views/Pages/ErrorPage.js";
// import ExtendedForms from "views/Forms/ExtendedForms.js";
// import ExtendedTables from "views/Tables/ExtendedTables.js";
// import FullScreenMap from "views/Maps/FullScreenMap.js";
// import GoogleMaps from "views/Maps/GoogleMaps.js";
// import GridSystem from "views/Components/GridSystem.js";
// import Icons from "views/Components/Icons.js";
import LoginPage from "views/Pages/LoginPage.js";
// import Notifications from "views/Components/Notifications.js";
// import Panels from "views/Components/Panels.js";
// import RTLSupport from "views/Pages/RTLSupport.js";
// import ReactTables from "views/Tables/ReactTables.js";
import RegisterPage from "views/Pages/RegisterPage.js";
// import RegularForms from "views/Forms/RegularForms.js";
// import RegularTables from "views/Tables/RegularTables.js";
// import SweetAlert from "views/Components/SweetAlert.js";
// import TimelinePage from "views/Pages/Timeline.js";
// import Typography from "views/Components/Typography.js";
// import UserProfile from "views/Pages/UserProfile.js";
// import ValidationForms from "views/Forms/ValidationForms.js";
// import VectorMap from "views/Maps/VectorMap.js";
// import Widgets from "views/Widgets/Widgets.js";
// import Wizard from "views/Forms/Wizard.js";

// @material-ui/icons
// import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
// import DateRange from "@material-ui/icons/DateRange";
// import GridOn from "@material-ui/icons/GridOn";
// import Image from "@material-ui/icons/Image";
import GroupWork from "@material-ui/icons/GroupWork";
import { UserRole } from "@sprintsummarytool/common/build/events/types/user-role";
// import Place from "@material-ui/icons/Place";
// import Timeline from "@material-ui/icons/Timeline";
// import WidgetsIcon from "@material-ui/icons/Widgets";

export var routes = [
  {
    path: "/dashboard",
    name: "Sprint Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/admin",
    sidebarVisible: true,
    userRoleRestrictions: [],
  },
  {
    path: "/teams",
    name: "Teams",
    rtlName: "فريق",
    icon: GroupWork,
    component: Teams,
    layout: "/admin",
    sidebarVisible: true,
    userRoleRestrictions: [],
  },
  {
    path: "/users",
    name: "Users",
    rtlName: "المستعمل",
    icon: PeopleIcon,
    component: Users,
    layout: "/admin",
    sidebarVisible: true,
    userRoleRestrictions: [UserRole.Admin, UserRole.Dev],
  },
  {
    path: "/profile",
    name: "Edit Profile",
    rtlName: "تعديل الملف الشخصي",
    mini: "EP",
    rtlMini: "هعذا",
    component: UserProfile,
    layout: "/admin",
    sidebarVisible: false,
    userRoleRestrictions: [],
  },
  {
    path: "/usersettings",
    name: "User Settings",
    rtlName: "تعديل الملف الشخصي",
    mini: "US",
    rtlMini: "هعذا",
    component: UserSettings,
    layout: "/admin",
    sidebarVisible: false,
    userRoleRestrictions: [],
  },
  {
    path: "/login-page",
    name: "Login Page",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: LoginPage,
    layout: "/auth",
    sidebarVisible: false,
    userRoleRestrictions: [],
  },
  {
    path: "/register-page",
    name: "Register Page",
    rtlName: "تسجيل",
    mini: "R",
    rtlMini: "صع",
    component: RegisterPage,
    layout: "/auth",
    sidebarVisible: false,
    userRoleRestrictions: [],
  },
];

export const renderRouteByRole = (userRoleRestrictions) => {
  const { role: userRole } = useSelector((state) => state.user);
  if (userRoleRestrictions.length === 0) {
    // If no restrictions, render by default
    return true;
  }
  // If restrictions, render only if user has the role assigned
  if (userRoleRestrictions.find((role) => role === userRole)) {
    return true;
  }
  return false;
};
export default routes;
