const API_BASE = "http://localhost:8000/api";

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    return { status: "offline", error: String(err) };
  }
}

export async function askAgent(question: string, employeeId = "rahul-sharma") {
  try {
    const res = await fetch(`${API_BASE}/agent/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, employee_id: employeeId }),
    });
    if (!res.ok) throw new Error("Agent call failed");
    return await res.json();
  } catch {
    return null;
  }
}

export async function runCounterfactual(record: Record<string, unknown>, featureChanges: Record<string, number>) {
  try {
    const res = await fetch(`${API_BASE}/simulation/counterfactual`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ record, feature_changes: featureChanges }),
    });
    if (!res.ok) throw new Error("Counterfactual failed");
    return await res.json();
  } catch {
    return null;
  }
}
