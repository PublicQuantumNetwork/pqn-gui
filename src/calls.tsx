
export async function chshPost(basis: number[]) {
  const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_ADDRESS}/chsh?follower_node_address=${process.env.NEXT_PUBLIC_FOLLOWER_NODE_ADDRESS}&timetagger_address=${process.env.NEXT_PUBLIC_TIMETAGGER_ADDRESS}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(basis)
  });

  return response;
}

export async function submitFortune() {
  const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_ADDRESS}/rng/fortune?timetagger_address=${process.env.NEXT_PUBLIC_TIMETAGGER_ADDRESS}&integration_time_s=0.1&fortune_size=6&channels=1`, {
    method: 'GET',
  });
  const data = await response.json();
  if (!response.ok) {
    return { success: false, data };
  }
  return { success: true, data };
}

export async function ssmPost(basis: number[]) {
  const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_ADDRESS}/chsh?follower_node_address=${process.env.NEXT_PUBLIC_FOLLOWER_NODE_ADDRESS}&timetagger_address=${process.env.NEXT_PUBLIC_TIMETAGGER_ADDRESS}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(basis)
  });

  return response;
}

export async function fetchRotatorAngle() {
  try {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_ADDRESS}/serial/`);

    if (!response.ok) {
      console.error(`Error fetching rotator angle: HTTP ${response.status}`);
      return { success: false, theta: 0 };
    }

    const data = await response.json();
    return { success: true, theta: data.theta || 0 };
  } catch (error) {
    console.error('Error fetching rotator angle:', error);
    return { success: false, theta: 0 };
  }
}

export async function resetBackendState() {
  const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_ADDRESS}/coordination/reset_coordination_state`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  return response

}
export async function requestFollower() {
  try {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_ADDRESS}/coordination/collect_follower?address=${process.env.NEXT_PUBLIC_FOLLOWER_NODE_ADDRESS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      console.error(`Error requesting follower: HTTP ${response.status}`);
      return { success: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error requesting follower:', error);
    return { success: false, error: String(error) };
  }
}