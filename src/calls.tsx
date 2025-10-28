
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

export async function fetchQuestionOrder() {
  const maxRetries = 5;
  const retryDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_ADDRESS}/qkd/question_order`, {
        method: "GET",
      });

      if (!response.ok) {
        console.error(`Error fetching question order: HTTP ${response.status}`);
        return { success: false, error: `HTTP ${response.status}`, questionOrder: [] };
      }

      const data = await response.json();
      const questionOrder = data.question_order || data;

      // Check if the question order is an empty array
      if (Array.isArray(questionOrder) && questionOrder.length === 0) {
        if (attempt < maxRetries) {
          console.log(`Question order is empty, retrying... (attempt ${attempt}/${maxRetries})`);
          // Wait for 1 second before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        } else {
          // After 5 attempts, return error
          console.error('Question order is still empty after 5 attempts');
          return { success: false, error: 'Question order not available after 5 attempts', questionOrder: [] };
        }
      }

      // Success - question order has items
      return { success: true, questionOrder };

    } catch (error) {
      console.error('Error fetching question order:', error);
      return { success: false, error: String(error), questionOrder: [] };
    }
  }

  // Fallback (should not reach here)
  return { success: false, error: 'Failed to fetch question order', questionOrder: [] };
}

export async function submitSSMAnswers(answers: string[]) {
  try {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_ADDRESS}/qkd/submit_selection_and_start_qkd?timetagger_address=${process.env.NEXT_PUBLIC_TIMETAGGER_ADDRESS}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answers)
    });

    if (!response.ok) {
      console.error(`Error submitting SSM answers: HTTP ${response.status}`);
      return { success: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting SSM answers:', error);
    return { success: false, error: String(error) };
  }
}