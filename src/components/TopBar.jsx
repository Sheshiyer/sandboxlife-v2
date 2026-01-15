// import React, { useContext, useEffect, useRef, useState } from "react";
// import {
//   Bars4Icon,
//   PlusIcon,
//   BookOpenIcon,
//   CalendarIcon,
//   LightBulbIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/solid";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { fetchAllEntries } from "../utils/supabase";
// import logo from "../assets/otherImg/sandBoxLifeR.png";
// import { Context } from "../utils/helpers";
// import sandboxlife from "../assets/sandboxlife.png";
// import "../App.css"; 
// const TopBar = ({ toggleMenu }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   //Check activity//
//   const monthAndRef = useRef();
//   const [value, setValue] = useState("");
//   const [open, setOpen] = useState(false);
//   const [totalDays, setTotalDays] = useState();
//   const [total, setTotal] = useState();
//   const [monthAndYear, setMonthAndYear] = useState("");
//   const [userId, setUserId] = useState(null);
//   const [context, setContext] = useContext(Context);
//   const {pathname} = useLocation();
//   const currentPath = pathname.split("/")[1]
//   const navigate = useNavigate()

//   function getUserIdFromStorage() {
//     const storedUserId = localStorage.getItem('user_id');
//     setUserId(storedUserId);
//   }
//   useEffect(() => {
//     getUserIdFromStorage();
//   }, []);


//   const handleCheckActivity = (e) => {
//     setContext(e.target.value)
//     console.log(currentPath);
//     if(currentPath != "my-calendar"){
//       navigate(`/my-calendar/${userId}`)
//     }
//   }


//   useEffect(() => {
//     const handleAllData = async (selectedMonth) => {
//       try {
//         const storedUserId = localStorage.getItem("user_id");
//         const date = new Date(selectedMonth);
//         const month = date.toLocaleString("default", { month: "long" });
//         const year = date.getFullYear();
//         const startDay = date.toISOString();
//         date.setMonth(date.getMonth() + 1);
//         date.setDate(date.getDate() - 1);
//         const lastDay = date.toISOString();
//         const result = await fetchAllEntries(storedUserId, startDay, lastDay);

//         if (result.length >= 0) {
//           const newDataArray = new Array(31).fill(null).map(() => []);
//           result.forEach((entry) => {
//             const dayOfMonth = new Date(entry.created_at).getDate();
//             newDataArray[dayOfMonth - 1].push(entry);
//           });
//           setTotal(newDataArray);
//           setOpen(true);
//           setTotalDays(date.getDate());
//           setMonthAndYear(`${month}-${year}`);
//         } else {
//           toast.error("Somthing wrong❗");
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     value.length > 0 && handleAllData(value);
//   }, [value]);

//   return (
//     <div className="fixed top-0 left-0 right-0 z-50 shadow-md bg-darkpapyrus">
//       <div className="container flex items-center justify-between px-2 py-2 mx-auto">
//         <div className="flex items-center ">
//           <Bars4Icon className="w-6 h-6" onClick={toggleMenu} />
//           <div className="flex justify-center ml-2">
//             <a href="#">
//               <img alt="" className="h-6 md:h-8 " src={sandboxlife} />
//             </a>
//           </div>
//         </div>
//         <div className="flex-grow">
//           <div className="relative max-w-md mx-auto">
//             {/* <input
//               type="text"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={handleSearch}
//               className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <svg
//               className="absolute top-0 w-6 h-6 mt-3 text-gray-500 right-3"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg> */}
//             <div className="hidden mx-auto text-sm rounded-md  sm:flex w-min text-start">
//               <input
//                 type="month"
//                 className=" rounded-md px-1 cursor-pointer hover:bg-darkpapyrus w-[8rem] "
//                 value={context&&context}
//                 onChange={handleCheckActivity}
//               />
//               <p className="ml-2 font-semibold text-center right-5 text-nowrap ">
//                 Check activity
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="flex ">
//           {/* Dropdown Button */}
//           <div className="relative ">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center ml-1 text-gray-800 hover:text-gray-600 "
//             >
//               <PlusIcon className="w-5 h-5 mx-1" />
//               <span className=" text-[0.7rem] md:text-lg font-bold ">New</span>
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute right-0 z-20 w-48 py-2 mt-2 bg-white border rounded-md shadow-xl bg-darkpapyrus">
//                 <a
//                   href="#"
//                   className="flex items-center justify-start px-2 py-2 text-sm text-gray-700 capitalize  hover:bg-blue-500 hover:text-white"
//                 >
//                   <BookOpenIcon className="inline w-5 h-5 " />
//                   {/* Book Journal */}
//                   <Link
//                     to="/bookjourney"
//                     className="px-2 py-1 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none"
//                   >
//                     Book
//                   </Link>
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center justify-start px-2 py-2 text-sm text-gray-700 capitalize  hover:bg-blue-500 hover:text-white"
//                 >
//                   <CalendarIcon className="inline w-5 h-5 " />
//                   {/* Daily Journal */}
//                   <Link
//                     to="/dailyjournal"
//                     className="px-2 py-1 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none"
//                   >
//                     Daily
//                   </Link>
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center justify-start px-2 py-1 text-sm text-gray-700 capitalize hover:bg-blue-500 hover:text-white"
//                 >
//                   <LightBulbIcon className="inline w-5 h-5 " />
//                   {/* Thoughts of the Day */}
//                   <Link
//                     to="/thoughtoftheday"
//                     className="px-2 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none"
//                   >
//                     Update Status
//                   </Link>
//                 </a>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="flex mx-auto text-sm rounded-md  sm:hidden w-min text-start">
//         <input
//           type="month"
//           className=" rounded-md px-1 cursor-pointer hover:bg-darkpapyrus w-[8rem] "
//           value={context&&context}
//                 onChange={handleCheckActivity}
//         />
//         <p className="ml-2 font-semibold text-center right-5 text-nowrap ">
//           Check activity
//         </p>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default TopBar;



