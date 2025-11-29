import { Message } from "@/app/gzone/chat/types/typesChat"

export const contacts = [
{
  id: 2,
  name: "mohamed",
  username: "mkarim",
  message: "Hello! It's nice to meet you. Is there something I can help you with...",
  avatar: "https://cdn.intra.42.fr/users/db4a3023c112e0d3d3bcf65d84609d6f/mkarim.jpg",
  online: true,
  lastSeen: new Date(Date.now() - 5 * 60 * 1000).getTime(), // 5 minutes ago
},
{
  id: 3,
  name: "zechechafoui",
  username: "zechi",
  message: "Hello! It's nice to meet you. Is there something I can help you with...",
  avatar: "https://cdn.intra.42.fr/users/d450751394f7288bce91b5b7123585d4/zech-chi.jpg",
  online: false,
  lastSeen: new Date(Date.now() - 10 * 60 * 1000).getTime(), // 10 minutes ago

},
{
  id: 4,
  name: "taha",
  username: "tkannane",
  message: "Hello! It's nice to meet you. Is there something I can help you with...",
  avatar: "https://cdn.intra.42.fr/users/48278b81919442a7e864dd8fc9810d81/tkannane.jpg",
  online: true,
  lastSeen: new Date(Date.now() - 15 * 60 * 1000).getTime(), // 15 minutes ago

},
{
  id: 1,
  name: "zakaria",
  username: "zelabbas",
  message: "Hello! It's nice to meet you. Is there something I can help you with...",
  avatar: "https://cdn.intra.42.fr/users/520fcec86c5c997878e60f48d447f0a1/zelabbas.jpg",
  online: true,
  lastSeen: new Date(Date.now() - 2 * 60 * 1000).getTime(), // 2 minutes ago
},
{
  id: 5,
  name: "mohamed takrayout start chat",
  username: "mohtakara",
  message: "Hello! It's nice to meet you. Is there something I can help you with...",
  avatar: "https://cdn.intra.42.fr/users/999ab4136febfd6fb81fb7d0aaea002a/mohtakra.jpg",
  online: false,
  lastSeen: new Date(Date.now() - 20 * 60 * 1000).getTime(), // 20 minutes ago

},
{
  id: 6,
  name: "Youssef Momen",
  username: "youssef",
  message: "Hi there!",
  avatar: "https://cdn.intra.42.fr/users/482db2393d65a8be9100b6c3f1782d36/ymomen.jpg",
  online: true,
  lastSeen: new Date(Date.now() - 60 * 60 * 1000).getTime(), // 1 hour ago
},
{
  id: 7,
  name: "said karim",
  username: "skaim",
  message: "Hello! It's nice to meet you. Is there something I can help you with...",
  avatar: "https://cdn.intra.42.fr/users/73f492a6c8054950e96a3cdc923fba0f/skarim.jpg",
  online: false,
  lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).getTime(), // 2 hours ago
},
{
    id: 8,
    name: "taha boussadan",
    username: "tboussad",
    message: "Hello! It's nice to meet you. Is there something I can help you with...",
    avatar: "https://cdn.intra.42.fr/users/9a6bfae27cee69ffd2749dd460957b63/tboussad.jpg",
    online: true,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).getTime(), // 2 hours ago
    },
//   {
//     id: 9,
//     name: "mohamed takrayout",
//     username: "mohtakara",
//     message: "Hello! It's nice to meet you. Is there something I can help you with...",
//     avatar: "https://cdn.intra.42.fr/users/999ab4136febfd6fb81fb7d0aaea002a/mohtakra.jpg",
//     online: true,
//     lastSeen: new Date(Date.now() - 20 * 60 * 1000).getTime(), // 20 minutes ago
  
//   },
//   {
//   id: 10,
//   name: "zakaria",
//   username: "zelabbas",
//   message: "Hello! It's nice to meet you. Is there something I can help you with...",
//   avatar: "https://cdn.intra.42.fr/users/520fcec86c5c997878e60f48d447f0a1/zelabbas.jpg",
//   online: true,
//   lastSeen: new Date(Date.now() - 2 * 60 * 1000).getTime(), // 2 minutes ago
// },
// {
//   id: 20,
//   name: "mohamed",
//   username: "mkarim",
//   message: "Hello! It's nice to meet you. Is there something I can help you with...",
//   avatar: "https://cdn.intra.42.fr/users/db4a3023c112e0d3d3bcf65d84609d6f/mkarim.jpg",
//   online: true,
//   lastSeen: new Date(Date.now() - 5 * 60 * 1000).getTime(), // 5 minutes ago
// },
// {
//   id: 30,
//   name: "zechechafoui",
//   username: "zechi",
//   message: "Hello! It's nice to meet you. Is there something I can help you with...",
//   avatar: "https://cdn.intra.42.fr/users/d450751394f7288bce91b5b7123585d4/zech-chi.jpg",
//   online: false,
//   // last seen yesterday
//   lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).getTime(), // 1 day ago

