
export async function chshPost(basis: number[]) {
  const response = await fetch(`http://127.0.0.1:8000/chsh?follower_node_address=${process.env.NEXT_PUBLIC_FOLLOWER_NODE_ADDRESS}&timetagger_address=${process.env.NEXT_PUBLIC_TIMETAGGER_ADDRESS}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(basis)
  });

  return response;
}

export async function submitFortune() {
  const response = await fetch(`http://127.0.0.1:8000/rng/fortune?timetagger_address=${process.env.NEXT_PUBLIC_TIMETAGGER_ADDRESS}&integration_time_s=0.1&fortune_size=6&channels=1`, {
    method: 'GET',
  });
  const data = await response.json();
  if (!response.ok) {
    return { success: false, data };
  }
  return { success: true, data };
}

export async function ssmPost(basis: number[]) {
  const response = await fetch(`http://127.0.0.1:8000/chsh?follower_node_address=${process.env.NEXT_PUBLIC_FOLLOWER_NODE_ADDRESS}&timetagger_address=${process.env.NEXT_PUBLIC_TIMETAGGER_ADDRESS}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(basis)
  });

  return response;
}