// import React, { useContext, useEffect, useState } from "react";
// import {
//   Bars4Icon,
//   PlusIcon,
//   BookOpenIcon,
//   CalendarIcon,
//   LightBulbIcon,
// } from "@heroicons/react/24/solid";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { DatePicker } from "rsuite";
// import "rsuite/dist/rsuite.min.css";
// import { Context } from "../utils/helpers";
// import sandboxlife from "../assets/sandboxlife.png";
// import "../App.css"; 

// const TopBar = ({ toggleMenu }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedMonthYear, setSelectedMonthYear] = useState("");
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [context, setContext] = useContext(Context);
//   const { pathname } = useLocation();
//   const currentPath = pathname.split("/")[1];
//   const navigate = useNavigate();

//   const handleDateChange = (date) => {
//     const formattedDate = new Date(date).toISOString().slice(0, 7); // Format as YYYY-MM
//     setSelectedDate(date);
//     setContext(formattedDate);
//     if (currentPath !== "my-calendar") {
//       navigate(`/my-calendar/${userId}`);
//     }
//   };
  

//   useEffect(() => {
//     const getUserIdFromStorage = () => {
//       const storedUserId = localStorage.getItem("user_id");
//       setUserId(storedUserId);
//     };
//     getUserIdFromStorage();
//   }, []);

//   return (
//     <div
//       style={{
//         position: "sticky",
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 50,
//         backgroundColor: "#e5e5c7", // bg-darkpapyrus equivalent
//         boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "10px 15px",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <Bars4Icon
//             style={{ width: "24px", height: "24px", cursor: "pointer" }}
//             onClick={toggleMenu}
//           />
//           <div style={{ marginLeft: "10px" }}>
//             <a href="#">
//               <img
//                 alt="Sandbox Life"
//                 style={{ height: "30px", objectFit: "contain" }}
//                 src={sandboxlife}
//               />
//             </a>
//           </div>
//         </div>
//         <div style={{ flex: 0.2, textAlign: "center",width:"90%",  maxWidth: "300px" }}>
//           <DatePicker
//             block
//             format="MMMM yyyy"
//             placeholder="Check activity"
//             value={selectedDate}
//             onChange={handleDateChange}
//             oneTap
//             cleanable={false}
            
//             style={{
//               // padding: "5px 10px",
//               fontSize: "14px",
//               // backgroundColor: "#555",
//               color: "white",
//               // borderRadius: "5px",
//               border: "none",
//               cursor: "pointer",
//             }}