// },
// {
//   id: 40,
//   name: "taha",
//   username: "tkannane",
//   message: "Hello! It's nice to meet you. Is there something I can help you with...",
//   avatar: "https://cdn.intra.42.fr/users/48278b81919442a7e864dd8fc9810d81/tkannane.jpg",
//   online: true,
//   lastSeen: new Date(Date.now() - 15 * 60 * 1000).getTime(), // 15 minutes ago

// },
// {
//   id: 50,
//   name: "mohamed takrayout",
//   username: "mohtakara",
//   message: "Hello! It's nice to meet you. Is there something I can help you with...",
//   avatar: "https://cdn.intra.42.fr/users/999ab4136febfd6fb81fb7d0aaea002a/mohtakra.jpg",
//   online: false,
//   // last week ago 
//   lastSeen: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime(), // 1 week ago

// },
// {
//   id: 60,
//   name: "Youssef Momen",
//   username: "youssef",
//   message: "Hi there!",
//   avatar: "https://cdn.intra.42.fr/users/482db2393d65a8be9100b6c3f1782d36/ymomen.jpg",
//   online: true,
//   lastSeen: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).getTime(), // 2 weeks ago
// },
// {
//   id: 70,
//   name: "said karim",
//   username: "skaim",
//   message: "Hello! It's nice to meet you. Is there something I can help you with...",
//   avatar: "https://cdn.intra.42.fr/users/73f492a6c8054950e96a3cdc923fba0f/skarim.jpg",
//   online: false,
//   // last seen 2 weeks ago
//   lastSeen: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).getTime(), // 2 weeks ago
// },
// {
//     id: 80,
//     name: "taha boussadan",
//     username: "tboussad",
//     message: "Hello! It's nice to meet you. Is there something I can help you with...",
//     avatar: "https://cdn.intra.42.fr/users/9a6bfae27cee69ffd2749dd460957b63/tboussad.jpg",
//     online: true,
//     lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).getTime(), // 2 hours ago
//     },
//   {
//     id: 90,
//     name: "mohamed takrayout",
//     username: "mohtakara",
//     message: "Hello! It's nice to meet you. Is there something I can help you with...",
//     avatar: "https://cdn.intra.42.fr/users/999ab4136febfd6fb81fb7d0aaea002a/mohtakra.jpg",
//     online: true,
//     lastSeen: new Date(Date.now() - 20 * 60 * 1000).getTime(), // 20 minutes ago
//   },
]

export const messages: Message[]  = [
{
  id: 1,
  type: "text",
  message: "hey",
  sent: false,
  time: "13:37",
},
{
  id: 2,
  type: "text",
  message: "hi, hru?",
  sent: true,
  time: "13:37",
},
{
  id: 3,
  type: "text",
  message: "this is a long message for test the responsive design of the chat app, it should wrap to the next line and not overflow the container, so we can see how it looks in different screen sizes and orientations",
  sent: false,
  time: "13:38",
},
{
  id: 4,
  type: "text",
  message: "this is a long message for test the responsive design of the chat app, it should wrap to the next line and not overflow the container, so we can see how it looks in different screen sizes and orientations",
  sent: true,
  time: "13:38",
},
{
  id: 5,
  type: "image",
  url:"https://cdn.intra.42.fr/users/48278b81919442a7e864dd8fc9810d81/tkannane.jpg",
  sent: false,
  time: "13:39",
},
{
  id: 6,
  type: "text",
  message: "that look amazing",
  sent: true,
  time: "13:40",
},
{
  id: 7,
  type: "text",
  message: "dsafdsaf",
  sent: true,
  time: "13:41",
},
{
  id: 8,
  type: "text",
  message: "dsafdsad",
  sent: true,
  time: "13:42",
},
{
  id: 10,
  type: "text",
  message: "hey",
  sent: false,
  time: "13:37",
},
{
  id: 11,
  type: "file",
  url: "http://localhost:5000/api/chat/uploads/test.c",
  fileName: "test.c",
  sent: false,
  time: "13:37",
},
{
  id: 12,
  type: "image",
  url: "http://localhost:5000/api/chat/uploads/test.png",
  message: "slkadfsssdsajfdflkasjfklajsdklfjklasdjfls",
  sent: false,
  time: "13:38",
},
{
  id: 13,
  type: "text",
  message: "safsdafjkdsaflkdjasfkldjakljdfsa",
  sent: false,
  time: "13:38",
},
{
  id: 14,
  type: "text",
  message: "this is a long message for test the responsive design of the chat app, it should wrap to the next line and not overflow the container, so we can see how it looks in different screen sizes and orientations",
  sent: false,
  time: "13:39",
},
{
  id: 15,
  type: "image",
  url:"https://cdn.intra.42.fr/users/482db2393d65a8be9100b6c3f1782d36/ymomen.jpg",
  sent: true,
  time: "13:40",
},
{
  id: 16,
  type: "text",
  message: "dsafdsaf",
  sent: true,
  time: "13:41",
},
{
  id: 17,
  type: "text",
  message: "dsafdsad",
  sent: true,
  time: "13:42",
},

{
  id: 18,
  type: "file",
  fileName: "test.pdf",
  url: "http://localhost:5000/api/chat/uploads/test.pdf",
  thumbnailUrl: "http://localhost:5000/api/chat/uploads/test.png",
  sent: true,
  time: "13:42",
},
]

