import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
} from "react-native";

interface CardProps {
  item: any;
}

const { width } = Dimensions.get("window");

const CardComponent: React.FC<CardProps> = ({ item }: CardProps) => {
  return (
    <Pressable style={styles.card}>
      <Image
        resizeMode="contain"
        source={item.placeImage}
        style={styles.image}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.details}>
        {item.time} | {item.date}
      </Text>
      <Text style={styles.details}>{item.location}</Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.details, { fontWeight: "bold" }]}>Level: </Text>
        <Text style={styles.details}>{item.level}</Text>
      </View>
      <View style={{ flexDirection: "row", marginBottom: 5 }}>
        <Text style={[styles.details, { fontWeight: "bold", marginLeft: -3 }]}>
          {" "}
          Players:{" "}
        </Text>
        <Text style={styles.details}>
          {item.currentPlayers}/{item.maxPlayers}
        </Text>
      </View>

      {/* <View style={styles.players}>
        {item.players.map((player: any, index: number) => (
          <Image
            key={index}
            source={player.profilePicture}
            style={styles.playerImage}
          />
        ))}
      </View> */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.42,
    backgroundColor: "#fff",
    borderRadius: 10,

    marginVertical: 5,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 5,
  },
  image: {
    width: "100%",
    height: 80,
    borderRadius: 10,
    marginTop: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  details: {
    fontSize: 14,
    color: "#555",
  },
  players: {
    flexDirection: "row",
    // marginTop: 10,
  },
  playerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    // marginRight: 5,
  },
});

export default CardComponent;
