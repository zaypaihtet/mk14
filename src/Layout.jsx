import { Outlet } from "react-router";


const Layout = () => {
  return (
   <div className="min-h-screen flex flex-col max-w-[500px] mx-auto">
   <Outlet/>
    </div>
  );
};

export default Layout;