import { useState } from "react";
import {
  basketballMarkerImage,
  footballMarkerImage,
  gymMarkerImage,
  pingPongMarkerImage,
  runningMarkerImage,
  swimmingMarkerImage,
  tennisMarkerImage,
  yogaMarkerImage,
} from "../assets";

const useDashboardProps = () => {
  const dummyMarkerData = [
    {
      id: "1",
      name: "Mansehra",
      latitude: 34.3307,
      longitude: 73.1968,
      sport: "football",
      title: "Exciting Football Match",
      placeImage: footballMarkerImage,
      time: "5:00 PM",
      date: "2024-07-20",
      location: "Stadium A",
      currentPlayers: 8,
      maxPlayers: 10,
      level: "Intermediate",
      players: [
        { profilePicture: "https://example.com/player1.jpg", name: "John Doe" },
        {
          profilePicture: "https://example.com/player2.jpg",
          name: "Jane Smith",
        },
      ],
    },
    {
      id: "2",
      name: "Abbottabad",
      latitude: 34.1688,
      longitude: 73.2215,
      sport: "basketball",
      title: "Intense Basketball Game",
      placeImage: basketballMarkerImage,
      time: "3:00 PM",
      date: "2024-07-21",
      location: "Court B",
      currentPlayers: 5,
      maxPlayers: 10,
      level: "Advanced",
      players: [
        {
          profilePicture: "https://example.com/player3.jpg",
          name: "Alice Johnson",
        },
        {
          profilePicture: "https://example.com/player4.jpg",
          name: "Bob Brown",
        },
      ],
    },
    {
      id: "3",
      name: "Naran",
      latitude: 34.9086,
      longitude: 73.6558,
      sport: "gym",
      title: "Morning Gym Session",
      placeImage: gymMarkerImage,
      time: "6:00 AM",
      date: "2024-07-22",
      location: "Gym C",
      currentPlayers: 10,
      maxPlayers: 20,
      level: "Beginner",
      players: [
        {
          profilePicture: "https://example.com/player5.jpg",
          name: "Chris Evans",
        },
        {
          profilePicture: "https://example.com/player6.jpg",
          name: "Scarlett Johansson",
        },
      ],
    },
    {
      id: "4",
      name: "Haripur",
      latitude: 33.9946,
      longitude: 72.9335,
      sport: "pingpong",
      title: "Ping Pong Championship",
      placeImage: pingPongMarkerImage,
      time: "4:00 PM",
      date: "2024-07-23",
      location: "Table Tennis Hall D",
      currentPlayers: 4,
      maxPlayers: 8,
      level: "Professional",
      players: [
        {
          profilePicture: "https://example.com/player7.jpg",
          name: "Tony Stark",
        },
        {
          profilePicture: "https://example.com/player8.jpg",
          name: "Steve Rogers",
        },
      ],
    },
    {
      id: "5",
      name: "Havelian",
      latitude: 34.0533,
      longitude: 73.16,
      sport: "running",
      title: "Morning Run",
      placeImage: runningMarkerImage,
      time: "7:00 AM",
      date: "2024-07-24",
      location: "Park E",
      currentPlayers: 15,
      maxPlayers: 30,
      level: "All Levels",
      players: [
        {
          profilePicture: "https://example.com/player9.jpg",
          name: "Bruce Banner",
        },
        {
          profilePicture: "https://example.com/player10.jpg",
          name: "Natasha Romanoff",
        },
      ],
    },
    {
      id: "6",
      name: "Kashmiri Bazar, Mansehra",
      latitude: 34.3337,
      longitude: 73.2,
      sport: "swimming",
      title: "Swimming Gala",
      placeImage: swimmingMarkerImage,
      time: "2:00 PM",
      date: "2024-07-25",
      location: "Swimming Pool F",
      currentPlayers: 20,
      maxPlayers: 40,
      level: "Intermediate",
      players: [
        {
          profilePicture: "https://example.com/player11.jpg",
          name: "Clint Barton",
        },
        {
          profilePicture: "https://example.com/player12.jpg",
          name: "Wanda Maximoff",
        },
      ],
    },
    {
      id: "7",
      name: "Sabzi Mandi, Mansehra",
      latitude: 34.331,
      longitude: 73.1985,
      sport: "tennis",
      title: "Tennis Tournament",
      placeImage: tennisMarkerImage,
      time: "11:00 AM",
      date: "2024-07-26",
      location: "Tennis Court G",
      currentPlayers: 6,
      maxPlayers: 12,
      level: "Advanced",
      players: [
        {
          profilePicture: "https://example.com/player13.jpg",
          name: "Peter Parker",
        },
        {
          profilePicture: "https://example.com/player14.jpg",
          name: "Miles Morales",
        },
      ],
    },
    {
      id: "8",
      name: "Gandhiyaan, Mansehra",
      latitude: 34.34,
      longitude: 73.21,
      sport: "yoga",
      title: "Yoga Retreat",
      placeImage: yogaMarkerImage,
      time: "8:00 AM",
      date: "2024-07-27",
      location: "Yoga Center H",
      currentPlayers: 12,
      maxPlayers: 25,
      level: "All Levels",
      players: [
        {
          profilePicture: "https://example.com/player15.jpg",
          name: "Stephen Strange",
        },
        { profilePicture: "https://example.com/player16.jpg", name: "Wong" },
      ],
    },
  ];
  const chooseMarkerImage = (sport) => {
    switch (sport) {
      case "football":
        return footballMarkerImage;

      case "basketball":
        return basketballMarkerImage;

      case "gym":
        return gymMarkerImage;

      case "pingpong":
        return pingPongMarkerImage;

      case "running":
        return runningMarkerImage;

      case "swimming":
        return swimmingMarkerImage;

      case "tennis":
        return tennisMarkerImage;

      case "yoga":
        return yogaMarkerImage;
    }
  };
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [sportsDetailsModalVisible, setSportsDetailsModalVisible] =
    useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [rooms, setRooms] = useState<Room[]>([]);
  const handleMarkerPress = (markerData: any) => {
    console.log(" markerData sent to maker", markerData);
    console.log("userId", markerData?.location?.userId);

    setSelectedMarkerData(markerData);

    setSportsDetailsModalVisible(true);
  };
  const [isMemberDetailsVisible, setIsMemberDetailsVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  return {
    dummyMarkerData,
    chooseMarkerImage,
    selectedMarkerData,
    setSelectedMarkerData,
    sportsDetailsModalVisible,
    setSportsDetailsModalVisible,
    userLocation,
    setUserLocation,
    isMapExpanded,
    setIsMapExpanded,
    isDropdownVisible,
    setIsDropdownVisible,
    searchQuery,
    setSearchQuery,
    weather,
    setWeather,
    weatherLoading,
    setWeatherLoading,
    weatherError,
    setWeatherError,
    isCelsius,
    setIsCelsius,
    userRole,
    setUserRole,
    rooms,
    setRooms,
    handleMarkerPress,
    isMemberDetailsVisible,
    setIsMemberDetailsVisible,
    selectedMember,
    setSelectedMember,
  };
};
export default useDashboardProps;
