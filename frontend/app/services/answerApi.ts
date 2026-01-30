

export const apiCreateAnswer = async (Answer: any) => {
    console.log(
        'ANSWER',Answer
    )


  const res = await fetch(` http://localhost:4000/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Answer),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create question');
  return data;
};


export const apiGetAswerForQuestion = async (id:any) => {
    console.log('answer working')
  const res = await fetch(`http://localhost:4000/answers/${id}`, {
    method: 'GET',
  });

  const data = await res.json();
  console.log(data)
  if (!res.ok) throw new Error(data.message || 'Failed to fetch tags');
  return data;
};