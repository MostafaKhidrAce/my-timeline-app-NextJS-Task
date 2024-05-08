# Next.js App – Test Project

## Objective:

Create a web application using **Next.js** and **MUI (Material-UI)** that visually represents a user's day timeline on an interactive map.

## Description:

The application will fetch user timeline data from a **Supabase** database and display it on a map using **Google Maps**. Each event in the user's timeline represents a location where the user spent some time. The map should display markers for each location, showing the duration the user spent there. Additionally, the map should adjust its view to fit all markers for a given day, with some offset for better presentation.

### Inputs:

- **Date Range:** `2024-03-01` to `2024-03-05`

### Steps:

1. **Data Retrieval:** Connect to Supabase to fetch user timeline data from the `Places` table.

2. **Map Interface:** Implement an interactive map in React with the following features:

   - Markers at user locations for each day, displaying duration (e.g., `2hrs, 20mins`)
   - Hover info displaying start and end timestamps, along with duration, upon hovering over markers
   - Map window displaying the smallest radius to fit all user locations for the day in one view, with some offset.

3. **Day Switcher:** Create a component to switch between days and update the map accordingly.

4. **Places Data:** Use Foursquare’s Nearby Places API to fetch and display place names and categories, enhancing the marker information.

### References:

- Connect to Supabase: [Supabase Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- Use Google Maps: [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview)
- Connect to Foursquare: [Foursquare Places API](https://docs.foursquare.com/developer/reference/places-nearby)
- Day Switcher Component: [React Date Picker](https://mui.com/x/react-date-pickers/date-picker/)