//             menuStyle={{
//               backgroundColor: "green", // Dark background for the calendar menu
//               color: "white", // Text color for visibility
//               border: "1px solid black", // Black border for the popup
//               maxHeight: "200px", // Ensures a scrollable calendar dropdown
//               overflowY: "auto", // Adds vertical scrolling
//               scrollbarWidth: "thin", // For thin scrollbar
//             }}
//             placement="bottom"
//           />
//         </div>
//         <div style={{ position: "relative" }}>
//           <button
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               fontSize: "14px",
//               backgroundColor: "transparent",
//               border: "none",
//               cursor: "pointer",
//               color: "#333",
//             }}
//           >
//             <PlusIcon style={{ width: "20px", height: "20px", marginRight: "5px" }} />
//             New
//           </button>
//           {isDropdownOpen && (
//             <div
//               style={{
//                 position: "absolute",
//                 top: "100%",
//                 right: 0,
//                 backgroundColor: "#f4efe3",
//                 border: "1px solid #ddd",
//                 borderRadius: "5px",
//                 boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
//                 width: "150px",
//                 zIndex: 100,
//               }}
//             >
//               <Link
//                 to="/bookjourney"
//                 style={{
//                   display: "block",
//                   padding: "10px",
//                   fontSize: "14px",
//                   textDecoration: "none",
//                   color: "#333",
//                   borderBottom: "1px solid #ddd",
//                 }}
//               >
//                 <BookOpenIcon style={{ width: "16px", marginRight: "5px" }} />
//                 Book
//               </Link>
//               <Link
//                 to="/dailyjournal"
//                 style={{
//                   display: "block",
//                   padding: "10px",
//                   fontSize: "14px",
//                   textDecoration: "none",
//                   color: "#333",
//                   borderBottom: "1px solid #ddd",
//                 }}
//               >
//                 <CalendarIcon style={{ width: "16px", marginRight: "5px" }} />
//                 Daily
//               </Link>
//               <Link
//                 to="/thoughtoftheday"
//                 style={{
//                   display: "block",
//                   padding: "10px",
//                   fontSize: "14px",
//                   textDecoration: "none",
//                   color: "#333",
//                 }}
//               >
//                 <LightBulbIcon style={{ width: "16px", marginRight: "5px" }} />
//                 Update Status
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default TopBar;





import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import {
  Bars4Icon,
  PlusIcon,
  BookOpenIcon,
  CalendarIcon,
  LightBulbIcon,
  XMarkIcon,
  HomeIcon,
  MinusIcon,
  BellIcon,
} from "@heroicons/react/24/solid";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { Context } from "../utils/context";
import { useAccessibility } from "../context/AccessibilityContext";
import { getPendingRequests, subscribeToFriendRequests } from "../utils/social";
import sandboxlife from "../assets/sandboxlife.png";
import "../App.css"; 
import { useGameMode } from "../context/GameModeContext";

