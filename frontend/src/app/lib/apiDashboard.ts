export const fetchUser = async (userName: string) => {
    const response = await fetch(`http://localhost:5000/users/${userName}`);
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