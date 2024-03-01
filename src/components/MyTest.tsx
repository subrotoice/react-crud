import React from "react";

const MyTest = () => {
  const Genre = {
    id: 1,
    name: "Genre1",
    image_background: "amas.png",
  };
  const Genre2 = {
    id: 2,
    name: "Genre2",
    image_background: "Jaan.png",
  };
  const Genre3 = {
    id: 3,
    name: "Genre2",
    image_background: "Jaan.png",
  };
  const Platform = {
    id: 1,
    name: "Platform_oirginal",
    slug: "platform",
  };

  const gameQuery = {
    genre: Genre,
    platform: Platform,
  };

  let gameQuery2 = { ...gameQuery, Genre2 };

  console.log(gameQuery2);

  return <div>MyTest</div>;
};

export default MyTest;
