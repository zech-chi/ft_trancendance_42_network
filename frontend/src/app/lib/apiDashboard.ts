export const fetchUser = async (userName: string) => {
  const response = await fetch(`/api/dashboard/users/${userName}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export const fetchUserById = async (userId: number) => {
  const response = await fetch(`/api/dashboard/usersId/${userId}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export const fetchFriendshipStatus = async (userId1: number, userId2: number) => {
const response = await fetch(`/api/dashboard/friends/status?userId1=${userId1}&userId2=${userId2}`, {
  credentials: "include",
});
if (!response.ok) {
  throw new Error(`Error: ${response.status}`);
}
const data = await response.json();
return data;
}

export const fetchGames = async (userId: number, gameType: string) => {
  const response = await fetch(`/api/dashboard/Games/${userId}?gameType=${gameType}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }
  const data = await response.json();
  return data;
}

export const fetchRankData = async () => {
const response = await fetch(`/api/dashboard/rank`, {
  credentials: "include",
});
if (!response.ok) {
  throw new Error(`Error: ${response.status}`);
}
const data = await response.json();
return data;
}

/** friends component */
export const fetchFriends = async (userId: number | null, choice: string) => {
let status: string = '';
if (choice === 'friends') {
    status = 'accepted';
} else if (choice === 'friend request') {
    status = 'pending';
} else if (choice === 'blocked') {
    status = 'blocked';
}
let response ;
if (status !== '')
    response = await fetch(`/api/dashboard/friends/${userId}?status=${status}`, {
      credentials: "include",
    });
else 
    response = await fetch(`/api/dashboard/friends/sentrequest/${userId}?status=pending`, {
      credentials: "include",
    });
if (!response.ok) {
//   throw new Error('Failed to fetch games');
  console.log("Error");
  return [];
}
const data = await response.json();
return data;
}

/* radar chart component api */
export const fetchRadarData = async (userName: string) => {
const response = await fetch(`/api/dashboard/radarData/${userName}`, {
  credentials: "include",
});
if (!response.ok) {
  throw new Error(`Error: ${response.status}`);
}
const data = await response.json();
return data;
}

/* number of Players */
export const fetchNumberOfPlayers = async () => {
  const response = await fetch(`/api/dashboard/rank/numPlayers`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/* calendar data */
export const fetchCalendarData = async (userName: string) => {
  const response = await fetch(`/api/dashboard/Calendar/${userName}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  const data = await response.json();
  console.log("~~~~~~~~~~~~~~~~, ", data);
  return data;
}

export const fetchMakePlayerOnline = async (userId: number, online: boolean) => {
  const response = await fetch(`/api/dashboard/players/${userId}/online`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ online }),
    }
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}