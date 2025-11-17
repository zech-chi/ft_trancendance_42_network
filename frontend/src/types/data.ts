import { CustomizationType } from "../types/game";

const themes: CustomizationType[] = [
  {
    theme_ds: "sky",
     textureimage: "https://playground.babylonjs.com/"+"textures/skybox",
      istextureonline: true,
      showpic: "/parchisi_src/sky_pv.jpg",
  },
  {
    theme_ds: "1337",
    textureimage: "/parchisi_src/1337.jpg",
    istextureonline: false,
    showpic: "/parchisi_src/1337_pv.jpeg",

  },
  {
    theme_ds: "sunnyday",
    textureimage: "https://playground.babylonjs.com/"+"textures/TropicalSunnyDay",
    istextureonline: true,
    showpic: "/parchisi_src/sunny_pv.jpg",
  },
  {
    theme_ds: "castle",
    textureimage: "https://playground.babylonjs.com/"+"textures/SpecularHDR.dds",
    istextureonline: true,
    showpic: "/parchisi_src/castle_pv.jpg",
  },
  {
    theme_ds: "city",
    textureimage: "/parchisi_src/city.jpg",
    istextureonline: false,
    showpic: "/parchisi_src/city_pv.jpeg",
  },
  {
    theme_ds: "ert",
    textureimage: "/parchisi_src/ert.jpg",
    istextureonline: false,
    showpic: "/parchisi_src/ert_pv.jpeg",
  },
  {
    theme_ds: "hotel",
    textureimage: "/parchisi_src/Hotel.jpg",
    istextureonline: false,
    showpic: "/parchisi_src/hotel_pv.jpeg",
  },
  {
    theme_ds: "desert",
    textureimage: "/parchisi_src/desert.jpg",
    istextureonline: false,
    showpic: "/parchisi_src/desert_pv.jpeg",
  }
];

export default themes;