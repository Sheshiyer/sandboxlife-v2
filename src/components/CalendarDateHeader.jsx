import { useEffect, useState } from "react";
import { fetchWeeklyData } from "../utils/supabase";
import { formatDatetime } from "../utils/formatters";

const CalendarComponent = () => {
  const [weeklyData, setweeklyData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = localStorage.getItem("user_id");
        const today = new Date();
        const week = new Date(today);
        week.setDate(today.getDate() - 5);
        const dateFrom = week.toISOString();

        const result = await fetchWeeklyData(storedUserId, dateFrom);

        if (result) {
          setweeklyData(result);
        }
      } catch (error) {
        // Failed to fetch weekly data
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className="sticky right-0 z-10 w-full"
      style={{ zIndex: "1", position: "sticky", top: "6.6vh", left: "0px" }}
    >
      <div className="flex items-center h-auto gap-2 px-3 py-3 text-xs justify-evenly bg-lightpapyrus border border-darkpapyrus rounded-2xl shadow-sm">
      {weeklyData &&
        weeklyData?.sort()?.map((day, index) => (
          <div key={index} className="w-16 h-20 m-auto">
            <div
              className={`relative flex flex-col items-center h-16 rounded-xl border border-transparent ${
                index === 4 &&
                "border-darkpapyrus shadow-[#787878] shadow-md bg-bgpapyrus"
              }`}
            >
              {day?.journal_icon && (
                <img
                  src={day?.journal_icon}
                  alt=""
                  className={`w-12 h-12 my-auto rounded-xl object-cover bg-white shadow-sm ${
                    index === 4 && "w-12 h-12"
                  }`}
                />
              )}
            </div>
            <span className={` font-semibold text-[0.4rem] sm:text-[0.5rem] `}>
              {formatDatetime(day.created_at).date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarComponent;