const TopBar = ({ toggleMenu }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [userId, setUserId] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [, setContext] = useContext(Context);
  const { pathname } = useLocation();
  const currentPath = pathname.split("/")[1];
  const navigate = useNavigate();
  const { fontSize, increaseFontSize, decreaseFontSize, FONT_SIZES } = useAccessibility();
  const { isGameMode } = useGameMode();

  const handleDateChange = (date) => {
    const formattedDate = new Date(date).toISOString().slice(0, 7); // Format as YYYY-MM
    setSelectedDate(date);
    setContext(formattedDate);
    if (currentPath !== "my-calendar") {
      navigate(`/my-calendar/${userId}`);
    }
  };
  
  const handleHomeClick = () => {
    if (userId) {
      navigate(isGameMode ? `/dashboard-v2/${userId}` : `/home/${userId}`);
    }
  };

  useEffect(() => {
    const getUserIdFromStorage = () => {
      const storedUserId = localStorage.getItem("user_id");
      setUserId(storedUserId);
    };
    getUserIdFromStorage();
  }, []);

  // Fetch pending friend requests count
  useEffect(() => {
    if (!userId) return;

    const fetchPendingCount = async () => {
      const result = await getPendingRequests(userId);
      if (result.success) {
        setPendingCount(result.data?.length || 0);
      }
    };

    fetchPendingCount();

    // Subscribe to new friend requests
    const unsubscribe = subscribeToFriendRequests(userId, () => {
      fetchPendingCount();
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="sticky top-0 left-0 right-0 z-50 bg-bgpapyrus border-b border-darkpapyrus">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMenu}
            className="rounded-full border border-darkpapyrus bg-lightpapyrus p-2 shadow-sm transition-all active:scale-95 hover:bg-bgpapyrus"
            aria-label="Open menu"
          >
            <Bars4Icon className="w-5 h-5 text-slate-700" />
          </button>
          <button
            type="button"
            onClick={handleHomeClick}
            className="rounded-full border border-darkpapyrus bg-lightpapyrus p-2 shadow-sm transition-all active:scale-95 hover:bg-bgpapyrus"
            aria-label="Home"
          >
            <HomeIcon className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex justify-center ml-1">
            <button onClick={handleHomeClick} className="hover:opacity-80 transition-opacity">
              <img
                alt="Sandbox Life"
                style={{ height: "28px", objectFit: "contain" }}
                src={sandboxlife}
              />
            </button>
          </div>
        </div>
        <div
          style={{
            flex: 0.2,
            textAlign: "center",
            width: "90%",
            maxWidth: "360px",
          }}
        >
        <div className="relative max-w-md mx-auto rounded-2xl bg-bgpapyrus border border-darkpapyrus px-3 py-2 shadow-inner">
          <DatePicker
            block
            format="MMMM yyyy"
            placeholder="Check activity"
            value={selectedDate}
            onChange={handleDateChange}
            oneTap
            cleanable={false}
            style={{
              fontSize: "14px",
              color: "#2f2f2f",
              border: "none",
              cursor: "pointer",
              backgroundColor: "transparent",
            }}

            menuStyle={{
              backgroundColor: "#fafaf0",
              color: "#3b3b3b",
              border: "1px solid #e5e5c7",
              borderRadius: "16px",
              maxHeight: "240px",
              overflowY: "auto",
              scrollbarWidth: "thin",
            }}
            placement="bottom"
          />
           </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Notifications Bell */}
          <button
            onClick={() => navigate(`/friends/${userId}`)}
            className="relative rounded-full border border-darkpapyrus bg-lightpapyrus p-2 shadow-sm hover:bg-darkpapyrus transition-colors"
            aria-label={`Notifications${pendingCount > 0 ? ` (${pendingCount} pending)` : ""}`}
          >
            <BellIcon className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red text-white text-xs font-bold">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </button>

          {/* Font Size Controls */}
          <div className="hidden sm:flex items-center gap-1 rounded-full border border-darkpapyrus bg-lightpapyrus px-2 py-1 shadow-sm">
            <button
              onClick={decreaseFontSize}
              disabled={fontSize === "small"}
              className="p-1 rounded-full hover:bg-darkpapyrus disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease font size"
              title="Decrease font size"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium w-6 text-center" aria-label={`Current font size: ${FONT_SIZES[fontSize]?.label}`}>
              {fontSize === "small" ? "A" : fontSize === "medium" ? "A" : fontSize === "large" ? "A" : "A"}
            </span>
            <button
              onClick={increaseFontSize}
              disabled={fontSize === "xlarge"}
              className="p-1 rounded-full hover:bg-darkpapyrus disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase font size"
              title="Increase font size"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>

          {/* New Entry Button */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center ml-1 text-gray-800 hover:text-gray-600 rounded-full px-3 py-2 border border-darkpapyrus bg-lightpapyrus shadow-sm"
            >
              <PlusIcon className="w-5 h-5 mx-1" />
              <span className="text-[0.7rem] md:text-lg font-bold">New</span>
            </button>
            {isDropdownOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-3xl border border-darkpapyrus bg-lightpapyrus px-6 py-5 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-serif font-semibold text-slate-800">
                      Start a New Entry
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(false)}
                      className="rounded-full bg-white p-2 border border-darkpapyrus"
                      aria-label="Close new entry"
                    >
                      <XMarkIcon className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Choose a format that feels right today.
                  </p>
                  <div className="mt-5 grid gap-3">
                    <Link
                      to="/dailyjournal"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center justify-between rounded-2xl border border-darkpapyrus bg-white px-4 py-3 text-slate-700 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bgpapyrus border border-darkpapyrus">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-base font-semibold">Daily</div>
                          <div className="text-sm text-slate-600">Short reflections.</div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-slate-600">1-2 min</span>
                    </Link>
                    <Link
                      to="/bookjourney"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center justify-between rounded-2xl border border-darkpapyrus bg-white px-4 py-3 text-slate-700 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bgpapyrus border border-darkpapyrus">
                          <BookOpenIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-base font-semibold">Book</div>
                          <div className="text-sm text-slate-600">Longer story entry.</div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-slate-600">5-10 min</span>
                    </Link>
                    <Link
                      to="/thoughtoftheday"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center justify-between rounded-2xl border border-darkpapyrus bg-white px-4 py-3 text-slate-700 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bgpapyrus border border-darkpapyrus">
                          <LightBulbIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-base font-semibold">Update Status</div>
                          <div className="text-sm text-slate-600">Quick mood check-in.</div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-slate-600">Under 1 min</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

TopBar.propTypes = {
    toggleMenu: PropTypes.func.isRequired
};

export default TopBar;
