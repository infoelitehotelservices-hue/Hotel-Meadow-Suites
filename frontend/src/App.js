import './App.css';
import HomePage from './pages/HomePage';
import Signup_Login from './pages/auth/Signup_Login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProtectedRoute } from './route/ProtectedRoute';
import AdminHome from './pages/admin/AdminHome';
import ServiceManager from './pages/admin/Services';
import CreateRoom from './pages/admin/Rooms';
import RoomManagement from './pages/admin/ManageRoom';
import AdminDashboard from './pages/admin/AdminDashboard';
import RoomsPage from './pages/RoomsPage';
import BookNowPage from './pages/BookNow';
import VerifyAccount from './pages/auth/VerifyAccount';
import RoomDetails from './pages/RoomDetail';
import OfferManager from './pages/admin/Offers';
import GalleryManager from './pages/admin/Gallery';
import RoomById from './pages/RoomsByType';
import ManageBooking from './pages/admin/Booking';
import UserManagement from './pages/admin/UserMange';
import ForgetPassword from './pages/auth/ForgetPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Page404 from './pages/404';
import Services from './pages/Services';
import Contact from './pages/Contact';
import ViewContacts from './pages/admin/ViewContact';
import Gallery from './pages/Gallery';
import PaymentPage from './pages/PaymentPage';
import RoomTypeManager from './pages/admin/RoomType';
import TestimonialManager from './pages/admin/Testimonials';
import WhatsAppFloat from './components/WhatsAppFloat';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />
    },

    {
      path: "/login",
      // eslint-disable-next-line react/jsx-pascal-case
      element: <Signup_Login />
    },
    {
      path : "/forget-password",
      element: <ForgetPassword />
    },
    {
      path: "/verify-account",
      element: <VerifyAccount />
    },
    {
      path: "/reset-password",
      element: <ResetPassword />
    },
    {
      path: "/payment/:bookingId",
      element: <PaymentPage />
    },
    {
      path: "/Rooms",
      element: <RoomsPage />
    },
    {
      path: "/rooms/:id",
      element: <RoomDetails />
    },
    {
      path: "/roomsbytype/:roomTypeId",
      element: <RoomById />
    },
    {
      path: "/book-now/:roomId",
      element: <BookNowPage />
    },
    {
      path: "/Services",
      element: <Services />
    },
    {
      path: "/contact-us",
      element: <Contact />
    },
    {
      path: "Gallery",
      element: <Gallery />
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute allowedRoles={['Admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "dashboard",
          element: <AdminHome />,
        },
        {
          path: "dashboard/add-services",
          element: <ServiceManager />,
        },
        {
          path: "dashboard/add-rooms",
          element: <CreateRoom />,
        },
        {
          path: "dashboard/manage-rooms",
          element: <RoomManagement />,
        },
        {
          path: "dashboard/manage-booking",
          element: <ManageBooking />,
        },
        {
          path: "dashboard/add-Offers",
          element: <OfferManager />,
        },
        {
          path: "dashboard/add-gallery-picture",
          element: <GalleryManager />,
        },
        {
          path: "dashboard/manage-users",
          element: <UserManagement />,
        },
        {
          path: "dashboard/manage-feedback",
          element: <ViewContacts />,
        },
        {
          path: "dashboard/add-roomtype",
          element: <RoomTypeManager />,
        },
        {
          path: "dashboard/manage-testimonials",
          element: <TestimonialManager />,
        },
      ],
    },
    {
      path: "*",
      element: <Page404 />
    },
    // {
    //   path: "/user",
    //   element: (
    //     <ProtectedRoute allowedRoles={['Admin', 'Client']}>
    //       <User />
    //     </ProtectedRoute>
    //   ),
    // }
  ])
  return (
    <>
      <RouterProvider router={router} />
      <WhatsAppFloat />
    </>
  );
}

export default App;
