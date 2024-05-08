"use client";
import { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Map from "./Map";
import styles from "./componentStyles/mainSection.module.css";

export default function MainSection() {
  const [places, setPlaces] = useState([]);
  const [dayValue, setDayValue] = useState("2024-03-01");

  const handleDateChange = (date) => {
    setDayValue(date.format("YYYY-MM-DD"));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/places/${dayValue}`);
        const data = await res.json();
        setPlaces(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dayValue]);

  return (
    <section className={styles.container}>
      <div className={styles.date_container}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Day Switcher"
            value={dayjs(dayValue)}
            onChange={handleDateChange}
            minDate={dayjs("2024-03-01")}
            maxDate={dayjs("2024-03-05")}
          />
        </LocalizationProvider>
      </div>
      <div className={styles.map_container}>
        <Map data={places} />
      </div>
    </section>
  );
}
