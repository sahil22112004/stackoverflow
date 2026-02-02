// const BASE_URL = process.env.NEXT_PUBLIC_API_URL


const BASE_URL = 'http://localhost:4000'

export const apiRegister = async (user: any) => {
  console.log('working')
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  
  const data = await res.json();
  console.log("service",data)
  if (!res.ok) throw new Error(data.message || 'Register failed');
  return data;
};

export const apiLogin = async (user: any) => {
  const res = await fetch(`${BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const apiGetAllUser = async()=>{
  const res = await fetch(`${BASE_URL}/auth`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data


}

export const apiUserIsBannedUpdate= async (id: string,isBanned:any) => {
  console.log(id,isBanned)
  const res = await fetch(`${BASE_URL}/auth/updateIsBanned/${id}`,{
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(isBanned),
  })
  const data = await res.json()

  if (!res.ok) throw new Error(data.message || 'Failed to fetch question')
  return data
}


