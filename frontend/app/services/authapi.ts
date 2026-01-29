const BASE_URL = process.env.NEXT_PUBLIC_API_URL


export const apiRegister = async (user: any) => {
  console.log('working')
  const res = await fetch(`${BASE_URL}/auth`, {
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