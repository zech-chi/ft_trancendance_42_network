export const fetchUser = async (userName: string) => {
    const response = await fetch(`http://localhost:5002/api/dashboard/users/${userName}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

export const fetchUsers = async () => {
    const response = await fetch(`http://localhost:5000/users/`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
}

export const fetchGames = async (userName: string, gameType: string) => {
    const response = await fetch(`http://localhost:5000/Games/${userName}?gameType=${gameType}`);
    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }
    const data = await response.json();
    return data;
}

export const fetchRankData = async () => {
  const response = await fetch(`http://localhost:5000/rank/`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

/** friends component */
export const fetchFriends = async (userName: string, choice: string) => {
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
      response = await fetch(`http://localhost:5000/Friends/${userName}?status=${status}`);
  else 
      response = await fetch(`http://localhost:5000/SentRequestFriends/${userName}`);
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
  const response = await fetch(`http://localhost:5002/api/dashboard/radarData/${userName}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

// Fetch charts data for the dashboard friends and ai
const fetchChartsData = async (userName: string) => {
  const response = await fetch(`http://localhost:5000/chartsData/${userName}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}